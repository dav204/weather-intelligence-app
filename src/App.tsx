/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { CloudSun, RefreshCw } from 'lucide-react';
import { CandidatePlace, ForecastResponse, UnitSystem } from './types';
import { searchCities, getForecast } from './services/weatherApi';
import { SearchBar } from './components/SearchBar';
import { CandidateSelector } from './components/CandidateSelector';
import { CurrentConditions } from './components/CurrentConditions';
import { ForecastCards } from './components/ForecastCards';
import { TemperatureChart } from './components/TemperatureChart';
import { PlanningPanel } from './components/PlanningPanel';
import { ErrorAlert } from './components/ErrorAlert';
import { LoadingIndicator } from './components/LoadingIndicator';

export default function App() {
  const [searchQuery, setSearchQuery] = useState<string>('London');
  const [lastSearchedQuery, setLastSearchedQuery] = useState<string>('London');
  const [candidates, setCandidates] = useState<CandidatePlace[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<CandidatePlace | null>(null);
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('Loading weather data...');
  const [units, setUnits] = useState<UnitSystem>('metric');

  const [errorState, setErrorState] = useState<{
    type: 'not_found' | 'network' | 'none';
    message: string;
  }>({
    type: 'none',
    message: '',
  });

  // Fetch forecast for a chosen candidate place
  const fetchForecastForPlace = useCallback(async (place: CandidatePlace) => {
    setIsLoading(true);
    setLoadingMessage(`Loading forecast for ${place.name}...`);
    setErrorState({ type: 'none', message: '' });

    try {
      const data = await getForecast(place.latitude, place.longitude);
      setForecast(data);
      setSelectedPlace(place);
    } catch (err: unknown) {
      console.error('Forecast fetch failed:', err);
      setErrorState({
        type: 'network',
        message: 'The weather service could not be reached. Please check your connection and try again.',
      });
      setForecast(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Primary search handler
  const handleSearch = useCallback(
    async (cityOverride?: string) => {
      const queryToSearch = (cityOverride ?? searchQuery).trim();
      if (!queryToSearch) return;

      setLastSearchedQuery(queryToSearch);
      setIsLoading(true);
      setLoadingMessage(`Searching locations matching "${queryToSearch}"...`);
      setErrorState({ type: 'none', message: '' });

      try {
        const results = await searchCities(queryToSearch);

        // Edge case: City not found
        if (!results || results.length === 0) {
          setErrorState({
            type: 'not_found',
            message: `No city found matching '${queryToSearch}'. Check the spelling and try again.`,
          });
          setCandidates([]);
          setForecast(null);
          setSelectedPlace(null);
          setIsLoading(false);
          return;
        }

        setCandidates(results);

        // Disambiguation logic:
        // If more than one place matches, show candidate list so the user can disambiguate.
        // Do not silently pick the first result.
        if (results.length > 1) {
          setSelectedPlace(null);
          setForecast(null);
          setIsLoading(false);
        } else {
          // Exactly 1 match found, fetch forecast immediately
          const singlePlace = results[0];
          await fetchForecastForPlace(singlePlace);
        }
      } catch (err: unknown) {
        console.error('Search request failed:', err);
        setErrorState({
          type: 'network',
          message: 'The weather service could not be reached. Please check your connection and try again.',
        });
        setCandidates([]);
        setForecast(null);
        setSelectedPlace(null);
        setIsLoading(false);
      }
    },
    [searchQuery, fetchForecastForPlace]
  );

  // Initial load on mount to immediately show working dashboard
  useEffect(() => {
    handleSearch('London');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Candidate selection from disambiguation list
  const handleSelectCandidate = (candidate: CandidatePlace) => {
    fetchForecastForPlace(candidate);
  };

  // Toggle unit system
  const handleToggleUnits = () => {
    setUnits((prev) => (prev === 'metric' ? 'imperial' : 'metric'));
  };

  // Retry handler for network errors
  const handleRetry = () => {
    if (selectedPlace) {
      fetchForecastForPlace(selectedPlace);
    } else {
      handleSearch(lastSearchedQuery);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 flex flex-col font-sans antialiased">
      {/* Top Header Bar */}
      <header
        id="app-header"
        className="w-full bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-2xs backdrop-blur-md bg-white/95"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-blue-600 to-sky-500 flex items-center justify-center text-white shadow-xs">
              <CloudSun size={20} />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
                Weather Intelligence
              </h1>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Real-time conditions & 7-day predictive planning
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {selectedPlace && !isLoading && (
              <button
                id="refresh-forecast-btn"
                type="button"
                onClick={() => fetchForecastForPlace(selectedPlace)}
                title="Refresh current forecast"
                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                aria-label="Refresh forecast"
              >
                <RefreshCw size={16} />
              </button>
            )}

            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80 hidden md:inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Open-Meteo Public API
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Search Bar */}
        <SearchBar
          query={searchQuery}
          onQueryChange={setSearchQuery}
          onSearch={handleSearch}
          isLoading={isLoading}
          units={units}
          onToggleUnits={handleToggleUnits}
        />

        {/* Candidate Disambiguation Panel (when >1 results found) */}
        {candidates.length > 1 && (
          <CandidateSelector
            candidates={candidates}
            selectedPlace={selectedPlace}
            searchQuery={lastSearchedQuery}
            onSelectCandidate={handleSelectCandidate}
          />
        )}

        {/* Loading Indicator */}
        {isLoading && <LoadingIndicator message={loadingMessage} />}

        {/* Error States: City Not Found or Network/API Failure */}
        {!isLoading && errorState.type !== 'none' && (
          <ErrorAlert
            errorType={errorState.type}
            message={errorState.message}
            onRetry={handleRetry}
            isRetrying={isLoading}
          />
        )}

        {/* Active Weather Dashboard */}
        {!isLoading && selectedPlace && forecast && errorState.type === 'none' && (
          <div id="weather-dashboard" className="space-y-6">
            {/* 1. Current Conditions Panel */}
            <CurrentConditions
              place={selectedPlace}
              current={forecast.current}
              timezone={forecast.timezone}
              units={units}
            />

            {/* 2. 7-Day Forecast Cards */}
            <ForecastCards daily={forecast.daily} units={units} />

            {/* 3. Recharts 7-Day Temperature Trend Lines */}
            <TemperatureChart daily={forecast.daily} units={units} />

            {/* 4. Planning Recommendations Panel */}
            <PlanningPanel daily={forecast.daily} units={units} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer id="app-footer" className="w-full border-t border-slate-200/80 py-5 bg-white text-slate-500 text-xs text-center">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>Weather Intelligence App • Direct client browser requests</p>
          <p className="text-slate-400">
            Powered by{' '}
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Open-Meteo
            </a>{' '}
            (CC-BY 4.0)
          </p>
        </div>
      </footer>
    </div>
  );
}
