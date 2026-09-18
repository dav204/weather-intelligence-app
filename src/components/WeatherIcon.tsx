import React from 'react';
import {
  Sun,
  SunMedium,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  Snowflake,
  CloudLightning,
  CloudHail,
} from 'lucide-react';
import { getWeatherCodeDetails } from '../utils/weatherCodes';

interface WeatherIconProps {
  code: number;
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  code,
  className = 'w-6 h-6',
  size = 24,
}) => {
  const details = getWeatherCodeDetails(code);

  switch (code) {
    case 0:
      return <Sun size={size} className={`text-amber-500 ${className}`} aria-label={details.description} />;
    case 1:
      return <SunMedium size={size} className={`text-amber-500 ${className}`} aria-label={details.description} />;
    case 2:
      return <CloudSun size={size} className={`text-sky-500 ${className}`} aria-label={details.description} />;
    case 3:
      return <Cloud size={size} className={`text-slate-500 ${className}`} aria-label={details.description} />;
    case 45:
    case 48:
      return <CloudFog size={size} className={`text-slate-400 ${className}`} aria-label={details.description} />;
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      return <CloudDrizzle size={size} className={`text-blue-400 ${className}`} aria-label={details.description} />;
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
      return <CloudRain size={size} className={`text-blue-600 ${className}`} aria-label={details.description} />;
    case 71:
    case 73:
    case 75:
    case 77:
      return <Snowflake size={size} className={`text-cyan-400 ${className}`} aria-label={details.description} />;
    case 80:
    case 81:
    case 82:
      return <CloudRain size={size} className={`text-indigo-500 ${className}`} aria-label={details.description} />;
    case 85:
    case 86:
      return <Snowflake size={size} className={`text-indigo-400 ${className}`} aria-label={details.description} />;
    case 95:
      return <CloudLightning size={size} className={`text-amber-600 ${className}`} aria-label={details.description} />;
    case 96:
    case 99:
      return <CloudHail size={size} className={`text-purple-600 ${className}`} aria-label={details.description} />;
    default:
      if (details.category === 'clear') {
        return <Sun size={size} className={`text-amber-500 ${className}`} aria-label={details.description} />;
      }
      if (details.category === 'cloudy') {
        return <Cloud size={size} className={`text-slate-500 ${className}`} aria-label={details.description} />;
      }
      if (details.category === 'rain' || details.category === 'drizzle') {
        return <CloudRain size={size} className={`text-blue-500 ${className}`} aria-label={details.description} />;
      }
      if (details.category === 'snow') {
        return <Snowflake size={size} className={`text-cyan-400 ${className}`} aria-label={details.description} />;
      }
      if (details.category === 'thunderstorm') {
        return <CloudLightning size={size} className={`text-amber-600 ${className}`} aria-label={details.description} />;
      }
      return <Cloud size={size} className={`text-slate-400 ${className}`} aria-label={details.description} />;
  }
};
