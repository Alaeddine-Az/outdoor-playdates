// This module keeps track of global connection state that persists
// across hook re-initializations to prevent duplicate fetches

import { useRef } from 'react';

let hasLoadedSuggestionsGlobal = false;

export function useConnectionsState() {
  const wasLoadedRef = useRef(hasLoadedSuggestionsGlobal);

  const markSuggestionsLoaded = () => {
    hasLoadedSuggestionsGlobal = true;
    wasLoadedRef.current = true;
  };

  return {
    hasLoadedSuggestions: wasLoadedRef.current,
    markSuggestionsLoaded,
  };
}
