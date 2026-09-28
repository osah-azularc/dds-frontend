import React from 'react';
import { useSearchResultsState } from '../../../hooks/useSearchResultsState';
import { SearchResultsPageUI } from './components/SearchResultsPageUI';

/**
 * Docket Search results screen, reached from AdditionalSearchOptions's
 * Search button via router state ({ filters, searchType }).
 */
const SearchResultsPage = () => {
  const state = useSearchResultsState();
  return <SearchResultsPageUI {...state} />;
};

export default React.memo(SearchResultsPage);
