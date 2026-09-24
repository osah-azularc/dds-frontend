import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { DUMMY_SEARCH_RESULTS } from './constants/dummySearchResults';

const DEFAULT_PAGE_SIZE = 50;

// Maps grid column fields to the raw result fields sorted against - mirrors
// the FIELD_MAPPING a real server-side sort would use.
const SORT_FIELD_MAP = {
  docket: 'docketNo',
  caseName: 'caseName',
  caseType: 'caseType',
  dateReceived: 'dateReceived',
  hearingDate: 'hearingDate',
  hearingTime: 'hearingTime',
  hearingLocation: 'hearingLocation',
  status: 'status',
  judge: 'judge',
};

/**
 * Owns the DDS search results grid state (pagination, sorting, results).
 *
 * TODO: wire fetchSearchResults to the real DDS docket-search endpoint once
 * it exists on the backend - mirrors the same TODO already left on the
 * Home page's docket search and Additional Search Options form. Until then
 * this returns DUMMY_SEARCH_RESULTS, sorted/paginated client-side to stand
 * in for what the server will eventually do.
 */
export const useSearchResultsPage = () => {
  const location = useLocation();
  const searchState = location.state || null;

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortModel, setSortModel] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const fetchSearchResults = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: replace with the real DDS search API call using searchState
      // (searchType + docketNo, or searchType + filters).
      const rows = [...DUMMY_SEARCH_RESULTS];

      const [sort] = sortModel;
      const sortField = sort && SORT_FIELD_MAP[sort.field];
      if (sortField) {
        rows.sort((a, b) => {
          const result = String(a[sortField]).localeCompare(String(b[sortField]));
          return sort.sort === 'desc' ? -result : result;
        });
      }

      setTotalRecords(rows.length);
      setSearchResults(rows.slice(page * pageSize, page * pageSize + pageSize));
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchState, page, pageSize, sortModel]);

  useEffect(() => {
    fetchSearchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, sortModel]);

  const handlePageChange = useCallback((_, newPage) => setPage(newPage), []);

  const handlePageSizeChange = useCallback((e) => {
    setPageSize(Number(e.target.value));
    setPage(0);
  }, []);

  const handleSortModelChange = useCallback((newSortModel) => setSortModel(newSortModel), []);

  return useMemo(
    () => ({
      searchState,
      page,
      pageSize,
      sortModel,
      searchResults,
      totalRecords,
      loading,
      isInitialLoad,
      handlePageChange,
      handlePageSizeChange,
      handleSortModelChange,
    }),
    [
      searchState,
      page,
      pageSize,
      sortModel,
      searchResults,
      totalRecords,
      loading,
      isInitialLoad,
      handlePageChange,
      handlePageSizeChange,
      handleSortModelChange,
    ],
  );
};

export default useSearchResultsPage;
