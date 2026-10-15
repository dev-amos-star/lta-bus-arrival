import React from 'react';
import { Bus, RefreshCw, Radio } from 'lucide-react';

interface Props {
  activeView: 'nearby' | 'map' | 'favorites' | 'backend';
  setActiveView: (view: 'nearby' | 'map' | 'favorites' | 'backend') => void;
  onRefreshAll: () => void;
  isAutoRefreshing: boolean;
  onToggleAutoRefresh: () => void;
  countdownSeconds: number;
}

export const Header: React.FC<Props> = ({
  activeView,
  setActiveView,
  onRefreshAll,
  isAutoRefreshing,
  onToggleAutoRefresh,
  countdownSeconds
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single text element) */}
        <a
          href="/"
          onClick={e => {
            e.preventDefault();
            setActiveView('nearby');
          }}
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-sky-400 transition-colors"
        >
          <div className="w-8 h-8 rounded-xl bg-sky-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-sky-500/20">
            <Bus className="w-5 h-5" />
          </div>
          <span>SG Bus Arrival</span>
        </a>

        {/* Zone 2: 4 single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => setActiveView('nearby')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeView === 'nearby'
                ? 'text-white border-b-2 border-sky-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            Nearby Stops
          </button>
          <button
            onClick={() => setActiveView('map')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeView === 'map'
                ? 'text-white border-b-2 border-sky-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            Live Radar Map
          </button>
          <button
            onClick={() => setActiveView('favorites')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeView === 'favorites'
                ? 'text-white border-b-2 border-sky-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            Saved Stops
          </button>
          <button
            onClick={() => setActiveView('backend')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeView === 'backend'
                ? 'text-white border-b-2 border-sky-400 font-semibold'
                : 'hover:text-slate-200'
            }`}
          >
            Backend Setup
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Refresh Button with countdown display */}
          <button
            onClick={onRefreshAll}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-sky-500 text-slate-950 hover:bg-sky-400 transition-all active:scale-95 whitespace-nowrap shadow-md shadow-sky-500/20"
            title="Refresh bus timings now"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh ({countdownSeconds}s)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
