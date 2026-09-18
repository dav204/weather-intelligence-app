import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingIndicatorProps {
  message?: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  message = 'Fetching real-time weather data...',
}) => {
  return (
    <div
      id="loading-indicator-container"
      role="status"
      aria-live="polite"
      className="w-full max-w-2xl mx-auto my-12 p-8 flex flex-col items-center justify-center text-center bg-white/70 backdrop-blur-xs rounded-2xl border border-slate-200/80 shadow-xs"
    >
      <div className="relative mb-4">
        <Loader2 size={36} className="text-blue-600 animate-spin" />
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1">
        {message}
      </h3>
      <p className="text-xs text-slate-500 max-w-sm">
        Communicating directly with Open-Meteo geocoding and forecast services...
      </p>

      {/* Skeleton placeholders to reinforce loading state */}
      <div className="w-full max-w-md mt-6 space-y-2.5 animate-pulse">
        <div className="h-4 bg-slate-200 rounded-md w-3/4 mx-auto" />
        <div className="h-3 bg-slate-100 rounded-md w-1/2 mx-auto" />
      </div>
    </div>
  );
};
