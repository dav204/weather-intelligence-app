/**
 * WMO Weather Code Mappings according to Open-Meteo & WMO standard
 *
 * Specific mappings requested:
 * 0: clear sky
 * 1, 2, 3: mainly clear, partly cloudy, overcast
 * 45 and 48: fog
 * 51, 53, 55: drizzle
 * 61, 63, 65: rain
 * 71, 73, 75: snowfall
 * 80, 81, 82: rain showers
 * 95: thunderstorm
 * 96 and 99: thunderstorm with hail
 */

export interface WeatherCodeDetails {
  code: number;
  description: string;
  category: 'clear' | 'cloudy' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'thunderstorm';
}

export function getWeatherCodeDetails(code: number): WeatherCodeDetails {
  switch (code) {
    case 0:
      return { code, description: 'Clear sky', category: 'clear' };
    case 1:
      return { code, description: 'Mainly clear', category: 'clear' };
    case 2:
      return { code, description: 'Partly cloudy', category: 'cloudy' };
    case 3:
      return { code, description: 'Overcast', category: 'cloudy' };
    case 45:
    case 48:
      return { code, description: 'Fog', category: 'fog' };
    case 51:
      return { code, description: 'Light drizzle', category: 'drizzle' };
    case 53:
      return { code, description: 'Moderate drizzle', category: 'drizzle' };
    case 55:
      return { code, description: 'Dense drizzle', category: 'drizzle' };
    case 56:
    case 57:
      return { code, description: 'Freezing drizzle', category: 'drizzle' };
    case 61:
      return { code, description: 'Slight rain', category: 'rain' };
    case 63:
      return { code, description: 'Moderate rain', category: 'rain' };
    case 65:
      return { code, description: 'Heavy rain', category: 'rain' };
    case 66:
    case 67:
      return { code, description: 'Freezing rain', category: 'rain' };
    case 71:
      return { code, description: 'Slight snowfall', category: 'snow' };
    case 73:
      return { code, description: 'Moderate snowfall', category: 'snow' };
    case 75:
      return { code, description: 'Heavy snowfall', category: 'snow' };
    case 77:
      return { code, description: 'Snow grains', category: 'snow' };
    case 80:
      return { code, description: 'Slight rain showers', category: 'rain' };
    case 81:
      return { code, description: 'Moderate rain showers', category: 'rain' };
    case 82:
      return { code, description: 'Violent rain showers', category: 'rain' };
    case 85:
      return { code, description: 'Slight snow showers', category: 'snow' };
    case 86:
      return { code, description: 'Heavy snow showers', category: 'snow' };
    case 95:
      return { code, description: 'Thunderstorm', category: 'thunderstorm' };
    case 96:
      return { code, description: 'Thunderstorm with slight hail', category: 'thunderstorm' };
    case 99:
      return { code, description: 'Thunderstorm with heavy hail', category: 'thunderstorm' };
    default:
      if (code < 10) return { code, description: 'Clear to partly cloudy', category: 'clear' };
      if (code < 50) return { code, description: 'Atmospheric fog/haze', category: 'fog' };
      if (code < 60) return { code, description: 'Drizzle', category: 'drizzle' };
      if (code < 70) return { code, description: 'Rain', category: 'rain' };
      if (code < 80) return { code, description: 'Snow', category: 'snow' };
      return { code, description: 'Precipitation', category: 'rain' };
  }
}
