import React, { useMemo } from 'react';
import {
  Compass,
  Umbrella,
  Sparkles,
  Wind,
  Flame,
  Snowflake,
  AlertCircle,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { DailyWeatherData, PlanningRecommendation, RecommendationType, UnitSystem } from '../types';
import { generatePlanningRecommendations } from '../utils/recommendations';

interface PlanningPanelProps {
  daily: DailyWeatherData;
  units: UnitSystem;
}

export const PlanningPanel: React.FC<PlanningPanelProps> = ({ daily, units }) => {
  const recommendations: PlanningRecommendation[] = useMemo(() => {
    return generatePlanningRecommendations(daily, units);
  }, [daily, units]);

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  const getCategoryIcon = (type: RecommendationType) => {
    switch (type) {
      case 'precipitation':
        return <Umbrella size={18} className="text-blue-500" />;
      case 'outdoor':
        return <Sparkles size={18} className="text-emerald-500" />;
      case 'wind':
        return <Wind size={18} className="text-teal-500" />;
      case 'heat':
        return <Flame size={18} className="text-amber-500" />;
      case 'cold':
        return <Snowflake size={18} className="text-sky-500" />;
      default:
        return <Compass size={18} className="text-blue-500" />;
    }
  };

  const getUrgencyBadge = (urgency: PlanningRecommendation['urgency']) => {
    switch (urgency) {
      case 'caution':
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-100/70 border border-amber-200 px-2 py-0.5 rounded-full">
            <AlertCircle size={11} /> Caution
          </span>
        );
      case 'ideal':
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 border border-emerald-200 px-2 py-0.5 rounded-full">
            <CheckCircle2 size={11} /> Optimal
          </span>
        );
      case 'info':
      default:
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-100/70 border border-blue-200 px-2 py-0.5 rounded-full">
            <Info size={11} /> Advisory
          </span>
        );
    }
  };

  return (
    <div
      id="planning-recommendations-panel"
      className="w-full max-w-4xl mx-auto mb-8 bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-5">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Compass size={18} className="text-blue-600" />
            <span>Weather Intelligence & Planning Recommendations</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated recommendations strictly derived from 7-day forecast numbers
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 self-start sm:self-auto">
          {recommendations.length} Active Insights
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {recommendations.map((rec, index) => (
          <div
            key={rec.id}
            id={`planning-recommendation-${index}`}
            className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white rounded-lg shadow-2xs border border-slate-100">
                    {getCategoryIcon(rec.type)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {rec.title}
                    </h4>
                    <span className="text-xs font-semibold text-blue-600">
                      Day: {rec.day}
                    </span>
                  </div>
                </div>
                {getUrgencyBadge(rec.urgency)}
              </div>

              {/* Advice copy naming the day and number */}
              <p className="text-xs text-slate-600 leading-relaxed mt-2">
                {rec.advice}
              </p>
            </div>

            {/* Grounded Trigger Number Badge */}
            <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
              <span className="text-slate-400">Grounded in:</span>
              <span className="font-mono font-semibold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200/80">
                {rec.triggerMetric}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
