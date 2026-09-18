import React from 'react';
import { AlertTriangle, RefreshCw, SearchX } from 'lucide-react';

interface ErrorAlertProps {
  errorType: 'not_found' | 'network';
  message: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  errorType,
  message,
  onRetry,
  isRetrying = false,
}) => {
  if (errorType === 'not_found') {
    return (
      <div
        id="error-city-not-found"
        role="alert"
        className="w-full max-w-2xl mx-auto my-8 bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center shadow-xs"
      >
        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3">
          <SearchX size={24} />
        </div>
        <h3 className="text-base font-bold text-amber-900 mb-1">
          Location Not Found
        </h3>
        <p className="text-sm text-amber-800 leading-relaxed mb-3">
          {message}
        </p>
        <p className="text-xs text-amber-600">
          Try typing a different city name, state, or country in the search box above.
        </p>
      </div>
    );
  }

  return (
    <div
      id="error-network-failure"
      role="alert"
      className="w-full max-w-2xl mx-auto my-8 bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center shadow-xs"
    >
      <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
        <AlertTriangle size={24} />
      </div>
      <h3 className="text-base font-bold text-rose-900 mb-1">
        Weather Service Connection Failure
      </h3>
      <p className="text-sm text-rose-800 leading-relaxed mb-4">
        {message || 'The weather service could not be reached. Please verify your internet connection and try again.'}
      </p>
      {onRetry && (
        <button
          id="retry-search-button"
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-xl font-medium text-sm transition-colors cursor-pointer shadow-xs disabled:opacity-50"
        >
          <RefreshCw size={16} className={isRetrying ? 'animate-spin' : ''} />
          <span>{isRetrying ? 'Retrying...' : 'Retry Search'}</span>
        </button>
      )}
    </div>
  );
};
