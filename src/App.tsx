/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BusStop } from './types/bus';
import { SINGAPORE_BUS_STOPS } from './data/singaporeBuses';
import { searchBusStops } from './services/busService';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { BusStopCard } from './components/BusStopCard';
import { InteractiveMap } from './components/InteractiveMap';
import { RouteModal } from './components/RouteModal';
import { FavoritesTab } from './components/FavoritesTab';
import { BackendConnectorModal } from './components/BackendConnectorModal';
import {
  MapPin,
  Compass,
  Radio,
  Star,
  Bus,
  Server,
  Layers,
  ArrowRight,
  Sparkles,
  SlidersHorizontal,
  Navigation
} from 'lucide-react';

const FAVORITES_STORAGE_KEY = 'sg_bus_favorites';

export default function App() {
  const [activeView, setActiveView] = useState<'nearby' | 'map' | 'favorites' | 'backend'>('nearby');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStopCode, setSelectedStopCode] = useState<string | null>(null);
  const [activeRouteService, setActiveRouteService] = useState<string | null>(null);
  const [highlightedServiceOnMap, setHighlightedServiceOnMap] = useState<string | null>(null);

  // User location (defaults to Orchard / Central Singapore)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>({
    lat: 1.3040,
    lng: 103.8318
  });
  const [isGpsActive, setIsGpsActive] = useState<boolean>(false);

  // Favorite stops
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : ['09048', '01119', '28009'];
    } catch {
      return ['09048', '01119', '28009'];
    }
  });

  // Auto-refresh countdown (15s cycle)
  const [refreshCountdown, setRefreshCountdown] = useState<number>(15);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [isAutoRefreshing, setIsAutoRefreshing] = useState<boolean>(true);

  // Countdown timer effect
  useEffect(() => {
    if (!isAutoRefreshing) return;

    const timer = setInterval(() => {
      setRefreshCountdown(prev => {
        if (prev <= 1) {
          setRefreshKey(k => k + 1);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAutoRefreshing]);

  const handleManualRefresh = useCallback(() => {
    setRefreshKey(k => k + 1);
    setRefreshCountdown(15);
  }, []);

  const toggleFavorite = (stopCode: string) => {
    setFavorites(prev => {
      const next = prev.includes(stopCode)
        ? prev.filter(c => c !== stopCode)
        : [...prev, stopCode];
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Browser Geolocation attempt
  const requestUserGeolocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsGpsActive(true);
        },
        error => {
          console.warn('Geolocation denied or unavailable, using Singapore central fallback', error);
          setIsGpsActive(false);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  };

  useEffect(() => {
    requestUserGeolocation();
  }, []);

  // Filter and sort bus stops
  const filteredStops = useMemo(() => {
    return searchBusStops(searchQuery, userLocation);
  }, [searchQuery, userLocation]);

  // Handle map selection
  const handleSelectOnMap = (lat: number, lng: number, stopCode: string) => {
    setSelectedStopCode(stopCode);
    setActiveView('map');
  };

  // Track bus from arrival badge directly on map
  const handleTrackBusOnMap = (lat: number, lng: number) => {
    setActiveView('map');
  };

  // Preset location hubs across Singapore
  const locationHubs = [
    { name: 'Orchard Rd', lat: 1.3040, lng: 103.8318 },
    { name: 'Bugis / Victoria', lat: 1.3000, lng: 103.8552 },
    { name: 'Raffles Place', lat: 1.2835, lng: 103.8522 },
    { name: 'Jurong East', lat: 1.3332, lng: 103.7423 },
    { name: 'Tampines', lat: 1.3533, lng: 103.9452 },
    { name: 'HarbourFront', lat: 1.2655, lng: 103.8219 }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-20 md:pb-8 antialiased selection:bg-sky-500 selection:text-slate-950">
      {/* Top Bar adhering to Top Bar Contract */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        onRefreshAll={handleManualRefresh}
        isAutoRefreshing={isAutoRefreshing}
        onToggleAutoRefresh={() => setIsAutoRefreshing(!isAutoRefreshing)}
        countdownSeconds={refreshCountdown}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Top Hero / Context strip */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span className="font-semibold text-sky-400">Singapore LTA Transit</span>
              <span aria-hidden="true">·</span>
              <span>All Operators (SBST, SMRT, TTS, GAS)</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums font-mono text-emerald-400">Real-time GPS Tracking</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {activeView === 'nearby' && 'Live Bus Arrivals & Nearby Stops'}
              {activeView === 'map' && 'Singapore Live Transit Radar Map'}
              {activeView === 'favorites' && 'Your Bookmarked Daily Stops'}
              {activeView === 'backend' && 'Backend API Configuration'}
            </h1>
          </div>

          {/* Quick Location Simulator / GPS pill */}
          <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 self-start sm:self-center overflow-x-auto max-w-full">
            <button
              onClick={requestUserGeolocation}
              className={`p-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors ${
                isGpsActive
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Use Device Geolocation"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">GPS</span>
            </button>
            <span className="text-slate-700 text-xs">|</span>
            {locationHubs.map(hub => (
              <button
                key={hub.name}
                onClick={() => {
                  setUserLocation({ lat: hub.lat, lng: hub.lng });
                  setIsGpsActive(false);
                }}
                className={`px-2.5 py-1 text-xs rounded-xl whitespace-nowrap transition-colors ${
                  Math.abs(userLocation.lat - hub.lat) < 0.005 &&
                  Math.abs(userLocation.lng - hub.lng) < 0.005
                    ? 'bg-slate-800 text-sky-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {hub.name}
              </button>
            ))}
          </div>
        </section>

        {/* VIEW 1: NEARBY STOPS & SEARCH */}
        {activeView === 'nearby' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Search Bar */}
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              resultCount={filteredStops.length}
            />

            {/* Stops Grid */}
            {filteredStops.length === 0 ? (
              <div className="py-16 text-center rounded-3xl bg-slate-900/50 border border-slate-800 text-slate-400">
                <Bus className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                <p className="text-base font-semibold text-slate-300">No bus stops found matching &ldquo;{searchQuery}&rdquo;</p>
                <p className="text-xs text-slate-500 mt-1">
                  Try searching for a 5-digit code (e.g. 09048), road name (e.g. Orchard), or bus service (e.g. 190).
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 px-4 py-2 rounded-xl bg-slate-800 text-sky-400 font-medium text-xs hover:bg-slate-700 transition-colors"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredStops.map(stop => (
                  <BusStopCard
                    key={stop.BusStopCode}
                    stop={stop}
                    isFavorite={favorites.includes(stop.BusStopCode)}
                    onToggleFavorite={toggleFavorite}
                    onSelectOnMap={handleSelectOnMap}
                    onViewRoute={serviceNo => setActiveRouteService(serviceNo)}
                    onTrackBusOnMap={handleTrackBusOnMap}
                    refreshKey={refreshKey}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: INTERACTIVE LIVE RADAR MAP */}
        {activeView === 'map' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <InteractiveMap
              selectedStopCode={selectedStopCode}
              onSelectStop={stopCode => {
                setSelectedStopCode(stopCode);
                // Also open stop card or filter to it
              }}
              userLocation={userLocation}
              highlightedService={highlightedServiceOnMap}
              onClearHighlightService={() => setHighlightedServiceOnMap(null)}
            />

            {/* Selected stop quick detail drawer under map if stop is chosen */}
            {selectedStopCode && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
                    Selected Bus Stop Timings
                  </h3>
                  <button
                    onClick={() => setSelectedStopCode(null)}
                    className="text-xs text-sky-400 hover:text-sky-300"
                  >
                    Deselect
                  </button>
                </div>
                {(() => {
                  const currentStop = SINGAPORE_BUS_STOPS.find(s => s.BusStopCode === selectedStopCode);
                  if (!currentStop) return null;
                  return (
                    <BusStopCard
                      stop={currentStop}
                      isFavorite={favorites.includes(currentStop.BusStopCode)}
                      onToggleFavorite={toggleFavorite}
                      onSelectOnMap={handleSelectOnMap}
                      onViewRoute={serviceNo => setActiveRouteService(serviceNo)}
                      onTrackBusOnMap={handleTrackBusOnMap}
                      refreshKey={refreshKey}
                    />
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: SAVED FAVORITES */}
        {activeView === 'favorites' && (
          <FavoritesTab
            favoriteStopCodes={favorites}
            onToggleFavorite={toggleFavorite}
            onSelectOnMap={handleSelectOnMap}
            onViewRoute={serviceNo => setActiveRouteService(serviceNo)}
            onTrackBusOnMap={handleTrackBusOnMap}
            onExploreStops={() => setActiveView('nearby')}
            refreshKey={refreshKey}
          />
        )}

        {/* VIEW 4: BACKEND CONNECTOR & LTA INTEGRATION */}
        {activeView === 'backend' && (
          <BackendConnectorModal
            onConfigUpdated={() => {
              handleManualRefresh();
            }}
          />
        )}
      </main>

      {/* Full Route Modal */}
      <RouteModal
        serviceNo={activeRouteService}
        onClose={() => setActiveRouteService(null)}
        onSelectStop={stopCode => {
          setSelectedStopCode(stopCode);
          setActiveView('map');
        }}
      />

      {/* Mobile Sticky Bottom Tab Bar (Under 15% Viewport Cap) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-lg border-t border-slate-800">
        <div className="grid grid-cols-4 items-center h-16 pb-safe px-2">
          <button
            onClick={() => setActiveView('nearby')}
            className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
              activeView === 'nearby' ? 'text-sky-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bus className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-1">Nearby</span>
          </button>
          <button
            onClick={() => setActiveView('map')}
            className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
              activeView === 'map' ? 'text-sky-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-1">Radar Map</span>
          </button>
          <button
            onClick={() => setActiveView('favorites')}
            className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
              activeView === 'favorites' ? 'text-sky-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Star className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-1">Saved</span>
          </button>
          <button
            onClick={() => setActiveView('backend')}
            className={`min-h-[44px] flex flex-col items-center justify-center transition-colors ${
              activeView === 'backend' ? 'text-sky-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-1">Backend</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
