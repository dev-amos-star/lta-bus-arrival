import React from 'react';
import { BusServiceDetail, LiveBusLocation } from '../types/bus';
import { getBusServiceDetail } from '../services/busService';
import {
  X,
  Bus,
  Clock,
  Layers,
  ArrowRight,
  Accessibility,
  Train,
  CheckCircle2,
  Navigation
} from 'lucide-react';

interface Props {
  serviceNo: string | null;
  onClose: () => void;
  onSelectStop: (stopCode: string) => void;
}

export const RouteModal: React.FC<Props> = ({ serviceNo, onClose, onSelectStop }) => {
  if (!serviceNo) return null;

  const detail: BusServiceDetail | null = getBusServiceDetail(serviceNo);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl max-h-[85vh] rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col overflow-hidden"
        role="dialog"
        aria-labelledby="route-modal-title"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-12 rounded-2xl bg-sky-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-sky-600/30">
              {serviceNo}
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-semibold text-slate-300">{detail?.operator || 'LTA Operator'}</span>
                <span aria-hidden="true">·</span>
                <span>{detail?.frequencyRange || '5-12 mins'}</span>
                <span aria-hidden="true">·</span>
                <span>{detail?.firstBus || '05:30'} - {detail?.lastBus || '23:45'}</span>
              </div>
              <h2 id="route-modal-title" className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2 mt-0.5">
                <span className="truncate">{detail?.origin || 'Start'}</span>
                <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="truncate">{detail?.destination || 'Terminus'}</span>
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close route progression"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Buses Active Bar */}
        <div className="px-5 py-3 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-slate-200">Active Live Buses en Route</span>
          </div>
          <span className="text-slate-400 font-mono">
            {detail?.routeStops.length || 0} Key Scheduled Stops
          </span>
        </div>

        {/* Route stops list with progression line */}
        <div className="p-5 overflow-y-auto flex-1 space-y-0">
          {(!detail || detail.routeStops.length === 0) ? (
            <div className="py-12 text-center text-slate-500">
              No route stops mapped for this service yet.
            </div>
          ) : (
            detail.routeStops.map((stop, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === detail.routeStops.length - 1;
              const hasBus = stop.activeBusesHere && stop.activeBusesHere.length > 0;

              return (
                <div key={stop.stopCode} className="relative flex items-start gap-4 group">
                  {/* Vertical line connecting stops */}
                  {!isLast && (
                    <div className="absolute left-[15px] top-[30px] bottom-[-10px] w-0.5 bg-slate-800 group-hover:bg-slate-700 transition-colors" />
                  )}

                  {/* Stop Node Dot */}
                  <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 border-2 border-slate-700 group-hover:border-sky-400 transition-colors shrink-0 mt-0.5">
                    {isFirst ? (
                      <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    ) : isLast ? (
                      <div className="w-3 h-3 rounded-full bg-rose-400" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-slate-400 group-hover:bg-sky-400 transition-colors" />
                    )}
                  </div>

                  {/* Stop Information */}
                  <div className="flex-1 pb-6 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span className="font-mono text-sky-400 font-medium">{stop.stopCode}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-slate-400">{stop.roadName}</span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums font-mono text-slate-500">{stop.distanceKm} km</span>
                        </div>
                        <h4
                          onClick={() => {
                            onSelectStop(stop.stopCode);
                            onClose();
                          }}
                          className="text-sm sm:text-base font-semibold text-slate-200 hover:text-sky-300 transition-colors cursor-pointer truncate mt-0.5"
                          title="Click to view this stop's arrivals"
                        >
                          {stop.description}
                        </h4>

                        {/* MRT connection tags */}
                        {stop.mrtConnections && stop.mrtConnections.length > 0 && (
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <Train className="w-3 h-3 text-slate-500" />
                            {stop.mrtConnections.map(mrt => (
                              <span
                                key={mrt.code}
                                className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${getMrtStyle(
                                  mrt.line
                                )}`}
                              >
                                {mrt.line} {mrt.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* View Stop Button */}
                      <button
                        onClick={() => {
                          onSelectStop(stop.stopCode);
                          onClose();
                        }}
                        className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors shrink-0"
                      >
                        Timings
                      </button>
                    </div>

                    {/* Active bus approaching or at this stop */}
                    {hasBus && (
                      <div className="mt-2.5 p-2.5 rounded-xl bg-sky-950/40 border border-sky-500/30 flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-sky-500 text-slate-950">
                            <Bus className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="font-semibold text-sky-300">
                              Bus approaching ({stop.activeBusesHere![0].deckType === 'DD' ? 'Double Decker' : 'Single Deck'})
                            </span>
                            <div className="text-[11px] text-slate-400">
                              Speed: {stop.activeBusesHere![0].speedKmh} km/h · {stop.activeBusesHere![0].load === 'SEA' ? 'Seats Available' : 'Standing Available'}
                            </div>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-sky-400 text-sm">
                          ~{stop.activeBusesHere![0].etaMinutes}m away
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>Tap any stop to see live arrivals for all passing services</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
