import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useDashboard from './useDashboard';
import { useConfirmDialog } from './useConfirmDialog';
import { useSearchResultsDownload } from './useSearchResultsDownload';
import { showErrorSnackbar } from '../utilities/ErrorSnackBar';
import {
  buildSearchPayload,
  transformSearchResults,
} from '../screens/Main/Home/utils/searchResultsUtils';

const DEFAULT_PAGE_SIZE = 50;

/**
 * Docket Search results state: pagination, sorting, fetching, row selection,
 * and the Download Files/Export actions. Filters arrive via router state
 * from AdditionalSearchOptions's Search button. Ported (and trimmed of
 * eCourt's bulk-edit/bulk-designation/NOH machinery, which DDS's search
 * results screen doesn't have) from ecourt-frontend's
 * hooks/useSearchResultsState.js.
 */
export function useSearchResultsState() {
  const location = useLocation();
  const navigate = useNavigate();
  const { generalSearch, superuserSearch } = useDashboard();
  const { ConfirmDialog, showConfirmDialog } = useConfirmDialog();
  const isSuperuser = useSelector((state) => state.user.user_type) === 'dds_superuser';

  const filters = location.state?.filters;
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortModel, setSortModel] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);

  const rows = useMemo(() => transformSearchResults(searchResults), [searchResults]);

  const fetchSearchResults = useCallback(
    async (currentPage, currentPageSize, currentSortModel) => {
      setLoading(true);
      try {
        const payload = buildSearchPayload(filters, currentPage, currentPageSize, currentSortModel);
        const response = await (isSuperuser ? superuserSearch(payload) : generalSearch(payload));
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
    [filters, isSuperuser, generalSearch, superuserSearch],
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

  // Docket cell / row click. Regular DDS search rows (form1_docket) already carry form1Id and
  // go to /form1/reqdt/:form1Id; dds_superuser rows (the broader `docket` table, see
  // useDashboard.js's superuserSearch) don't have one, so they go to /docket/reqdt/:caseId
  // instead -- the same Form1.jsx, which detects the caseId param and looks the case up
  // directly instead (see useForm1New.js/useSuperuserDocketData.js).
  const handleRowClick = useCallback(
    (row) => {
      if (row.form1Id) {
        navigate(`/form1/reqdt/${row.form1Id}`);
        return;
      }
      if (!row.docket || row.docket === '...') return;

      navigate(`/docket/reqdt/${row.docket}`);
    },
    [navigate],
  );

  const downloadHandlers = useSearchResultsDownload({
    rows,
    totalRecords,
    currentFilters: filters,
    sortModel,
    selectedRows,
    setSelectedRows,
    showConfirmDialog,
  });

  return {
    page,
    pageSize,
    sortModel,
    rows,
    searchResults,
    totalRecords,
    loading,
    isInitialLoad,
    selectedRows,
    setSelectedRows,
    handlePaginationModelChange,
    handleSortModelChange,
    handleRowClick,
    ConfirmDialog,
    ...downloadHandlers,
  };
}
