import { Box, Grid } from '@mui/material';
import { DataGridPro } from '@mui/x-data-grid-pro';
import dayjs from 'dayjs';
import DOMPurify from 'dompurify';
import PropTypes from 'prop-types';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { SnackbarContext } from '../../../../context/snackbarContext';
import { getDocketHistory } from '../../../../services/api/docketHistoryService';
import RejectedForm1sLoadingOverlay from '../../RejectedForm1s/components/RejectedForm1sLoadingOverlay';

const DEFAULT_ROWS_PER_PAGE = 10;
const DEFAULT_SORT_MODEL = [{ field: 'date', sort: 'desc' }];

const getDefaultPagination = (limit = DEFAULT_ROWS_PER_PAGE) => ({
  total: 0,
  page: 0,
  limit,
  totalPages: 0,
});

const formatHistoryDateTime = (date, time) => {
  if (!date) return { date: '-', time: '-' };
  const parsed = dayjs(`${date} ${time || '00:00:00'}`);
  if (!parsed.isValid()) return { date: String(date), time: time ? String(time) : '-' };
  return { date: parsed.format('MM/DD/YYYY'), time: parsed.format('hh:mm A') };
};

const mapHistoryRows = (rows) =>
  rows.map((item, index) => {
    const { date, time } = formatHistoryDateTime(item.date, item.createdTime);
    return {
      id: item.id ?? `history-${index}`,
      date,
      time,
      description: DOMPurify.sanitize(
        String(item.description ?? '').trim() || 'No description available',
      ),
      modifiedBy: item.modifiedBy || '-',
    };
  });

const HistoryTab = ({ caseId }) => {
  const openSnackbar = useContext(SnackbarContext);
  const normalizedCaseId = String(caseId ?? '').trim();
  const previousCaseIdRef = useRef(normalizedCaseId);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: DEFAULT_ROWS_PER_PAGE,
  });
  const [pagination, setPagination] = useState(getDefaultPagination(DEFAULT_ROWS_PER_PAGE));
  const [sortModel, setSortModel] = useState(DEFAULT_SORT_MODEL);

  useEffect(() => {
    let isMounted = true;

    const fetchRows = async () => {
      if (!normalizedCaseId) {
        setRows([]);
        setPagination(getDefaultPagination(paginationModel.pageSize));
        return;
      }

      const caseChanged = previousCaseIdRef.current !== normalizedCaseId;
      previousCaseIdRef.current = normalizedCaseId;

      const effectivePaginationModel = caseChanged
        ? { page: 0, pageSize: DEFAULT_ROWS_PER_PAGE }
        : paginationModel;
      const activeSortModel = sortModel[0] || DEFAULT_SORT_MODEL[0];

      if (caseChanged) {
        setPaginationModel(effectivePaginationModel);
        setSortModel(DEFAULT_SORT_MODEL);
      }

      setLoading(true);
      try {
        const result = await getDocketHistory(normalizedCaseId, {
          page: effectivePaginationModel.page,
          limit: effectivePaginationModel.pageSize,
          sortBy: activeSortModel.field,
          sortOrder: activeSortModel.sort,
        });

        if (!isMounted) return;

        if (result.success) {
          setRows(mapHistoryRows(result.data || []));
          setPagination(
            result.pagination || getDefaultPagination(effectivePaginationModel.pageSize),
          );
        } else {
          setRows([]);
          setPagination(getDefaultPagination(effectivePaginationModel.pageSize));
          openSnackbar?.(result.error || 'Failed to load history data', 'error');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRows();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normalizedCaseId, paginationModel, sortModel]);

  const columns = useMemo(
    () => [
      { field: 'date', headerName: 'Date', width: 150 },
      { field: 'time', headerName: 'Time', width: 120 },
      {
        field: 'description',
        headerName: 'Description',
        flex: 1,
        minWidth: 260,
        renderCell: ({ value }) => (
          <Box sx={{ py: 1, whiteSpace: 'normal' }} dangerouslySetInnerHTML={{ __html: value }} />
        ),
      },
      { field: 'modifiedBy', headerName: 'Modified By', width: 180 },
    ],
    [],
  );

  const handleSortModelChange = useCallback((newSortModel) => {
    setPaginationModel((previous) => ({ ...previous, page: 0 }));
    setSortModel(newSortModel?.length ? newSortModel : DEFAULT_SORT_MODEL);
  }, []);

  return (
    <Grid container direction="column">
      <Grid item xs={12} sx={{ p: 3, minWidth: 0 }}>
        <Box>
          <DataGridPro
            autoHeight
            rows={loading ? [] : rows}
            columns={columns}
            loading={loading}
            pagination
            paginationMode="server"
            rowCount={pagination.total}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 25, 50, 100]}
            sortingMode="server"
            sortModel={sortModel}
            onSortModelChange={handleSortModelChange}
            disableRowSelectionOnClick
            disableColumnMenu
            getRowHeight={() => 'auto'}
            localeText={{
              noRowsLabel: normalizedCaseId ? 'No Results Found.' : 'No docket selected',
            }}
            slots={{ loadingOverlay: RejectedForm1sLoadingOverlay }}
            slotProps={{ loadingOverlay: { columns, rowCount: 5 } }}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

HistoryTab.propTypes = {
  caseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

HistoryTab.defaultProps = {
  caseId: null,
};

export default HistoryTab;
