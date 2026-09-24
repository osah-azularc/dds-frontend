import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import axiosInstance from '../../../utilities/axiosConfig';
import { SnackbarContext } from '../../../context/snackbarContext';
import { queryMockRejectedForm1s } from './mockRejectedForm1s';

const DEFAULT_SORT_MODEL = [{ field: 'agencyRefNumber', sort: 'asc' }];
const SEARCH_DEBOUNCE_MS = 500;

/**
 * Owns the Rejected Form 1's DataGrid: search, server-side sort/pagination and row data.
 * Payload shape (searchValue/limit/offset/orderby/ascdesc) mirrors loadUnassigned/loadAssigned
 * in the OSAH ecourt app's ReviewForm1s tabs, for consistency with the rest of the OSAH family.
 *
 * TODO: POST /getRejectedForm1 isn't reachable yet - OSAHAgencyController.getRejectedForm1
 * exists but isn't wired to a route, and its Agency.getRejectedForm1 model query hasn't been
 * written yet. Until then, requests fall back to the local mock dataset (mockRejectedForm1s.js)
 * so the page is demoable; once the real route exists this hook starts returning real rows
 * unchanged.
 */
export const useRejectedForm1s = () => {
  const openSnackbar = useContext(SnackbarContext);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortModel, setSortModel] = useState(DEFAULT_SORT_MODEL);
  const [searchTerm, setSearchTerm] = useState('');

  const debounceRef = useRef(null);
  const hasWarnedRef = useRef(false);

  const loadData = useCallback(
    async (currentPage, currentPageSize, currentSortModel, currentSearchTerm) => {
      const sort = currentSortModel[0] || DEFAULT_SORT_MODEL[0];

      const payload = {
        searchValue: currentSearchTerm,
        limit: currentPageSize,
        offset: currentPage * currentPageSize,
        orderby: sort.field,
        ascdesc: sort.sort === 'desc' ? 'DESC' : 'ASC',
      };

      setLoading(true);
      try {
        const response = await axiosInstance.post('/getRejectedForm1', payload);

        setRows(response.data?.data || []);
        setTotalRecords(response.data?.dataTotalSize || 0);
      } catch (error) {
        // Backend route isn't live yet - fall back to sample data so the page stays demoable,
        // and warn once instead of on every keystroke/page change.
        const mockResult = queryMockRejectedForm1s(payload);
        setRows(mockResult.data);
        setTotalRecords(mockResult.dataTotalSize);

        if (!hasWarnedRef.current) {
          hasWarnedRef.current = true;
          openSnackbar?.(
            "Showing sample data - the Rejected Form 1's API isn't connected yet.",
            'info',
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [openSnackbar],
  );

  useEffect(() => {
    loadData(page, pageSize, sortModel, searchTerm);
    // Load once on mount - subsequent loads are triggered explicitly by the handlers below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchChange = useCallback(
    (event) => {
      const { value } = event.target;
      setSearchTerm(value);

      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setPage(0);
        loadData(0, pageSize, sortModel, value);
      }, SEARCH_DEBOUNCE_MS);
    },
    [loadData, pageSize, sortModel],
  );

  const handlePaginationModelChange = useCallback(
    (model) => {
      if (model.page !== page || model.pageSize !== pageSize) {
        setPage(model.page);
        setPageSize(model.pageSize);
        loadData(model.page, model.pageSize, sortModel, searchTerm);
      }
    },
    [page, pageSize, sortModel, searchTerm, loadData],
  );

  const handleSortModelChange = useCallback(
    (newModel) => {
      const effectiveModel = newModel.length > 0 ? newModel : DEFAULT_SORT_MODEL;
      setSortModel(effectiveModel);
      loadData(page, pageSize, effectiveModel, searchTerm);
    },
    [page, pageSize, searchTerm, loadData],
  );

  return {
    rows,
    loading,
    totalRecords,
    page,
    pageSize,
    sortModel,
    searchTerm,
    loadData,
    handleSearchChange,
    handlePaginationModelChange,
    handleSortModelChange,
  };
};

export default useRejectedForm1s;
