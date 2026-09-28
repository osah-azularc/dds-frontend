import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Grid } from '@mui/material';
import { DataGridPro } from '@mui/x-data-grid-pro';
import DOMPurify from 'dompurify';
import dayjs from 'dayjs';
import { getForm1History } from '../../../../services/form1HistoryService';
import { showErrorSnackbar } from '../../../../utilities/ErrorSnackBar';
import NoRowsOverlay, { NO_ROWS_OVERLAY_SX } from '../../../../components/common/NoRowsOverlay';

const DEFAULT_SORT = { field: 'date', sort: 'desc' };
const DEFAULT_PAGE_SIZE = 10;
const DATAGRID_SLOTS = { noRowsOverlay: NoRowsOverlay };
const NO_ROWS_OVERLAY_PROPS = { message: 'No records found.' };

const mapHistoryRow = (row) => ({
  id: row.id,
  date: row.date ? dayjs(row.date).format('MM-DD-YYYY') : '-',
  createdTime: row.createdTime || '-',
  description: DOMPurify.sanitize(row.description || ''),
  modifiedBy: row.modifiedBy || '-',
});

const COLUMNS = [
  { field: 'date', headerName: 'Date', width: 130 },
  { field: 'createdTime', headerName: 'Time', width: 110, sortable: false },
  {
    field: 'description',
    headerName: 'Description',
    flex: 1,
    minWidth: 320,
    renderCell: ({ value }) => (
      // eslint-disable-next-line react/no-danger
      <Box
        sx={{ py: 1, whiteSpace: 'normal', overflowWrap: 'anywhere' }}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    ),
  },
  { field: 'modifiedBy', headerName: 'Modified By', width: 160 },
];

/**
 * Read-only audit-trail table for the existing-docket review screen's
 * History tab (/form1/history/reqdt/:form1Id). Rows are written as a side
 * effect of the party/notes/Temporary Permit actions (see
 * ddsHistoryMessageBuilder.js); nothing on this screen creates them
 * directly, matching legacy's form1-history.phtml (view-only, no add/edit).
 */
const HistoryTable = ({ form1Id }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 0,
    limit: DEFAULT_PAGE_SIZE,
    totalPages: 0,
  });
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: DEFAULT_PAGE_SIZE });
  const [sortModel, setSortModel] = useState([DEFAULT_SORT]);

  const fetchHistory = useCallback(async () => {
    if (!form1Id) return;
    setLoading(true);
    const activeSort = sortModel[0] || DEFAULT_SORT;
    try {
      const response = await getForm1History(form1Id, {
        page: paginationModel.page,
        limit: paginationModel.pageSize,
        sortBy: activeSort.field,
        sortOrder: activeSort.sort,
      });
      setRows((response.result || []).map(mapHistoryRow));
      setPagination(
        response.pagination || {
          total: 0,
          page: 0,
          limit: paginationModel.pageSize,
          totalPages: 0,
        },
      );
    } catch (error) {
      showErrorSnackbar(error.response?.data?.error || 'Failed to load history.');
    } finally {
      setLoading(false);
    }
  }, [form1Id, paginationModel, sortModel]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleSortModelChange = (newSortModel) => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
    setSortModel(newSortModel?.length ? newSortModel : [DEFAULT_SORT]);
  };

  return (
    <Box sx={{ backgroundColor: '#fff', p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <DataGridPro
            autoHeight
            rows={rows}
            columns={COLUMNS}
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
            slots={DATAGRID_SLOTS}
            slotProps={{ noRowsOverlay: NO_ROWS_OVERLAY_PROPS }}
            sx={NO_ROWS_OVERLAY_SX}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

HistoryTable.propTypes = {
  form1Id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default React.memo(HistoryTable);
