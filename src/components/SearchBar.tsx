import React from 'react';
import { Search, X, MapPin } from 'lucide-react';
import { UnitSystem } from '../types';

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: (cityToSearch?: string) => void;
  isLoading: boolean;
  units: UnitSystem;
  onToggleUnits: () => void;
}

const POPULAR_CITIES = ['London', 'Tokyo', 'New York', 'Sydney', 'Paris'];

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onQueryChange,
  onSearch,
  isLoading,
  units,
  onToggleUnits,
}) => {
  const isQueryEmpty = query.trim().length === 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isQueryEmpty && !isLoading) {
      onSearch();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isQueryEmpty && !isLoading) {
      e.preventDefault();
      onSearch();
    }
  };

  return (
    <div id="search-section" className="w-full max-w-4xl mx-auto mb-6">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search size={18} />
          </div>
          <input
            id="city-search-input"
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search a city (e.g., Tokyo, London, Seattle)..."
            disabled={isLoading}
            className="w-full pl-10 pr-10 py-3 bg-white text-slate-900 placeholder-slate-400 border border-slate-200 rounded-xl shadow-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-base"
            aria-label="City search"
          />
          {query.length > 0 && (
            <button
              id="clear-search-button"
              type="button"
              onClick={() => onQueryChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Clear search input"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            id="search-submit-button"
            type="submit"
            disabled={isQueryEmpty || isLoading}
            className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-150 flex items-center justify-center gap-2 select-none shadow-xs ${
              isQueryEmpty || isLoading
                ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 cursor-pointer'
            }`}
          >
            <Search size={16} />
            <span>{isLoading ? 'Searching...' : 'Search'}</span>
          </button>

          {/* Metric / Imperial Unit Toggle */}
          <button
            id="unit-toggle-button"
            type="button"
            onClick={onToggleUnits}
            title={`Switch to ${units === 'metric' ? 'Imperial (°F, mph, in)' : 'Metric (°C, km/h, mm)'}`}
            className="px-3.5 py-3 rounded-xl font-semibold text-sm border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
            aria-label="Toggle measurement units"
          >
            <span className={units === 'metric' ? 'text-blue-600 font-bold' : 'text-slate-400'}>°C</span>
            <span className="text-slate-300">/</span>
            <span className={units === 'imperial' ? 'text-blue-600 font-bold' : 'text-slate-400'}>°F</span>
          </button>
        </div>
      </form>

      {/* Quick Select Cities */}
      <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-500">
        <span className="font-medium text-slate-400 flex items-center gap-1">
          <MapPin size={12} /> Popular:
        </span>
        {POPULAR_CITIES.map((city) => (
          <button
            key={city}
            id={`quick-city-${city.toLowerCase().replace(/\s+/g, '-')}`}
            type="button"
            onClick={() => {
              onQueryChange(city);
              onSearch(city);
            }}
            disabled={isLoading}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 transition-colors cursor-pointer border border-slate-200/60"
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
};
