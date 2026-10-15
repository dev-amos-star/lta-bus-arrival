import React, { useState, useEffect } from 'react';
import { BusStop, LtaBusServiceArrival } from '../types/bus';
import { fetchBusArrivals } from '../services/busService';
import { BusArrivalBadge } from './BusArrivalBadge';
import {
  Star,
  MapPin,
  Route,
  RefreshCw,
  Bell,
  BellRing,
  ChevronDown,
  ChevronUp,
  Train
} from 'lucide-react';

interface Props {
  stop: BusStop;
  isFavorite: boolean;
  onToggleFavorite: (stopCode: string) => void;
  onSelectOnMap: (lat: number, lng: number, stopCode: string) => void;
  onViewRoute: (serviceNo: string) => void;
  onTrackBusOnMap?: (lat: number, lng: number) => void;
  refreshKey?: number;
}

export const BusStopCard: React.FC<Props> = ({
  stop,
  isFavorite,
  onToggleFavorite,
  onSelectOnMap,
  onViewRoute,
  onTrackBusOnMap,
  refreshKey
}) => {
  const [arrivals, setArrivals] = useState<LtaBusServiceArrival[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(true);
  const [activeAlerts, setActiveAlerts] = useState<Record<string, boolean>>({});

  const loadArrivalData = async (silent = false) => {
    if (!silent) setLoading(true);
    else setIsRefreshing(true);

    try {
      const data = await fetchBusArrivals(stop.BusStopCode);
      setArrivals(data);
    } catch (err) {
      console.error('Failed to load arrivals for stop', stop.BusStopCode, err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadArrivalData();
  }, [stop.BusStopCode, refreshKey]);

  const toggleAlert = (serviceNo: string) => {
    setActiveAlerts(prev => ({
      ...prev,
      [serviceNo]: !prev[serviceNo]
    }));
  };

  // MRT badge style mapping
  const getMrtStyle = (line: string) => {
    switch (line) {
      case 'NSL':
        return 'bg-red-600/20 text-red-400 border-red-500/30';
      case 'EWL':
        return 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30';
      case 'CCL':
        return 'bg-amber-600/20 text-amber-400 border-amber-500/30';
      case 'DTL':
        return 'bg-blue-600/20 text-blue-400 border-blue-500/30';
      case 'TEL':
        return 'bg-yellow-700/20 text-amber-500 border-amber-600/30';
      case 'NEL':
        return 'bg-purple-600/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-lg shadow-black/20 overflow-hidden transition-all hover:border-slate-700">
      {/* Header section */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Top row: 5-digit code & distance metadata */}
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1 flex-wrap">
              <span className="font-mono font-semibold text-sky-400 bg-sky-950/60 border border-sky-800/40 px-2 py-0.5 rounded-md">
                {stop.BusStopCode}
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-300 font-medium truncate">{stop.RoadName}</span>
              {stop.distanceMeters !== undefined && (
                <>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-emerald-400 font-medium whitespace-nowrap">
                    {stop.distanceMeters < 1000
                      ? `${stop.distanceMeters}m away`
                      : `${(stop.distanceMeters / 1000).toFixed(1)}km away`}
                  </span>
                </>
              )}
            </div>

            {/* Stop Description */}
            <h3 className="text-base sm:text-lg font-bold text-slate-100 truncate">
              {stop.Description}
            </h3>

            {/* MRT Interchange Connections */}
            {stop.mrtConnections && stop.mrtConnections.length > 0 && (
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                <span className="flex items-center gap-1 text-[11px] text-slate-400 mr-1">
                  <Train className="w-3.5 h-3.5 text-slate-400" />
                  <span>MRT:</span>
                </span>
                {stop.mrtConnections.map(mrt => (
                  <span
                    key={mrt.code}
                    className={`inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border ${getMrtStyle(
                      mrt.line
                    )}`}
                  >
                    <span>{mrt.line}</span>
                    <span className="text-slate-400">{mrt.name}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onSelectOnMap(stop.Latitude, stop.Longitude, stop.BusStopCode)}
              className="p-2 rounded-lg text-slate-400 hover:text-sky-400 hover:bg-slate-800 transition-colors"
              title="Show on map"
              aria-label="Show on map"
            >
              <MapPin className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggleFavorite(stop.BusStopCode)}
              className={`p-2 rounded-lg transition-colors ${
                isFavorite
                  ? 'text-amber-400 hover:bg-amber-400/10'
                  : 'text-slate-400 hover:text-amber-400 hover:bg-slate-800'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
            </button>
            <button
              onClick={() => loadArrivalData(true)}
              disabled={isRefreshing}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors disabled:opacity-50"
              title="Refresh arrivals"
              aria-label="Refresh arrivals"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`} />
            </button>
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title={expanded ? 'Collapse' : 'Expand'}
              aria-label={expanded ? 'Collapse' : 'Expand'}
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Services and arrivals list */}
      {expanded && (
        <div className="divide-y divide-slate-800/60">
          {loading ? (
            <div className="p-6 text-center text-sm text-slate-500 flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-sky-400" />
              <span>Fetching real-time predictions...</span>
            </div>
          ) : arrivals.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-500">
              No active buses scheduled for this stop currently.
            </div>
          ) : (
            arrivals.map(service => {
              const hasAlert = !!activeAlerts[service.ServiceNo];
              return (
                <div
                  key={service.ServiceNo}
                  className="p-3.5 sm:p-4 hover:bg-slate-800/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  {/* Left: Bus Service Number and Controls */}
                  <div className="flex items-center justify-between sm:justify-start gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-base sm:text-lg font-black tracking-tight text-white shadow-sm">
                        {service.ServiceNo}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-medium text-slate-400">
                          {service.Operator}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <button
                            onClick={() => onViewRoute(service.ServiceNo)}
                            className="inline-flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300 font-medium"
                          >
                            <Route className="w-3 h-3" />
                            <span>Route</span>
                          </button>
                          <span className="text-slate-600 text-xs">·</span>
                          <button
                            onClick={() => toggleAlert(service.ServiceNo)}
                            className={`inline-flex items-center gap-1 text-[11px] font-medium transition-colors ${
                              hasAlert ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
                            }`}
                            title={hasAlert ? 'Arrival alarm enabled' : 'Set alarm for 2m arrival'}
                          >
                            {hasAlert ? (
                              <>
                                <BellRing className="w-3 h-3 fill-amber-400/20 animate-bounce" />
                                <span>Alert ON</span>
                              </>
                            ) : (
                              <>
                                <Bell className="w-3 h-3" />
                                <span>Alert</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: The 3 arrival timing cards */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                    <BusArrivalBadge
                      arrival={service.NextBus}
                      label="Next"
                      onTrackBus={onTrackBusOnMap}
                    />
                    <BusArrivalBadge
                      arrival={service.NextBus2}
                      label="2nd"
                      onTrackBus={onTrackBusOnMap}
                    />
                    <BusArrivalBadge
                      arrival={service.NextBus3}
                      label="3rd"
                      onTrackBus={onTrackBusOnMap}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </article>
  );
};
