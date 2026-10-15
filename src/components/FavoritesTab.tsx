import React, { useState } from 'react';
import { BusStop } from '../types/bus';
import { SINGAPORE_BUS_STOPS } from '../data/singaporeBuses';
import { BusStopCard } from './BusStopCard';
import { Star, BookmarkPlus, ArrowRight } from 'lucide-react';

interface Props {
  favoriteStopCodes: string[];
  onToggleFavorite: (stopCode: string) => void;
  onSelectOnMap: (lat: number, lng: number, stopCode: string) => void;
  onViewRoute: (serviceNo: string) => void;
  onTrackBusOnMap?: (lat: number, lng: number) => void;
  onExploreStops: () => void;
  refreshKey?: number;
}

export const FavoritesTab: React.FC<Props> = ({
  favoriteStopCodes,
  onToggleFavorite,
  onSelectOnMap,
  onViewRoute,
  onTrackBusOnMap,
  onExploreStops,
  refreshKey
}) => {
  const favoriteStops: BusStop[] = favoriteStopCodes
    .map(code => SINGAPORE_BUS_STOPS.find(s => s.BusStopCode === code))
    .filter((s): s is BusStop => !!s);

  if (favoriteStops.length === 0) {
    return (
      <div className="py-16 px-4 text-center rounded-3xl bg-slate-900/40 border border-slate-800/80 max-w-xl mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center mb-4">
          <Star className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-100">No Saved Bus Stops Yet</h3>
        <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
          Tap the star icon on any bus stop card to pin it here for instant access to your regular daily commutes.
        </p>
        <button
          onClick={onExploreStops}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 text-slate-950 font-semibold text-sm hover:bg-sky-400 transition-colors shadow-lg shadow-sky-500/20"
        >
          <span>Explore Nearby Bus Stops</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-100">Saved Bus Stops</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {favoriteStops.length} bookmarked stop{favoriteStops.length > 1 ? 's' : ''} with live arrival predictions
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {favoriteStops.map(stop => (
          <BusStopCard
            key={stop.BusStopCode}
            stop={stop}
            isFavorite={true}
            onToggleFavorite={onToggleFavorite}
            onSelectOnMap={onSelectOnMap}
            onViewRoute={onViewRoute}
            onTrackBusOnMap={onTrackBusOnMap}
            refreshKey={refreshKey}
          />
        ))}
      </div>
    </div>
  );
};
