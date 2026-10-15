import {
  BusStop,
  LtaBusArrivalItem,
  LtaBusServiceArrival,
  LtaBusArrivalResponse,
  LiveBusLocation,
  ArrivalTimingFormatted,
  BusCrowdLoad,
  BusDeckType,
  BusOperator,
  BusServiceDetail
} from '../types/bus';
import { SINGAPORE_BUS_STOPS, POPULAR_BUS_SERVICES } from '../data/singaporeBuses';
import { getBackendConfig } from './apiConfig';

/**
 * Calculates distance between two coordinates in meters using the Haversine formula
 */
export function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Internal hash to create stable yet dynamic pseudo-random arrival schedules per stop & service
 */
function getPseudoTimeOffsets(busStopCode: string, serviceNo: string, baseTimeSec: number): [number, number, number] {
  let hash = 0;
  const key = `${busStopCode}_${serviceNo}`;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  const positiveHash = Math.abs(hash);
  
  // Create a cycle of 12 minutes (720 seconds) for arrival progression
  const cyclePeriod = 720; 
  const serviceOffset = (positiveHash % 600);
  const cycleProgress = (baseTimeSec + serviceOffset) % cyclePeriod;

  // Next bus is within 0 to 6 minutes
  const next1Sec = Math.max(0, Math.floor((cyclePeriod - cycleProgress) % 360));
  // Next bus 2 is 5-8 mins after next1
  const next2Sec = next1Sec + 360 + (positiveHash % 180);
  // Next bus 3 is 7-10 mins after next2
  const next3Sec = next2Sec + 480 + ((positiveHash >> 3) % 240);

  return [next1Sec, next2Sec, next3Sec];
}

/**
 * Format an LTA arrival item into user-friendly minutes & labels
 */
export function formatArrivalTiming(arrival: LtaBusArrivalItem | null): ArrivalTimingFormatted | null {
  if (!arrival || !arrival.EstimatedArrival) return null;

  const now = new Date().getTime();
  const arrivalTime = new Date(arrival.EstimatedArrival).getTime();
  const diffMs = arrivalTime - now;
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);

  let minutes: number | 'Arr' | 'Left';
  let formattedTime: string;

  if (diffSec <= 45 && diffSec >= -30) {
    minutes = 'Arr';
    formattedTime = 'Arr';
  } else if (diffSec < -30) {
    minutes = 'Left';
    formattedTime = 'Departed';
  } else if (diffMin <= 1) {
    minutes = 1;
    formattedTime = '1 min';
  } else {
    minutes = diffMin;
    formattedTime = `${diffMin} min`;
  }

  return {
    minutes,
    formattedTime,
    isoString: arrival.EstimatedArrival,
    load: arrival.Load,
    deckType: arrival.Type,
    isWab: arrival.Feature === 'WAB',
    lat: arrival.Latitude ? parseFloat(arrival.Latitude) : undefined,
    lng: arrival.Longitude ? parseFloat(arrival.Longitude) : undefined
  };
}

/**
 * Generates or fetches bus arrivals for a bus stop
 */
export async function fetchBusArrivals(busStopCode: string): Promise<LtaBusServiceArrival[]> {
  const config = getBackendConfig();

  // If custom backend mode is active and endpoint provided, try to fetch from custom backend
  if (config.mode === 'custom_backend' && config.customEndpointUrl) {
    try {
      const url = new URL(config.customEndpointUrl, window.location.origin);
      url.searchParams.set('BusStopCode', busStopCode);
      const headers: Record<string, string> = {
        'Accept': 'application/json'
      };
      if (config.apiKey) {
        headers['AccountKey'] = config.apiKey;
      }

      const res = await fetch(url.toString(), { headers });
      if (res.ok) {
        const data: LtaBusArrivalResponse = await res.json();
        if (data && Array.isArray(data.Services)) {
          return data.Services;
        }
      }
    } catch (err) {
      console.warn('Custom backend fetch failed, falling back to local simulation:', err);
    }
  }

  // Simulation mode: produce accurate LTA DataMall v2 formatted responses
  const stop = SINGAPORE_BUS_STOPS.find(s => s.BusStopCode === busStopCode);
  const servicesList = stop?.services || ['7', '14', '65', '190'];

  const nowSec = Math.floor(Date.now() / 1000);
  const nowMs = Date.now();

  const servicesArrivals: LtaBusServiceArrival[] = servicesList.map((serviceNo) => {
    const [offset1, offset2, offset3] = getPseudoTimeOffsets(busStopCode, serviceNo, nowSec);

    // Operator mapping
    const operator: BusOperator =
      serviceNo === '190' || serviceNo === '960' || serviceNo === '857' ? 'SMRT' :
      serviceNo === '36' || serviceNo === '82' ? 'GAS' :
      serviceNo === '143' || serviceNo === '106' ? 'TTS' : 'SBST';

    // Deck types
    const deckTypes: BusDeckType[] = ['SD', 'DD', 'DD', 'BD'];
    const primaryDeck = serviceNo === '190' || serviceNo === '65' || serviceNo === '14' ? 'DD' : 'SD';

    // Loads
    const loads: BusCrowdLoad[] = ['SEA', 'SEA', 'SDA', 'LSD'];
    const load1 = offset1 < 90 ? 'SDA' : (loads[(nowSec + serviceNo.charCodeAt(0)) % 3]);
    const load2 = loads[(nowSec + 1 + serviceNo.charCodeAt(0)) % 3];
    const load3 = loads[(nowSec + 2 + serviceNo.charCodeAt(0)) % 3];

    // Estimated arrivals
    const arr1Date = new Date(nowMs + offset1 * 1000);
    const arr2Date = new Date(nowMs + offset2 * 1000);
    const arr3Date = new Date(nowMs + offset3 * 1000);

    // Bus Stop coordinates to extrapolate realistic GPS location
    const baseLat = stop?.Latitude || 1.3040;
    const baseLng = stop?.Longitude || 103.8318;
    
    // Position bus 1 somewhere on the approach vector
    const approachFactor1 = Math.min(1, offset1 / 600);
    const bus1Lat = (baseLat + (approachFactor1 * 0.008 * (Math.sin(offset1)))).toFixed(6);
    const bus1Lng = (baseLng + (approachFactor1 * 0.008 * (Math.cos(offset1)))).toFixed(6);

    const bus2Lat = (baseLat + (0.015 * Math.sin(offset2))).toFixed(6);
    const bus2Lng = (baseLng + (0.015 * Math.cos(offset2))).toFixed(6);

    const bus3Lat = (baseLat + (0.025 * Math.sin(offset3))).toFixed(6);
    const bus3Lng = (baseLng + (0.025 * Math.cos(offset3))).toFixed(6);

    const nextBus: LtaBusArrivalItem = {
      OriginCode: '00001',
      DestinationCode: '99999',
      EstimatedArrival: arr1Date.toISOString(),
      Latitude: bus1Lat,
      Longitude: bus1Lng,
      VisitNumber: '1',
      Load: load1,
      Feature: 'WAB',
      Type: primaryDeck
    };

    const nextBus2: LtaBusArrivalItem = {
      OriginCode: '00001',
      DestinationCode: '99999',
      EstimatedArrival: arr2Date.toISOString(),
      Latitude: bus2Lat,
      Longitude: bus2Lng,
      VisitNumber: '1',
      Load: load2,
      Feature: 'WAB',
      Type: deckTypes[(serviceNo.length + 1) % deckTypes.length]
    };

    const nextBus3: LtaBusArrivalItem = {
      OriginCode: '00001',
      DestinationCode: '99999',
      EstimatedArrival: arr3Date.toISOString(),
      Latitude: bus3Lat,
      Longitude: bus3Lng,
      VisitNumber: '1',
      Load: load3,
      Feature: 'WAB',
      Type: 'SD'
    };

    return {
      ServiceNo: serviceNo,
      Operator: operator,
      NextBus: nextBus,
      NextBus2: nextBus2,
      NextBus3: nextBus3
    };
  });

  return servicesArrivals;
}

/**
 * Get dynamic live bus positions for tracking on the map
 */
export function getLiveBusFleet(filterService?: string): LiveBusLocation[] {
  const buses: LiveBusLocation[] = [];
  const now = Date.now() / 1000;

  const targetServices = filterService
    ? [filterService]
    : ['190', '65', '14', '36', '143', '106'];

  targetServices.forEach((serviceNo, sIndex) => {
    const detail = POPULAR_BUS_SERVICES[serviceNo];
    const route = detail?.routeStops || [];
    if (route.length < 2) return;

    // Simulate 2-3 buses per route moving along stop sequences
    const busCount = 3;
    for (let b = 0; b < busCount; b++) {
      const busId = `BUS-${serviceNo}-${b + 1}`;
      // Compute progression across the route stops based on time
      const speedKmh = 28 + ((b + sIndex) % 12);
      const totalStops = route.length;
      const progressCycle = (now * 0.03 + b * (1 / busCount) + (sIndex * 0.15)) % 1;
      
      const exactIndex = progressCycle * (totalStops - 1);
      const stopIdxA = Math.floor(exactIndex);
      const stopIdxB = Math.min(totalStops - 1, stopIdxA + 1);
      const stopA = route[stopIdxA];
      const stopB = route[stopIdxB];

      const segmentFactor = exactIndex - stopIdxA;
      const lat = stopA.lat + (stopB.lat - stopA.lat) * segmentFactor;
      const lng = stopA.lng + (stopB.lng - stopA.lng) * segmentFactor;

      // Bearing calculation
      const dLon = ((stopB.lng - stopA.lng) * Math.PI) / 180;
      const y = Math.sin(dLon) * Math.cos((stopB.lat * Math.PI) / 180);
      const x =
        Math.cos((stopA.lat * Math.PI) / 180) * Math.sin((stopB.lat * Math.PI) / 180) -
        Math.sin((stopA.lat * Math.PI) / 180) * Math.cos((stopB.lat * Math.PI) / 180) * Math.cos(dLon);
      const bearing = Math.round(((Math.atan2(y, x) * 180) / Math.PI + 360) % 360);

      const loads: BusCrowdLoad[] = ['SEA', 'SDA', 'LSD', 'SEA'];
      const load = loads[(b + Math.floor(now / 60)) % loads.length];
      const deckTypes: BusDeckType[] = ['DD', 'DD', 'SD', 'BD'];
      const deckType = serviceNo === '190' || serviceNo === '65' ? 'DD' : deckTypes[b % deckTypes.length];

      buses.push({
        id: busId,
        serviceNo,
        operator: detail?.operator || 'SBST',
        lat,
        lng,
        bearing,
        speedKmh,
        deckType,
        load,
        isWab: true,
        nextStopCode: stopB.stopCode,
        nextStopName: stopB.description,
        etaMinutes: Math.max(1, Math.round((1 - segmentFactor) * 4)),
        routeProgressPercent: Math.round(progressCycle * 100)
      });
    }
  });

  return buses;
}

/**
 * Search bus stops by code, description, road name, or service number
 */
export function searchBusStops(
  query: string,
  userLocation?: { lat: number; lng: number }
): BusStop[] {
  const cleanQuery = query.trim().toLowerCase();
  
  let stops = SINGAPORE_BUS_STOPS.map(stop => {
    let distanceMeters: number | undefined;
    if (userLocation) {
      distanceMeters = calculateDistanceMeters(
        userLocation.lat,
        userLocation.lng,
        stop.Latitude,
        stop.Longitude
      );
    }
    return {
      ...stop,
      distanceMeters
    };
  });

  if (cleanQuery) {
    stops = stops.filter(stop => {
      const matchCode = stop.BusStopCode.toLowerCase().includes(cleanQuery);
      const matchDesc = stop.Description.toLowerCase().includes(cleanQuery);
      const matchRoad = stop.RoadName.toLowerCase().includes(cleanQuery);
      const matchService = stop.services.some(svc => svc.toLowerCase() === cleanQuery || svc.toLowerCase().includes(cleanQuery));
      return matchCode || matchDesc || matchRoad || matchService;
    });
  }

  // If user location is provided, sort by proximity
  if (userLocation) {
    stops.sort((a, b) => (a.distanceMeters ?? 999999) - (b.distanceMeters ?? 999999));
  }

  return stops;
}

/**
 * Retrieve route details for a bus service with active buses mapped onto it
 */
export function getBusServiceDetail(serviceNo: string): BusServiceDetail | null {
  const detail = POPULAR_BUS_SERVICES[serviceNo];
  if (!detail) {
    // Generate a default representation if not in detailed map
    const passingStops = SINGAPORE_BUS_STOPS.filter(s => s.services.includes(serviceNo));
    if (passingStops.length === 0) return null;

    return {
      serviceNo,
      operator: 'SBST',
      origin: passingStops[0]?.Description || 'Terminus',
      destination: passingStops[passingStops.length - 1]?.Description || 'Loop',
      firstBus: '05:45',
      lastBus: '23:30',
      frequencyRange: '6 - 12 mins',
      stopsCount: passingStops.length,
      routeStops: passingStops.map((s, idx) => ({
        stopCode: s.BusStopCode,
        description: s.Description,
        roadName: s.RoadName,
        lat: s.Latitude,
        lng: s.Longitude,
        sequence: idx + 1,
        distanceKm: Number((idx * 1.4).toFixed(1)),
        mrtConnections: s.mrtConnections
      }))
    };
  }

  // Attach live buses on route
  const fleet = getLiveBusFleet(serviceNo);
  const routeStopsWithBuses = detail.routeStops.map(stop => {
    const busesNear = fleet.filter(b => b.nextStopCode === stop.stopCode);
    return {
      ...stop,
      activeBusesHere: busesNear.length > 0 ? busesNear : undefined
    };
  });

  return {
    ...detail,
    routeStops: routeStopsWithBuses
  };
}
