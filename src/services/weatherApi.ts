import { CandidatePlace, ForecastResponse, GeocodingResponse } from '../types';

/**
 * Direct client-side calls to Open-Meteo public endpoints.
 * No API key, secrets, backend, or proxy required.
 */

export async function searchCities(cityName: string): Promise<CandidatePlace[]> {
  const trimmed = cityName.trim();
  if (!trimmed) {
    return [];
  }

  const encoded = encodeURIComponent(trimmed);
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encoded}&count=5&language=en&format=json`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Geocoding service returned status ${response.status}`);
  }

  const data: GeocodingResponse = await response.json();
  return data.results || [];
}

export async function getForecast(latitude: number, longitude: number): Promise<ForecastResponse> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: 'temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max',
    timezone: 'auto',
    forecast_days: '7',
  });

  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Forecast service returned status ${response.status}`);
  }

  const data: ForecastResponse = await response.json();
  return data;
}
