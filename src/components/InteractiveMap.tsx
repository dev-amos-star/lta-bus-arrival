import React, { useState, useRef, useEffect, useMemo } from 'react';
import { BusStop, LiveBusLocation } from '../types/bus';
import { SINGAPORE_BUS_STOPS, POPULAR_BUS_SERVICES } from '../data/singaporeBuses';
import { getLiveBusFleet } from '../services/busService';
import {
  ZoomIn,
  ZoomOut,
  Compass,
  Bus,
  Layers,
  MapPin,
  Navigation,
  Accessibility,
  X,
  ArrowRight
} from 'lucide-react';

interface Props {
  selectedStopCode?: string | null;
  onSelectStop: (stopCode: string) => void;
  userLocation?: { lat: number; lng: number } | null;
  highlightedService?: string | null;
  onClearHighlightService?: () => void;
}

// Singapore coordinate bounds
const SG_BOUNDS = {
  minLat: 1.220,
  maxLat: 1.470,
  minLng: 103.600,
  maxLng: 104.050
};

export const InteractiveMap: React.FC<Props> = ({
  selectedStopCode,
  onSelectStop,
  userLocation,
  highlightedService,
  onClearHighlightService
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // View state: center lat, lng and zoom
  const [center, setCenter] = useState<{ lat: number; lng: number }>({
    lat: 1.3040, // Orchard Road default
    lng: 103.8318
  });
  const [zoom, setZoom] = useState<number>(1.7); // Zoom level scale
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [buses, setBuses] = useState<LiveBusLocation[]>([]);
  const [selectedBus, setSelectedBus] = useState<LiveBusLocation | null>(null);
  const [activeFilterService, setActiveFilterService] = useState<string>('all');

  // Load and tick live buses
  useEffect(() => {
    const updateFleet = () => {
      const fleet = getLiveBusFleet(activeFilterService === 'all' ? undefined : activeFilterService);
      setBuses(fleet);
    };

    updateFleet();
    const interval = setInterval(updateFleet, 2000); // 2-second live GPS ticks
    return () => clearInterval(interval);
  }, [activeFilterService]);

  // Synchronize with external selected stop
  useEffect(() => {
    if (selectedStopCode) {
      const stop = SINGAPORE_BUS_STOPS.find(s => s.BusStopCode === selectedStopCode);
      if (stop) {
        setCenter({ lat: stop.Latitude, lng: stop.Longitude });
        setZoom(2.8);
      }
    }
  }, [selectedStopCode]);

  // Coordinate projection helper (lat/lng -> pixel percentage)
  const projectCoords = (lat: number, lng: number) => {
    // Map bounds to 0-100%
    const xPct = ((lng - SG_BOUNDS.minLng) / (SG_BOUNDS.maxLng - SG_BOUNDS.minLng)) * 100;
    // Lat increases upwards, SVG y increases downwards
    const yPct = ((SG_BOUNDS.maxLat - lat) / (SG_BOUNDS.maxLat - SG_BOUNDS.minLat)) * 100;
    return { x: xPct, y: yPct };
  };

  const centerProj = useMemo(() => projectCoords(center.lat, center.lng), [center]);

  // Pan interaction handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true);
    setPanStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning || !containerRef.current) return;
    const dx = e.clientX - panStart.x;
    const dy = e.clientY - panStart.y;
    setPanStart({ x: e.clientX, y: e.clientY });

    // Convert pixel delta to lat/lng delta
    const latDelta = (dy / (containerRef.current.clientHeight * zoom)) * (SG_BOUNDS.maxLat - SG_BOUNDS.minLat);
    const lngDelta = (-dx / (containerRef.current.clientWidth * zoom)) * (SG_BOUNDS.maxLng - SG_BOUNDS.minLng);

    setCenter(prev => ({
      lat: Math.max(SG_BOUNDS.minLat, Math.min(SG_BOUNDS.maxLat, prev.lat + latDelta)),
      lng: Math.max(SG_BOUNDS.minLng, Math.min(SG_BOUNDS.maxLng, prev.lng + lngDelta))
    }));
  };

  const handleMouseUp = () => setIsPanning(false);

  // Zoom handlers
  const handleZoomIn = () => setZoom(prev => Math.min(5, prev + 0.4));
  const handleZoomOut = () => setZoom(prev => Math.max(1, prev - 0.4));
  const handleResetCenter = () => {
    setCenter({ lat: 1.3040, lng: 103.8318 });
    setZoom(1.8);
    setSelectedBus(null);
  };

  const jumpToLocation = (lat: number, lng: number) => {
    setCenter({ lat, lng });
    setZoom(3.0);
  };

  // Active route points for selected service if applicable
  const activeRoutePath = useMemo(() => {
    const serviceKey = highlightedService || (activeFilterService !== 'all' ? activeFilterService : null);
    if (!serviceKey || !POPULAR_BUS_SERVICES[serviceKey]) return null;

    const stops = POPULAR_BUS_SERVICES[serviceKey].routeStops;
    return stops.map(s => projectCoords(s.lat, s.lng));
  }, [highlightedService, activeFilterService]);

  return (
    <div className="relative w-full h-[520px] lg:h-[640px] rounded-3xl bg-slate-950 border border-slate-800 shadow-xl overflow-hidden select-none flex flex-col">
      {/* Top Map Toolbar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left: Quick Location Presets */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md pointer-events-auto shadow-lg overflow-x-auto max-w-[calc(100%-80px)]">
          <button
            onClick={handleResetCenter}
            className="px-2.5 py-1 text-xs font-semibold rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors whitespace-nowrap"
          >
            Central SG
          </button>
          <button
            onClick={() => jumpToLocation(1.3040, 103.8318)}
            className="px-2.5 py-1 text-xs font-medium rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors whitespace-nowrap"
          >
            Orchard
          </button>
          <button
            onClick={() => jumpToLocation(1.3000, 103.8552)}
            className="px-2.5 py-1 text-xs font-medium rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors whitespace-nowrap"
          >
            Bugis
          </button>
          <button
            onClick={() => jumpToLocation(1.2835, 103.8522)}
            className="px-2.5 py-1 text-xs font-medium rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors whitespace-nowrap"
          >
            Raffles Pl
          </button>
          <button
            onClick={() => jumpToLocation(1.3332, 103.7423)}
            className="px-2.5 py-1 text-xs font-medium rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors whitespace-nowrap"
          >
            Jurong East
          </button>
          <button
            onClick={() => jumpToLocation(1.3533, 103.9452)}
            className="px-2.5 py-1 text-xs font-medium rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors whitespace-nowrap"
          >
            Tampines
          </button>
        </div>

        {/* Right: Bus filter selector */}
        <div className="flex items-center gap-1 pointer-events-auto">
          <select
            value={activeFilterService}
            onChange={e => {
              setActiveFilterService(e.target.value);
              if (onClearHighlightService) onClearHighlightService();
            }}
            className="px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200 backdrop-blur-md shadow-lg focus:outline-none focus:border-sky-500"
          >
            <option value="all">All Live Buses</option>
            <option value="190">Bus 190 (CCK - Kg Bahru)</option>
            <option value="65">Bus 65 (Tampines - HBF)</option>
            <option value="14">Bus 14 (Bedok - Clementi)</option>
            <option value="36">Bus 36 (Airport Express)</option>
            <option value="143">Bus 143 (Toa Payoh - Jurong)</option>
            <option value="106">Bus 106 (Marina - Bt Batok)</option>
          </select>
        </div>
      </div>

      {/* Floating Zoom & Compass Controls */}
      <div className="absolute bottom-6 right-4 z-20 flex flex-col gap-1.5 pointer-events-auto">
        {userLocation && (
          <button
            onClick={() => jumpToLocation(userLocation.lat, userLocation.lng)}
            className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-sky-400 hover:text-white hover:bg-sky-600 shadow-xl backdrop-blur-md transition-all active:scale-95"
            title="Focus on My Location"
          >
            <Navigation className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={handleZoomIn}
          className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-200 hover:text-white hover:bg-slate-800 shadow-xl backdrop-blur-md transition-all active:scale-95"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-200 hover:text-white hover:bg-slate-800 shadow-xl backdrop-blur-md transition-all active:scale-95"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetCenter}
          className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 shadow-xl backdrop-blur-md transition-all active:scale-95"
          title="Center Singapore"
        >
          <Compass className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Canvas/SVG Container */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`w-full flex-1 relative cursor-grab active:cursor-grabbing overflow-hidden`}
        style={{ touchAction: 'none' }}
      >
        <svg
          viewBox="0 0 1000 600"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <radialGradient id="oceanGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#080e1c" />
              <stop offset="100%" stopColor="#030712" />
            </radialGradient>
            <filter id="busGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Deep Ocean Water Background */}
          <rect width="1000" height="600" fill="url(#oceanGrad)" />

          {/* Map Content Layer with Transform for Center and Zoom */}
          <g
            transform={`translate(${500 - centerProj.x * 10 * zoom}, ${
              300 - centerProj.y * 6 * zoom
            }) scale(${zoom})`}
          >
            {/* Singapore Mainland stylized outline */}
            <path
              d="M 120 280 C 140 210, 220 180, 310 170 C 370 160, 460 175, 540 180 C 620 190, 710 180, 800 210 C 860 230, 890 280, 880 320 C 860 360, 790 380, 700 395 C 610 410, 520 420, 450 430 C 360 440, 280 430, 200 410 C 140 390, 110 330, 120 280 Z"
              fill="#131c31"
              stroke="#1e293b"
              strokeWidth="2.5"
            />

            {/* Sentosa Island */}
            <ellipse cx="440" cy="460" rx="35" ry="12" fill="#131c31" stroke="#1e293b" strokeWidth="2" />
            {/* Pulau Ubin & Changi fringe */}
            <ellipse cx="800" cy="200" rx="40" ry="14" fill="#131c31" stroke="#1e293b" strokeWidth="2" />

            {/* Major Expressways (PIE, CTE, AYE, ECP) */}
            {/* PIE (Pan Island Expressway) */}
            <path
              d="M 180 340 Q 420 300, 580 310 T 820 260"
              fill="none"
              stroke="#334155"
              strokeWidth="3"
              strokeDasharray="4,2"
              opacity="0.6"
            />
            {/* CTE (Central Expressway) */}
            <path
              d="M 520 210 Q 510 300, 490 390"
              fill="none"
              stroke="#334155"
              strokeWidth="3"
              strokeDasharray="4,2"
              opacity="0.6"
            />
            {/* AYE & ECP Coastway */}
            <path
              d="M 200 390 Q 380 410, 520 415 T 840 330"
              fill="none"
              stroke="#334155"
              strokeWidth="2.5"
              strokeDasharray="4,2"
              opacity="0.6"
            />

            {/* Highlighted Bus Route Transit Line if active */}
            {activeRoutePath && activeRoutePath.length > 1 && (
              <g>
                <path
                  d={`M ${activeRoutePath.map(p => `${p.x * 10},${p.y * 6}`).join(' L ')}`}
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.85"
                />
                <path
                  d={`M ${activeRoutePath.map(p => `${p.x * 10},${p.y * 6}`).join(' L ')}`}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            )}

            {/* Bus Stop Markers */}
            {SINGAPORE_BUS_STOPS.map(stop => {
              const pos = projectCoords(stop.Latitude, stop.Longitude);
              const isSelected = selectedStopCode === stop.BusStopCode;

              return (
                <g
                  key={stop.BusStopCode}
                  transform={`translate(${pos.x * 10}, ${pos.y * 6})`}
                  onClick={e => {
                    e.stopPropagation();
                    onSelectStop(stop.BusStopCode);
                  }}
                  className="cursor-pointer group"
                >
                  {/* Selection pulse halo */}
                  {isSelected && (
                    <circle r="16" fill="#38bdf8" opacity="0.25" className="animate-ping" />
                  )}

                  {/* Marker Pin */}
                  <circle
                    r={isSelected ? 9 : 6}
                    fill={isSelected ? '#0284c7' : '#1e293b'}
                    stroke={isSelected ? '#ffffff' : '#0ea5e9'}
                    strokeWidth={isSelected ? '2.5' : '1.5'}
                    className="transition-all hover:scale-125"
                  />

                  {/* Stop Code tooltip on zoom or selection */}
                  {(zoom >= 2.2 || isSelected) && (
                    <text
                      y="-12"
                      textAnchor="middle"
                      fill="#e2e8f0"
                      fontSize="9"
                      fontWeight="bold"
                      className="select-none pointer-events-none drop-shadow"
                    >
                      {stop.BusStopCode}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Live Buses Markers moving in real time */}
            {buses.map(bus => {
              const pos = projectCoords(bus.lat, bus.lng);
              const isDD = bus.deckType === 'DD';

              // Load color
              const loadFill =
                bus.load === 'SEA' ? '#10b981' : bus.load === 'SDA' ? '#f59e0b' : '#ef4444';

              return (
                <g
                  key={bus.id}
                  transform={`translate(${pos.x * 10}, ${pos.y * 6})`}
                  onClick={e => {
                    e.stopPropagation();
                    setSelectedBus(bus);
                  }}
                  className="cursor-pointer group"
                >
                  {/* Outer pulse */}
                  <circle r="14" fill={loadFill} opacity="0.2" className="animate-pulse" />

                  {/* Bus Body */}
                  <rect
                    x="-10"
                    y="-8"
                    width="20"
                    height="16"
                    rx="4"
                    fill="#0f172a"
                    stroke={loadFill}
                    strokeWidth="2"
                    filter="url(#busGlow)"
                    className="transition-transform group-hover:scale-110"
                  />

                  {/* Service Number label */}
                  <text
                    x="0"
                    y="3"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="8"
                    fontWeight="800"
                    className="select-none pointer-events-none"
                  >
                    {bus.serviceNo}
                  </text>

                  {/* Double Decker indicator */}
                  {isDD && (
                    <circle cx="8" cy="-8" r="3" fill="#fbbf24" stroke="#0f172a" strokeWidth="1" />
                  )}

                  {/* Direction arrow pointer */}
                  <g transform={`rotate(${bus.bearing})`}>
                    <polygon points="0,-13 -3,-9 3,-9" fill={loadFill} />
                  </g>
                </g>
              );
            })}

            {/* User GPS location marker */}
            {userLocation && (
              <g
                transform={`translate(${projectCoords(userLocation.lat, userLocation.lng).x * 10}, ${
                  projectCoords(userLocation.lat, userLocation.lng).y * 6
                })`}
              >
                <circle r="16" fill="#3b82f6" opacity="0.2" className="animate-ping" />
                <circle r="7" fill="#3b82f6" stroke="#ffffff" strokeWidth="2.5" />
              </g>
            )}
          </g>
        </svg>

        {/* Selected Bus Inspection Popover */}
        {selectedBus && (
          <div className="absolute bottom-4 left-4 z-30 p-4 rounded-2xl bg-slate-900/95 border border-slate-700/80 shadow-2xl backdrop-blur-md max-w-xs animate-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-8 rounded-xl bg-sky-600 text-white font-extrabold flex items-center justify-center text-sm shadow">
                  {selectedBus.serviceNo}
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-200">
                    Live Bus #{selectedBus.id.split('-').pop()}
                  </span>
                  <div className="text-[10px] text-slate-400">
                    {selectedBus.operator} · {selectedBus.deckType === 'DD' ? 'Double Decker' : 'Single Deck'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedBus(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">Next Stop:</span>
                <span className="font-semibold text-slate-200 truncate max-w-[170px]">
                  {selectedBus.nextStopName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">ETA to Stop:</span>
                <span className="font-bold text-sky-400">~{selectedBus.etaMinutes} mins</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Crowd Level:</span>
                <span
                  className={`font-semibold ${
                    selectedBus.load === 'SEA'
                      ? 'text-emerald-400'
                      : selectedBus.load === 'SDA'
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {selectedBus.load === 'SEA'
                    ? 'Seats Available'
                    : selectedBus.load === 'SDA'
                    ? 'Standing Available'
                    : 'Limited Standing'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Speed:</span>
                <span className="font-mono text-slate-300">{selectedBus.speedKmh} km/h</span>
              </div>
            </div>

            <button
              onClick={() => {
                onSelectStop(selectedBus.nextStopCode);
                setSelectedBus(null);
              }}
              className="mt-3 w-full py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>View Next Stop Arrivals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Map Footer status strip */}
      <div className="px-5 py-2.5 bg-slate-900 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Seats</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Standing</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <span>Crowded</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-300" />
            <span>2D = Double Deck</span>
          </span>
        </div>
        <span className="font-mono text-slate-500 hidden sm:inline">
          {buses.length} Active GPS Units
        </span>
      </div>
    </div>
  );
};
