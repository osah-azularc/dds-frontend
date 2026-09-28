import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useDashboard from './useDashboard';
import { showErrorSnackbar } from '../utilities/ErrorSnackBar';
import { buildSearchPayload } from '../screens/Main/Home/utils/searchResultsUtils';

const DEFAULT_PAGE_SIZE = 50;

/**
 * Docket Search results state: pagination, sorting, and fetching.
 * Filters arrive via router state from AdditionalSearchOptions's Search
 * button. Ported (and trimmed of eCourt's bulk-edit/bulk-designation/NOH
 * machinery, which DDS's search results screen doesn't have) from
 * ecourt-frontend's hooks/useSearchResultsState.js.
 */
export function useSearchResultsState() {
  const location = useLocation();
  const navigate = useNavigate();
  const { generalSearch } = useDashboard();

  const filters = location.state?.filters;
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortModel, setSortModel] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const fetchSearchResults = useCallback(
    async (currentPage, currentPageSize, currentSortModel) => {
      setLoading(true);
      try {
        const payload = buildSearchPayload(filters, currentPage, currentPageSize, currentSortModel);
        const response = await generalSearch(payload);
        if (response?.success === false) {
          setSearchResults([]);
          setTotalRecords(0);
          showErrorSnackbar(response.message || response.error || 'Failed to fetch search results');
          return;
        }
        setSearchResults(response.data || []);
        setTotalRecords(response.total || 0);
      } finally {
        setIsInitialLoad(false);
        setLoading(false);
      }
    },
    [filters, generalSearch],
  );

  useEffect(() => {
    if (!filters) {
      // Reached directly (e.g. page refresh) with no filters in router state —
      // nothing to search for, send the user back to the search panel.
      navigate('/home', { replace: true });
      return;
    }
    fetchSearchResults(page, pageSize, sortModel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchSearchResults, page, pageSize, sortModel]);

  const handlePaginationModelChange = useCallback((model) => {
    setPage(model.page);
    setPageSize(model.pageSize);
  }, []);

  const handleSortModelChange = useCallback((newSortModel) => {
    setSortModel(newSortModel);
    setPage(0);
  }, []);

  const handleBackToSearch = useCallback(() => navigate('/home'), [navigate]);

  return {
    page,
    pageSize,
    sortModel,
    searchResults,
    totalRecords,
    loading,
    isInitialLoad,
    handlePaginationModelChange,
    handleSortModelChange,
    handleBackToSearch,
  };
}
