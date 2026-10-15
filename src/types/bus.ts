/**
 * Singapore Land Transport Authority (LTA) DataMall standard types & models
 */

export type BusCrowdLoad = 'SEA' | 'SDA' | 'LSD'; // Seats Available, Standing Available, Limited Standing
export type BusDeckType = 'SD' | 'DD' | 'BD'; // Single Deck, Double Decker, Bendy
export type BusOperator = 'SBST' | 'SMRT' | 'TTS' | 'GAS';

export interface LtaBusArrivalItem {
  OriginCode: string;
  DestinationCode: string;
  EstimatedArrival: string; // ISO 8601 string
  Latitude: string;
  Longitude: string;
  VisitNumber: string;
  Load: BusCrowdLoad;
  Feature: 'WAB' | ''; // Wheelchair Accessible
  Type: BusDeckType;
}

export interface LtaBusServiceArrival {
  ServiceNo: string;
  Operator: BusOperator;
  NextBus: LtaBusArrivalItem | null;
  NextBus2: LtaBusArrivalItem | null;
  NextBus3: LtaBusArrivalItem | null;
}

export interface LtaBusArrivalResponse {
  'odata.metadata': string;
  BusStopCode: string;
  Services: LtaBusServiceArrival[];
}

export interface MrtConnection {
  code: string;
  line: 'NSL' | 'EWL' | 'CCL' | 'DTL' | 'TEL' | 'NEL';
  name: string;
}

export interface BusStop {
  BusStopCode: string;
  RoadName: string;
  Description: string;
  Latitude: number;
  Longitude: number;
  distanceMeters?: number;
  mrtConnections?: MrtConnection[];
  services: string[];
}

export interface LiveBusLocation {
  id: string;
  serviceNo: string;
  operator: BusOperator;
  lat: number;
  lng: number;
  bearing: number; // 0-360 degrees
  speedKmh: number;
  deckType: BusDeckType;
  load: BusCrowdLoad;
  isWab: boolean;
  nextStopCode: string;
  nextStopName: string;
  etaMinutes: number;
  routeProgressPercent: number;
}

export interface BusRouteStop {
  stopCode: string;
  description: string;
  roadName: string;
  lat: number;
  lng: number;
  sequence: number;
  distanceKm: number;
  mrtConnections?: MrtConnection[];
  activeBusesHere?: LiveBusLocation[];
}

export interface BusServiceDetail {
  serviceNo: string;
  operator: BusOperator;
  origin: string;
  destination: string;
  loopStop?: string;
  firstBus: string;
  lastBus: string;
  frequencyRange: string; // e.g. "5 - 12 mins"
  stopsCount: number;
  routeStops: BusRouteStop[];
}

export interface ArrivalTimingFormatted {
  minutes: number | 'Arr' | 'Left';
  formattedTime: string;
  isoString: string;
  load: BusCrowdLoad;
  deckType: BusDeckType;
  isWab: boolean;
  lat?: number;
  lng?: number;
}
