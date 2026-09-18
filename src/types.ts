/**
 * Weather Intelligence App Type Definitions
 */

export interface CandidatePlace {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  country?: string;
  admin1?: string; // State / Province / Region
  admin2?: string;
  timezone?: string;
  population?: number;
}

export interface GeocodingResponse {
  results?: CandidatePlace[];
  generationtime_ms?: number;
}

export interface CurrentWeatherUnits {
  time: string;
  interval: string;
  temperature_2m: string;
  apparent_temperature: string;
  relative_humidity_2m: string;
  precipitation: string;
  weather_code: string;
  wind_speed_10m: string;
}

export interface CurrentWeatherData {
  time: string;
  interval: number;
  temperature_2m: number;
  apparent_temperature: number;
  relative_humidity_2m: number;
  precipitation: number;
  weather_code: number;
  wind_speed_10m: number;
}

export interface DailyWeatherUnits {
  time: string;
  weather_code: string;
  temperature_2m_max: string;
  temperature_2m_min: string;
  precipitation_sum: string;
  precipitation_probability_max: string;
  wind_speed_10m_max: string;
}

export interface DailyWeatherData {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  precipitation_probability_max: number[];
  wind_speed_10m_max: number[];
}

export interface ForecastResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation?: string;
  elevation?: number;
  current_units?: CurrentWeatherUnits;
  current: CurrentWeatherData;
  daily_units?: DailyWeatherUnits;
  daily: DailyWeatherData;
}

export interface ProcessedDailyForecast {
  date: string;
  dayName: string;
  fullDayName: string;
  formattedDate: string;
  weatherCode: number;
  weatherDescription: string;
  tempMax: number;
  tempMin: number;
  precipSum: number;
  precipProbability: number;
  windSpeedMax: number;
}

export type RecommendationType = 'precipitation' | 'outdoor' | 'wind' | 'heat' | 'cold';

export interface PlanningRecommendation {
  id: string;
  type: RecommendationType;
  day: string;
  triggerMetric: string; // The explicit number that triggered it
  title: string;
  advice: string;
  urgency: 'info' | 'caution' | 'ideal';
}

export type UnitSystem = 'metric' | 'imperial';

export interface WeatherAppState {
  selectedPlace: CandidatePlace | null;
  forecast: ForecastResponse | null;
  candidates: CandidatePlace[];
  isLoading: boolean;
  searchQuery: string;
  lastSearchedQuery: string;
  error: {
    type: 'not_found' | 'network' | 'none';
    message: string;
  };
  units: UnitSystem;
}
