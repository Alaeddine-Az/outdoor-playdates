
import React from 'react';
import { Loader2, MapPin } from 'lucide-react';
import { MapboxFeature } from '@/hooks/useLocationSuggestions';

interface LocationSuggestionsProps {
  isLoading: boolean;
  suggestions: MapboxFeature[];
  onSuggestionClick: (suggestion: MapboxFeature) => void;
  showSuggestions: boolean;
  suggestionsRef: React.RefObject<HTMLDivElement>;
}

export const LocationSuggestions: React.FC<LocationSuggestionsProps> = ({
  isLoading,
  suggestions,
  onSuggestionClick,
  showSuggestions,
  suggestionsRef
}) => {
  if (!showSuggestions || (!isLoading && suggestions.length === 0)) {
    return null;
  }

  return (
    <div 
      ref={suggestionsRef}
      className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-input max-h-60 overflow-auto"
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-2">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span className="text-sm">Loading suggestions...</span>
        </div>
      ) : (
        <ul>
          {suggestions.map((suggestion) => (
            <li 
              key={suggestion.id}
              className="px-3 py-2 hover:bg-muted cursor-pointer text-sm flex items-start"
              onClick={() => onSuggestionClick(suggestion)}
            >
              <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>{suggestion.place_name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
