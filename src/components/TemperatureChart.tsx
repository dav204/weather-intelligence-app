import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { DailyWeatherData, UnitSystem } from '../types';
import { formatWeekdayAndDate } from '../utils/formatters';

interface TemperatureChartProps {
  daily: DailyWeatherData;
  units: UnitSystem;
}

interface ChartDataPoint {
  dayLabel: string;
  fullDate: string;
  high: number;
  low: number;
}

export const TemperatureChart: React.FC<TemperatureChartProps> = ({ daily, units }) => {
  if (!daily || !daily.time || daily.time.length === 0) {
    return null;
  }

  const daysCount = Math.min(daily.time.length, 7);
  const data: ChartDataPoint[] = [];

  for (let i = 0; i < daysCount; i++) {
    const isoDate = daily.time[i];
    const { weekday, fullDate } = formatWeekdayAndDate(isoDate, i);
    const rawHigh = daily.temperature_2m_max[i];
    const rawLow = daily.temperature_2m_min[i];

    const high =
      units === 'imperial'
        ? Math.round((rawHigh * 9) / 5 + 32)
        : Math.round(rawHigh * 10) / 10;
    const low =
      units === 'imperial'
        ? Math.round((rawLow * 9) / 5 + 32)
        : Math.round(rawLow * 10) / 10;

    data.push({
      dayLabel: weekday,
      fullDate,
      high,
      low,
    });
  }

  // Calculate dynamic domain with buffer
  const allTemps = data.flatMap((d) => [d.high, d.low]);
  const minTemp = Math.floor(Math.min(...allTemps) - 3);
  const maxTemp = Math.ceil(Math.max(...allTemps) + 3);

  const unitSymbol = units === 'imperial' ? '°F' : '°C';

  return (
    <div
      id="temperature-chart-container"
      className="w-full max-w-4xl mx-auto mb-8 bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp size={18} className="text-blue-600" />
            <span>7-Day Temperature Trends</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Visual comparison of daily maximum and minimum temperatures
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg border border-slate-200/60 self-start sm:self-auto">
          Unit: {unitSymbol}
        </span>
      </div>

      <div className="w-full h-72 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 12, right: 16, left: -10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />

            {/* X-Axis with Label */}
            <XAxis
              dataKey="dayLabel"
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
              dy={8}
              label={{
                value: 'Forecast Day',
                position: 'insideBottom',
                offset: -14,
                fill: '#94a3b8',
                fontSize: 11,
              }}
            />

            {/* Y-Axis with Label */}
            <YAxis
              domain={[minTemp, maxTemp]}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              tick={{ fill: '#64748b', fontSize: 12 }}
              dx={-4}
              label={{
                value: `Temperature (${unitSymbol})`,
                angle: -90,
                position: 'insideLeft',
                offset: 14,
                fill: '#94a3b8',
                fontSize: 11,
                style: { textAnchor: 'middle' },
              }}
            />

            {/* Accessible Custom Tooltip */}
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as ChartDataPoint;
                  return (
                    <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg text-xs border border-slate-800">
                      <p className="font-bold text-slate-200 border-b border-slate-700/80 pb-1 mb-1.5">
                        {item.fullDate} ({item.dayLabel})
                      </p>
                      <div className="flex items-center justify-between gap-4 text-orange-400 font-semibold my-0.5">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />
                          High Temperature:
                        </span>
                        <span>
                          {item.high}
                          {unitSymbol}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4 text-sky-400 font-semibold my-0.5">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-sky-500 inline-block" />
                          Low Temperature:
                        </span>
                        <span>
                          {item.low}
                          {unitSymbol}
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Legend */}
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }}
              iconType="circle"
              iconSize={8}
            />

            {/* High Temperature Line */}
            <Line
              type="monotone"
              name="High Temperature"
              dataKey="high"
              stroke="#ea580c"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#ea580c', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, fill: '#ea580c', strokeWidth: 0 }}
            />

            {/* Low Temperature Line */}
            <Line
              type="monotone"
              name="Low Temperature"
              dataKey="low"
              stroke="#0284c7"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#0284c7', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, fill: '#0284c7', strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
