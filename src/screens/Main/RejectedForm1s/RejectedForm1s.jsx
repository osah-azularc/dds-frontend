import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, InputAdornment, TextField, Typography } from '@mui/material';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import RejectedForm1DetailModal from './components/RejectedForm1DetailModal';
import RejectedForm1sLoadingOverlay from './components/RejectedForm1sLoadingOverlay';
import { SnackbarContext } from '../../../context/snackbarContext';
import { REJECTED_FORM1S_DATAGRID_STYLES, SKELETON_MIN_DURATION_MS } from './dataGridStyles';
import styles from './RejectedForm1sStyle';
import { useRejectedForm1s } from './useRejectedForm1s';
import { useTheme } from '@mui/material/styles';

const formatDateEntered = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${month}-${day}-${date.getFullYear()}`;
};

// DataGrid only sets a native `title` tooltip on cells that don't define a custom renderCell
// (see GridCell.js) - use this for plain text columns so that default hover tooltip never shows.
const renderPlainCell = (params) => params.formattedValue ?? params.value;

const RejectedForm1s = () => {
  const theme = useTheme();
  const classes = styles(theme);
  const openSnackbar = useContext(SnackbarContext);
  const [selectedRow, setSelectedRow] = useState(null);
  const {
    rows,
    loading,
    totalRecords,
    page,
    pageSize,
    sortModel,
    searchTerm,
    handleSearchChange,
    handlePaginationModelChange,
    handleSortModelChange,
  } = useRejectedForm1s();

  const [showSkeleton, setShowSkeleton] = useState(true);
  const loadingStartedAtRef = useRef(Date.now());

  // Keep the skeleton visible for a minimum duration so it doesn't just flash on
  // fast responses (including pagination/sort/search changes), mirroring the
  // ReviewForm1s/Reports DataGrid pattern in the OSAH ecourt app.
  useEffect(() => {
    if (loading) {
      loadingStartedAtRef.current = Date.now();
      setShowSkeleton(true);
      return undefined;
    }

    const elapsed = Date.now() - loadingStartedAtRef.current;
    const remainingDelay = Math.max(0, SKELETON_MIN_DURATION_MS - elapsed);

    const timeoutId = setTimeout(() => setShowSkeleton(false), remainingDelay);

    return () => clearTimeout(timeoutId);
  }, [loading]);

  const effectiveLoading = loading || showSkeleton;

  const rowsWithId = useMemo(
    () => rows.map((row) => ({ id: row.form1Id ?? row.agencyRefNumber, ...row })),
    [rows],
  );

  const columns = useMemo(
    () => [
      {
        field: 'agencyRefNumber',
        headerName: 'Agency Ref #',
        flex: 1.1,
        minWidth: 150,
        renderCell: renderPlainCell,
      },
      {
        field: 'caseType',
        headerName: 'Case Type',
        flex: 1,
        minWidth: 130,
        renderCell: renderPlainCell,
      },
      {
        field: 'caseName',
        headerName: 'Case Name',
        flex: 1.3,
        minWidth: 200,
        renderCell: renderPlainCell,
      },
      {
        field: 'dateEntered',
        headerName: 'Date Entered',
        flex: 1,
        minWidth: 140,
        valueFormatter: (params) => formatDateEntered(params.value),
        renderCell: renderPlainCell,
      },
      {
        field: 'action',
        headerName: '',
        sortable: false,
        filterable: false,
        width: 120,
        align: 'right',
        headerAlign: 'right',
        renderCell: (params) => (
          <Button
            variant={params.row.isResubmitted ? 'outlined' : 'contained'}
            color={params.row.isResubmitted ? 'secondary' : 'primary'}
            size="small"
            sx={classes.ActionButton}
            onClick={() => setSelectedRow(params.row)}
          >
            {params.row.isResubmitted ? 'View' : 'Review'}
          </Button>
        ),
      },
    ],
    [classes.ActionButton],
  );

  const skeletonRowCount = rowsWithId.length > 0 ? Math.min(pageSize, rowsWithId.length) : pageSize;

  return (
    <Box sx={classes.ContentContainer}>
      <Box sx={classes.TopBar}>
        <Typography variant="h2" color="secondary">
          Form 1s can be only resubmitted once
        </Typography>
        <TextField
          size="small"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={classes.SearchField}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box sx={{ width: '100%', minHeight: 250 }}>
        <DataGridPro
          autoHeight
          rows={effectiveLoading ? [] : rowsWithId}
          columns={columns}
          disableRowSelectionOnClick
          loading={effectiveLoading}
          pagination
          paginationMode="server"
          rowCount={totalRecords}
          paginationModel={{ page, pageSize }}
          onPaginationModelChange={handlePaginationModelChange}
          pageSizeOptions={[10, 25, 50, 100]}
          sortingMode="server"
          sortModel={sortModel}
          onSortModelChange={handleSortModelChange}
          sortingOrder={['asc', 'desc']}
          disableColumnMenu
          localeText={{ noRowsLabel: 'No results found' }}
          slots={{ loadingOverlay: RejectedForm1sLoadingOverlay }}
          slotProps={{ loadingOverlay: { columns, rowCount: skeletonRowCount } }}
          sx={
            effectiveLoading
              ? {
                  ...REJECTED_FORM1S_DATAGRID_STYLES,
                  '& .MuiDataGrid-virtualScroller': {
                    minHeight: `${skeletonRowCount * 44}px`,
                  },
                }
              : REJECTED_FORM1S_DATAGRID_STYLES
          }
        />
      </Box>

      <RejectedForm1DetailModal
        open={!!selectedRow}
        row={selectedRow}
        onClose={() => setSelectedRow(null)}
        onView={() => openSnackbar?.('The full Form 1 review page is not available yet.', 'info')}
      />
    </Box>
  );
};

export default RejectedForm1s;
