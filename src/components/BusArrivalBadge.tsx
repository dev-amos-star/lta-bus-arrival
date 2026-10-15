import React from 'react';
import { LtaBusArrivalItem, BusCrowdLoad, BusDeckType } from '../types/bus';
import { formatArrivalTiming } from '../services/busService';
import { Accessibility, Layers, ArrowUpRight } from 'lucide-react';

interface Props {
  arrival: LtaBusArrivalItem | null;
  label: string; // "1st", "2nd", "3rd"
  onTrackBus?: (lat: number, lng: number) => void;
}

export const BusArrivalBadge: React.FC<Props> = ({ arrival, label, onTrackBus }) => {
  const formatted = formatArrivalTiming(arrival);

  if (!formatted) {
    return (
      <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900/40 border border-slate-800 text-slate-500 min-w-[76px] text-center">
        <span className="text-[10px] uppercase font-semibold text-slate-600">{label}</span>
        <span className="text-xs font-medium mt-1 text-slate-600">—</span>
      </div>
    );
  }

  // Load color tokens adhering to LTA standard
  const getLoadBadge = (load: BusCrowdLoad) => {
    switch (load) {
      case 'SEA':
        return { text: 'Seats', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
      case 'SDA':
        return { text: 'Standing', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
      case 'LSD':
        return { text: 'Crowded', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
      default:
        return { text: 'Normal', color: 'text-slate-400 bg-slate-800 border-slate-700' };
    }
  };

  const loadInfo = getLoadBadge(formatted.load);

  // Deck Type label
  const getDeckLabel = (type: BusDeckType) => {
    if (type === 'DD') return 'Double';
    if (type === 'BD') return 'Bendy';
    return 'Single';
  };

  const isArr = formatted.minutes === 'Arr' || formatted.minutes === 0;

  return (
    <div
      onClick={() => {
        if (formatted.lat && formatted.lng && onTrackBus) {
          onTrackBus(formatted.lat, formatted.lng);
        }
      }}
      className={`relative flex flex-col p-2.5 rounded-xl border transition-all ${
        formatted.lat && formatted.lng ? 'cursor-pointer hover:border-sky-500/50' : ''
      } ${
        isArr
          ? 'bg-emerald-950/30 border-emerald-500/40'
          : 'bg-slate-900/80 border-slate-800/90'
      } min-w-[82px] sm:min-w-[92px]`}
      title={formatted.lat ? 'Click to locate this bus on map' : undefined}
    >
      <div className="flex items-center justify-between gap-1 text-[10px] text-slate-400">
        <span className="font-semibold uppercase tracking-wider text-slate-500">{label}</span>
        <div className="flex items-center gap-1">
          {formatted.isWab && (
            <Accessibility className="w-3 h-3 text-sky-400" aria-label="Wheelchair Accessible" />
          )}
          {formatted.deckType === 'DD' && (
            <span className="text-[9px] font-bold text-amber-300" title="Double Decker">
              2D
            </span>
          )}
        </div>
      </div>

      {/* Main Wait Time Number */}
      <div className="mt-1 flex items-baseline gap-1">
        <span
          className={`text-lg sm:text-xl font-bold tabular-nums tracking-tight ${
            isArr
              ? 'text-emerald-400 font-extrabold animate-pulse'
              : typeof formatted.minutes === 'number' && formatted.minutes <= 3
              ? 'text-amber-300'
              : 'text-slate-100'
          }`}
        >
          {formatted.formattedTime}
        </span>
      </div>

      {/* Crowd Load & Deck info */}
      <div className="mt-1.5 flex items-center justify-between gap-1 text-[10px] pt-1 border-t border-slate-800/60">
        <span
          className={`px-1 py-0.5 rounded text-[9px] font-semibold border ${loadInfo.color}`}
        >
          {loadInfo.text}
        </span>
        <span className="text-slate-500 text-[10px]">{getDeckLabel(formatted.deckType)}</span>
      </div>
    </div>
  );
};
