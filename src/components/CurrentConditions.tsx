import React from 'react';
import { MapPin, Thermometer, Droplets, Wind, CloudRain, Clock } from 'lucide-react';
import { CandidatePlace, CurrentWeatherData, UnitSystem } from '../types';
import { WeatherIcon } from './WeatherIcon';
import { getWeatherCodeDetails } from '../utils/weatherCodes';
import { formatLocalObservationTime, formatPrecipitation, formatTemperature, formatWindSpeed } from '../utils/formatters';

interface CurrentConditionsProps {
  place: CandidatePlace;
  current: CurrentWeatherData;
  timezone: string;
  units: UnitSystem;
}

export const CurrentConditions: React.FC<CurrentConditionsProps> = ({
  place,
  current,
  timezone,
  units,
}) => {
  const weatherDetails = getWeatherCodeDetails(current.weather_code);
  const regionParts = [place.admin1, place.country].filter(Boolean);
  const locationSubtitle = regionParts.join(', ');
  const observationTimeLabel = formatLocalObservationTime(current.time, timezone);

  return (
    <div
      id="current-conditions-card"
      className="w-full max-w-4xl mx-auto mb-8 bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm transition-all"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-1.5 text-blue-600 text-xs font-semibold tracking-wider uppercase mb-1">
            <MapPin size={14} />
            <span>Current Conditions</span>
          </div>
          <h2 id="current-location-title" className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {place.name}
          </h2>
          {locationSubtitle && (
            <p id="current-location-subtitle" className="text-sm font-medium text-slate-500 mt-0.5">
              {locationSubtitle}
            </p>
          )}
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-2 font-medium">
            <span className="flex items-center gap-1.5">
              <Clock size={13} className="text-slate-400" />
              <span id="observation-time-display">{observationTimeLabel}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-slate-50/80 border border-slate-100 rounded-2xl p-4 sm:p-5">
          <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-100">
            <WeatherIcon code={current.weather_code} size={44} className="w-11 h-11" />
          </div>
          <div>
            <div id="current-temperature-display" className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              {formatTemperature(current.temperature_2m, units)}
            </div>
            <div id="current-weather-description" className="text-sm font-semibold text-slate-700 mt-0.5">
              {weatherDetails.description}
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Key Current Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
        {/* Feels Like */}
        <div id="metric-feels-like" className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-100 flex flex-col">
          <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5 mb-1">
            <Thermometer size={14} className="text-amber-500" />
            Feels Like
          </span>
          <span className="text-lg font-bold text-slate-900">
            {formatTemperature(current.apparent_temperature, units)}
          </span>
        </div>

        {/* Humidity */}
        <div id="metric-humidity" className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-100 flex flex-col">
          <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5 mb-1">
            <Droplets size={14} className="text-sky-500" />
            Humidity
          </span>
          <span className="text-lg font-bold text-slate-900">
            {Math.round(current.relative_humidity_2m)}%
          </span>
        </div>

        {/* Wind Speed */}
        <div id="metric-wind" className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-100 flex flex-col">
          <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5 mb-1">
            <Wind size={14} className="text-teal-500" />
            Wind Speed
          </span>
          <span className="text-lg font-bold text-slate-900">
            {formatWindSpeed(current.wind_speed_10m, units)}
          </span>
        </div>

        {/* Precipitation */}
        <div id="metric-precipitation" className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-100 flex flex-col">
          <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5 mb-1">
            <CloudRain size={14} className="text-blue-500" />
            Precipitation
          </span>
          <span className="text-lg font-bold text-slate-900">
            {formatPrecipitation(current.precipitation, units)}
          </span>
        </div>
      </div>
    </div>
  );
};
