import React from 'react';
import { MapPin, ChevronRight, Check } from 'lucide-react';
import { CandidatePlace } from '../types';

interface CandidateSelectorProps {
  candidates: CandidatePlace[];
  selectedPlace: CandidatePlace | null;
  searchQuery: string;
  onSelectCandidate: (candidate: CandidatePlace) => void;
}

export const CandidateSelector: React.FC<CandidateSelectorProps> = ({
  candidates,
  selectedPlace,
  searchQuery,
  onSelectCandidate,
}) => {
  if (candidates.length <= 1 && selectedPlace) {
    return null;
  }

  return (
    <div
      id="candidate-disambiguation-panel"
      className="w-full max-w-4xl mx-auto mb-6 bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 sm:p-5 shadow-xs"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
        <div>
          <h3 className="text-sm font-semibold text-amber-900 flex items-center gap-1.5">
            <MapPin size={16} className="text-amber-600" />
            <span>Multiple matches found for &ldquo;{searchQuery}&rdquo;</span>
          </h3>
          <p className="text-xs text-amber-700 mt-0.5">
            Please choose the exact location you would like to view weather intelligence for:
          </p>
        </div>
        <span className="self-start sm:self-auto text-xs font-medium text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-200">
          {candidates.length} candidates
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
        {candidates.map((candidate) => {
          const isSelected = selectedPlace?.id === candidate.id;
          const locationDetails = [candidate.admin1, candidate.country].filter(Boolean).join(', ');

          return (
            <button
              key={`${candidate.id}-${candidate.latitude}-${candidate.longitude}`}
              id={`candidate-option-${candidate.id}`}
              type="button"
              onClick={() => onSelectCandidate(candidate)}
              className={`text-left p-3 rounded-xl border transition-all flex items-center justify-between group cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white text-slate-800 border-amber-200 hover:border-blue-300 hover:bg-blue-50/50'
              }`}
            >
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-1.5 font-semibold text-sm truncate">
                  <span className={isSelected ? 'text-white' : 'text-slate-900'}>{candidate.name}</span>
                  {candidate.country_code && (
                    <span
                      className={`text-xs px-1.5 py-0.2 rounded font-mono ${
                        isSelected ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {candidate.country_code}
                    </span>
                  )}
                </div>
                <div
                  className={`text-xs truncate mt-0.5 ${
                    isSelected ? 'text-blue-100' : 'text-slate-500'
                  }`}
                >
                  {locationDetails || 'Coordinates: ' + candidate.latitude.toFixed(2) + ', ' + candidate.longitude.toFixed(2)}
                </div>
              </div>

              <div className="shrink-0 pl-1">
                {isSelected ? (
                  <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white">
                    <Check size={14} />
                  </span>
                ) : (
                  <span className="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-blue-100 group-hover:text-blue-600 flex items-center justify-center text-slate-400 transition-colors">
                    <ChevronRight size={14} />
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
