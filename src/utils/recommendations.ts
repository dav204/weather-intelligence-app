import { DailyWeatherData, PlanningRecommendation, UnitSystem } from '../types';
import { formatPrecipitation, formatTemperature, formatWeekdayAndDate, formatWindSpeed } from './formatters';

export function generatePlanningRecommendations(
  daily: DailyWeatherData,
  units: UnitSystem = 'metric'
): PlanningRecommendation[] {
  if (!daily || !daily.time || daily.time.length === 0) {
    return [];
  }

  const recommendations: PlanningRecommendation[] = [];
  const daysCount = daily.time.length;

  const daysMeta = daily.time.map((isoDate, idx) => {
    const { weekday, fullDate } = formatWeekdayAndDate(isoDate, idx);
    const maxTemp = daily.temperature_2m_max[idx];
    const minTemp = daily.temperature_2m_min[idx];
    const precipProb = daily.precipitation_probability_max[idx] ?? 0;
    const precipSum = daily.precipitation_sum[idx] ?? 0;
    const windSpeed = daily.wind_speed_10m_max[idx] ?? 0;
    const code = daily.weather_code[idx] ?? 0;

    return {
      index: idx,
      isoDate,
      weekday,
      fullDate,
      maxTemp,
      minTemp,
      tempSwing: maxTemp - minTemp,
      precipProb,
      precipSum,
      windSpeed,
      code,
    };
  });

  // 1. PRECIPITATION / UMBRELLA ADVISORY
  // Find the day with the highest precipitation probability
  const highestRainDay = [...daysMeta].sort((a, b) => {
    if (b.precipProb !== a.precipProb) return b.precipProb - a.precipProb;
    return b.precipSum - a.precipSum;
  })[0];

  if (highestRainDay && (highestRainDay.precipProb >= 40 || highestRainDay.precipSum >= 2.0)) {
    const triggerStr = `${highestRainDay.precipProb}% rain probability and ${formatPrecipitation(highestRainDay.precipSum, units)} expected`;
    recommendations.push({
      id: 'rain-alert',
      type: 'precipitation',
      day: highestRainDay.weekday,
      triggerMetric: triggerStr,
      title: 'Umbrella & Rain Gear Advised',
      advice: `Carry an umbrella on ${highestRainDay.weekday}: forecast indicates ${triggerStr}. Outdoor plans may be interrupted by wet conditions.`,
      urgency: 'caution',
    });
  } else if (highestRainDay && highestRainDay.precipProb >= 20) {
    const triggerStr = `${highestRainDay.precipProb}% rain probability`;
    recommendations.push({
      id: 'rain-light',
      type: 'precipitation',
      day: highestRainDay.weekday,
      triggerMetric: triggerStr,
      title: 'Possible Light Showers',
      advice: `Keep a compact umbrella handy on ${highestRainDay.weekday}: isolated showers possible with ${triggerStr} (${formatPrecipitation(highestRainDay.precipSum, units)}).`,
      urgency: 'info',
    });
  } else if (highestRainDay) {
    const triggerStr = `Rain probability peaks at only ${highestRainDay.precipProb}%`;
    recommendations.push({
      id: 'dry-week',
      type: 'precipitation',
      day: highestRainDay.weekday,
      triggerMetric: `${highestRainDay.precipProb}% max precipitation probability`,
      title: 'Dry Outlook Across the Week',
      advice: `No umbrella needed: dry weather dominates with precipitation probability peaking at only ${highestRainDay.precipProb}% on ${highestRainDay.weekday}.`,
      urgency: 'ideal',
    });
  }

  // 2. BEST DAY FOR OUTDOOR ACTIVITY
  // Scoring formula: prioritize low precip probability, comfortable temps (18-24°C is sweet spot), and calm winds (<20 km/h)
  const scoredForOutdoors = [...daysMeta].map((d) => {
    let score = 100;
    // Penalize rain heavily
    score -= d.precipProb * 0.9;
    score -= d.precipSum * 10;
    // Temperature sweet spot is ~20°C (68°F)
    const tempDeviation = Math.abs(d.maxTemp - 21);
    score -= tempDeviation * 2.5;
    // Penalize high wind
    if (d.windSpeed > 20) {
      score -= (d.windSpeed - 20) * 1.5;
    }
    // Bonus for clear/mainly clear sky
    if (d.code === 0 || d.code === 1) score += 10;
    if (d.code === 2) score += 5;

    return { ...d, score };
  });

  scoredForOutdoors.sort((a, b) => b.score - a.score);
  const bestOutdoorDay = scoredForOutdoors[0];

  if (bestOutdoorDay) {
    const tempFormatted = formatTemperature(bestOutdoorDay.maxTemp, units);
    const windFormatted = formatWindSpeed(bestOutdoorDay.windSpeed, units);
    const triggerStr = `${bestOutdoorDay.precipProb}% rain probability, ${tempFormatted} high, and ${windFormatted} wind`;

    recommendations.push({
      id: 'outdoor-best',
      type: 'outdoor',
      day: bestOutdoorDay.weekday,
      triggerMetric: triggerStr,
      title: 'Optimal Day for Outdoor Activity',
      advice: `${bestOutdoorDay.weekday} is the premier day for outdoor sports, hiking, or dining with ${triggerStr}.`,
      urgency: 'ideal',
    });
  }

  // 3. WIND ADVISORY
  const windiestDay = [...daysMeta].sort((a, b) => b.windSpeed - a.windSpeed)[0];
  if (windiestDay && windiestDay.windSpeed >= 28) {
    const windFormatted = formatWindSpeed(windiestDay.windSpeed, units);
    recommendations.push({
      id: 'wind-warning',
      type: 'wind',
      day: windiestDay.weekday,
      triggerMetric: `${windFormatted} peak wind speed`,
      title: 'Breezy to Gusty Conditions',
      advice: `Elevated wind advisory on ${windiestDay.weekday}: wind speeds reach ${windFormatted}. Secure loose patio furniture and exercise caution when cycling.`,
      urgency: 'caution',
    });
  } else if (windiestDay && windiestDay.windSpeed >= 20) {
    const windFormatted = formatWindSpeed(windiestDay.windSpeed, units);
    recommendations.push({
      id: 'wind-moderate',
      type: 'wind',
      day: windiestDay.weekday,
      triggerMetric: `${windFormatted} wind speed`,
      title: 'Noticeable Breeze Expected',
      advice: `Moderate breeze on ${windiestDay.weekday} with winds reaching ${windFormatted} — great conditions for sailing or kite-flying.`,
      urgency: 'info',
    });
  }

  // 4. TEMPERATURE ADVISORIES: HEAT, CHILL, OR DIURNAL SWING
  const hottestDay = [...daysMeta].sort((a, b) => b.maxTemp - a.maxTemp)[0];
  const coldestDay = [...daysMeta].sort((a, b) => a.minTemp - b.minTemp)[0];
  const largestSwingDay = [...daysMeta].sort((a, b) => b.tempSwing - a.tempSwing)[0];

  if (hottestDay && hottestDay.maxTemp >= 29) {
    const hotTempFormatted = formatTemperature(hottestDay.maxTemp, units);
    recommendations.push({
      id: 'heat-warning',
      type: 'heat',
      day: hottestDay.weekday,
      triggerMetric: `${hotTempFormatted} maximum temperature`,
      title: 'Warmth / Heat Precaution',
      advice: `Peak heat expected on ${hottestDay.weekday} with highs reaching ${hotTempFormatted}. Prioritize hydration and schedule strenuous workouts early.`,
      urgency: 'caution',
    });
  } else if (coldestDay && coldestDay.minTemp <= 6) {
    const coldTempFormatted = formatTemperature(coldestDay.minTemp, units);
    recommendations.push({
      id: 'cold-warning',
      type: 'cold',
      day: coldestDay.weekday,
      triggerMetric: `${coldTempFormatted} overnight low`,
      title: 'Chilly Morning Alert',
      advice: `Brisk temperatures on ${coldestDay.weekday}: overnight low reaches ${coldTempFormatted}. Heavy coat and thermal layers recommended for early travel.`,
      urgency: 'info',
    });
  } else if (largestSwingDay && largestSwingDay.tempSwing >= 10) {
    const swingDegrees = units === 'imperial' ? Math.round((largestSwingDay.tempSwing * 9) / 5) : Math.round(largestSwingDay.tempSwing);
    const lowFormatted = formatTemperature(largestSwingDay.minTemp, units);
    const highFormatted = formatTemperature(largestSwingDay.maxTemp, units);
    recommendations.push({
      id: 'temp-swing',
      type: 'heat',
      day: largestSwingDay.weekday,
      triggerMetric: `${swingDegrees}° diurnal difference (${lowFormatted} to ${highFormatted})`,
      title: 'Dress in Adaptable Layers',
      advice: `Significant ${swingDegrees}° temperature shift on ${largestSwingDay.weekday} ranging from a brisk ${lowFormatted} morning to a warm ${highFormatted} afternoon.`,
      urgency: 'info',
    });
  }

  // 5. SUN / CLEAR SKY HIGHLIGHT (if we still have room under 5 recommendations or need at least 3)
  if (recommendations.length < 3) {
    const clearestDay = daysMeta.find((d) => d.code === 0 || d.code === 1) || daysMeta[0];
    if (clearestDay) {
      const highFormatted = formatTemperature(clearestDay.maxTemp, units);
      recommendations.push({
        id: 'sun-highlight',
        type: 'outdoor',
        day: clearestDay.weekday,
        triggerMetric: `WMO code ${clearestDay.code} (clear sky) and ${highFormatted} high`,
        title: 'Sun Protection & Bright Skies',
        advice: `Clear, luminous skies forecast on ${clearestDay.weekday} with a high of ${highFormatted}. Remember sunglasses and UV skin protection.`,
        urgency: 'info',
      });
    }
  }

  // Ensure we return between 3 and 5 recommendations
  return recommendations.slice(0, 5);
}
