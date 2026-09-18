import { UnitSystem } from '../types';

export function formatTemperature(
  tempCelsius: number | null | undefined,
  units: UnitSystem = 'metric',
  includeUnit = true,
  decimals = 0
): string {
  if (tempCelsius === null || tempCelsius === undefined || isNaN(tempCelsius)) {
    return '--';
  }
  const value = units === 'imperial' ? (tempCelsius * 9) / 5 + 32 : tempCelsius;
  const formatted = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
  return includeUnit ? `${formatted}°${units === 'imperial' ? 'F' : 'C'}` : formatted;
}

export function formatWindSpeed(
  speedKmH: number | null | undefined,
  units: UnitSystem = 'metric',
  includeUnit = true
): string {
  if (speedKmH === null || speedKmH === undefined || isNaN(speedKmH)) {
    return '--';
  }
  if (units === 'imperial') {
    const mph = Math.round(speedKmH * 0.621371);
    return includeUnit ? `${mph} mph` : mph.toString();
  }
  const kmh = Math.round(speedKmH);
  return includeUnit ? `${kmh} km/h` : kmh.toString();
}

export function formatPrecipitation(
  precipMm: number | null | undefined,
  units: UnitSystem = 'metric',
  includeUnit = true
): string {
  if (precipMm === null || precipMm === undefined || isNaN(precipMm)) {
    return '--';
  }
  if (units === 'imperial') {
    const inches = (precipMm * 0.0393701).toFixed(2);
    return includeUnit ? `${inches} in` : inches;
  }
  const mm = precipMm.toFixed(1);
  return includeUnit ? `${mm} mm` : mm;
}

export function formatLocalObservationTime(isoString: string, timezone: string): string {
  if (!isoString) return '';
  // Open-Meteo returns time formatted as YYYY-MM-DDTHH:MM in the searched city's local timezone
  const parts = isoString.split('T');
  if (parts.length < 2) return isoString;
  const timePart = parts[1];
  const [hh, mm] = timePart.split(':');
  const formattedTime = `${hh.padStart(2, '0')}:${mm.padStart(2, '0')}`;

  const tzSuffix = timezone ? ` (${timezone})` : '';
  return `Updated ${formattedTime} local time${tzSuffix}`;
}

export function formatWeekdayAndDate(isoDateString: string, index: number): {
  weekday: string;
  dayOfWeekName: string;
  shortDate: string;
  fullDate: string;
} {
  // Parse date string (YYYY-MM-DD) directly from the city's local calendar
  const [year, month, day] = isoDateString.split('-').map(Number);

  // Use UTC noon to calculate exact day of the week with zero browser timezone interference
  const dateUtc = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  const dayIndex = dateUtc.getUTCDay();

  const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const dayOfWeekName = weekdayNames[dayIndex];
  const weekday = index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : dayOfWeekName;
  const shortDate = `${monthNames[month - 1]} ${day}`;
  const fullDate = `${dayOfWeekName}, ${shortDate}`;

  return { weekday, dayOfWeekName, shortDate, fullDate };
}
