import React from 'react';
import { Calendar, Umbrella } from 'lucide-react';
import { DailyWeatherData, UnitSystem } from '../types';
import { WeatherIcon } from './WeatherIcon';
import { getWeatherCodeDetails } from '../utils/weatherCodes';
import { formatPrecipitation, formatTemperature, formatWeekdayAndDate } from '../utils/formatters';

interface ForecastCardsProps {
  daily: DailyWeatherData;
  units: UnitSystem;
}

export const ForecastCards: React.FC<ForecastCardsProps> = ({ daily, units }) => {
  if (!daily || !daily.time || daily.time.length === 0) {
    return null;
  }

  const daysCount = Math.min(daily.time.length, 7);
  const forecastDays = Array.from({ length: daysCount }, (_, i) => {
    const isoDate = daily.time[i];
    const { weekday, dayOfWeekName, shortDate, fullDate } = formatWeekdayAndDate(isoDate, i);
    const code = daily.weather_code[i];
    const weatherDetails = getWeatherCodeDetails(code);
    const maxTemp = daily.temperature_2m_max[i];
    const minTemp = daily.temperature_2m_min[i];
    const precipProb = daily.precipitation_probability_max?.[i] ?? 0;
    const precipSum = daily.precipitation_sum?.[i] ?? 0;

    return {
      index: i,
      isoDate,
      weekday,
      dayOfWeekName,
      shortDate,
      fullDate,
      code,
      weatherDetails,
      maxTemp,
      minTemp,
      precipProb,
      precipSum,
    };
  });

  return (
    <div id="forecast-section" className="w-full max-w-4xl mx-auto mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Calendar size={18} className="text-blue-600" />
          <span>7-Day Weather Forecast</span>
        </h3>
        <span className="text-xs text-slate-500 font-medium">Daily Outlook</span>
      </div>

      {/* Responsive layout: wraps into neat columns on mobile width, 7 columns on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {forecastDays.map((day) => (
          <div
            key={day.isoDate}
            id={`forecast-card-${day.index}`}
            className={`bg-white border rounded-2xl p-3.5 flex flex-col items-center text-center transition-all shadow-2xs hover:shadow-sm ${
              day.index === 0
                ? 'border-blue-300 ring-2 ring-blue-100/70 bg-linear-to-b from-blue-50/40 to-white'
                : 'border-slate-200/80 hover:border-slate-300'
            }`}
          >
            {/* Weekday & Date in City's Calendar */}
            <div className="w-full pb-2 border-b border-slate-100 mb-2">
              <span
                className={`block text-xs font-bold tracking-tight truncate ${
                  day.index === 0 ? 'text-blue-600' : 'text-slate-800'
                }`}
              >
                {day.weekday}
                {day.index <= 1 && (
                  <span className="text-[10px] font-normal text-slate-500 ml-1">
                    ({day.dayOfWeekName.slice(0, 3)})
                  </span>
                )}
              </span>
              <span className="block text-[11px] text-slate-400 font-medium">
                {day.shortDate}
              </span>
            </div>

            {/* Weather Icon & Readable Description */}
            <div className="my-1 flex flex-col items-center">
              <WeatherIcon code={day.code} size={30} className="w-7 h-7 mb-1" />
              <span
                title={day.weatherDetails.description}
                className="text-[11px] font-medium text-slate-600 line-clamp-2 h-7 flex items-center justify-center leading-tight"
              >
                {day.weatherDetails.description}
              </span>
            </div>

            {/* High and Low Temperature */}
            <div className="w-full mt-2 pt-2 border-t border-slate-100 flex items-center justify-center gap-2">
              <span
                id={`forecast-high-${day.index}`}
                title="Daily High"
                className="text-sm font-bold text-slate-900"
              >
                {formatTemperature(day.maxTemp, units)}
              </span>
              <span
                id={`forecast-low-${day.index}`}
                title="Daily Low"
                className="text-xs font-semibold text-slate-400"
              >
                {formatTemperature(day.minTemp, units)}
              </span>
            </div>

            {/* Chance of precipitation */}
            <div
              id={`forecast-precip-${day.index}`}
              className="mt-2 text-[11px] font-medium flex items-center justify-center gap-1 text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full w-full"
              title={`Precipitation Probability: ${day.precipProb}%, Expected sum: ${formatPrecipitation(day.precipSum, units)}`}
            >
              <Umbrella size={11} className="shrink-0" />
              <span className="truncate">{day.precipProb}% rain</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
