import React from 'react';
import { Search, X, MapPin } from 'lucide-react';

interface Props {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  resultCount: number;
}

export const SearchBar: React.FC<Props> = ({
  searchQuery,
  setSearchQuery,
  resultCount
}) => {
  const quickSearches = [
    { label: 'Orchard (09048)', query: '09048' },
    { label: 'Bugis (01119)', query: 'Bugis' },
    { label: 'Bus 190', query: '190' },
    { label: 'Bus 65', query: '65' },
    { label: 'Jurong East', query: 'Jurong East' },
    { label: 'Tampines', query: 'Tampines' }
  ];

  return (
    <div className="w-full space-y-3">
      {/* Search Input Box */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by 5-digit stop code (e.g. 09048), road name, or bus number (e.g. 190)..."
          className="w-full pl-10 pr-24 py-3 bg-slate-900/90 border border-slate-800 rounded-2xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all shadow-inner"
        />
        {searchQuery ? (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-3 flex items-center px-2 text-slate-400 hover:text-white"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[11px] font-mono text-slate-500">
            {resultCount} stops
          </div>
        )}
      </div>

      {/* Quick Search Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-medium whitespace-nowrap">Suggested:</span>
        {quickSearches.map(item => (
          <button
            key={item.label}
            onClick={() => setSearchQuery(item.query)}
            className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-sky-300 hover:border-slate-700 transition-colors whitespace-nowrap shrink-0"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};
