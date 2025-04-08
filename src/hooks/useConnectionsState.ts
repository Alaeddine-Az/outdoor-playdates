// This module keeps track of global connection state that persists
// across hook re-initializations to prevent duplicate fetches

let hasLoadedSuggestionsGlobal = false;

export function useConnectionsState() {
  const { useRef } = require('react');
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
