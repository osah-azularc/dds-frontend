import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Grid, Menu, MenuItem, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGridPro } from '@mui/x-data-grid-pro';
import GetAppIcon from '@mui/icons-material/GetApp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { getSearchResultsColumns } from './SearchResultsColumns';
import NoRowsOverlay, { NO_ROWS_OVERLAY_SX } from '../../../../components/common/NoRowsOverlay';
import SearchLoadingOverlay from './SearchLoadingOverlay';
import { SEARCH_RESULTS_DATAGRID_STYLES } from './dataGridStyles';

const ACTION_BUTTON_SX = {
  backgroundColor: '#D4A500',
  color: '#fff',
  textTransform: 'none',
  fontWeight: 600,
  '&:hover': { backgroundColor: '#C49500' },
};

// Stays blank (rather than "No Results Found") until the first search actually
// completes -- isInitialLoad starts true in useSearchResultsState.js.
function SearchNoRowsOverlay({ isInitialLoad }) {
  if (isInitialLoad) return null;
  return <NoRowsOverlay message="No Results Found" />;
}

SearchNoRowsOverlay.propTypes = { isInitialLoad: PropTypes.bool.isRequired };

const DATAGRID_SLOTS = { noRowsOverlay: SearchNoRowsOverlay, loadingOverlay: SearchLoadingOverlay };

const COLUMN_HEADER_HEIGHT = 50;
const ROW_HEIGHT = 44;
// header + a definite-height "no rows"/loading overlay (100px, see dataGridStyles.js) -- a
// min-height the container can grow past, not a hard cap, so the footer/pagination bar is
// never squeezed out once real rows (or a wide pageSize's loading overlay) need more room.
// Matches the UI design team's own SearchResultsPage.jsx (dds-frontend-feature-ui-design).
const TABLE_MIN_HEIGHT = COLUMN_HEADER_HEIGHT + 100;
const PAGE_SIZE_OPTIONS = [50, 100, 150, 200, 250, 300];

/**
 * Docket Search results grid. Ported from ecourt-frontend's
 * Home/components/SearchResultsPageUI.jsx, trimmed down to what DDS's
 * simpler search-results view needs (no bulk edit/designation/email/NOH
 * banners or modals) -- row selection is kept for the Download Files action
 * (Download Case Files/Download Decisions), matching legacy's superuser
 * search results screen (superuser.phtml).
 */
export function SearchResultsPageUI({
  page,
  pageSize,
  sortModel,
  rows,
  totalRecords,
  loading,
  isInitialLoad,
  selectedRows,
  setSelectedRows,
  handlePaginationModelChange,
  handleSortModelChange,
  downloadAnchor,
  handleDownloadClick,
  handleDownloadClose,
  handleDownloadCaseFiles,
  handleDownloadDecisions,
  handleExport,
  handleRowClick,
  ConfirmDialog,
}) {
  const theme = useTheme();
  const columns = useMemo(
    () => getSearchResultsColumns(theme, handleRowClick),
    [theme, handleRowClick],
  );
  const hasSelectedRows = selectedRows.length > 0;

  // Click anywhere in a row (not just the Docket link) to open it -- matches legacy's
  // superuser.phtml, where every <td> carries the same ng-click="searchbydocket(...)". The
  // Docket cell's own Link/button already handles its click, and the checkbox cell must stay
  // selection-only, so both are excluded here to avoid a redundant/competing navigation.
  const handleCellClick = (params) => {
    if (params.field === '__check__' || params.field === 'docket') return;
    handleRowClick(params.row);
  };

  return (
    <Grid container>
      <Grid item xs={12} p={2}>
        <Grid container>
          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                Total Records: <strong>{totalRecords}</strong>
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  endIcon={<KeyboardArrowDownIcon />}
                  onClick={handleDownloadClick}
                  sx={ACTION_BUTTON_SX}
                >
                  Download Files
                </Button>
                <Menu
                  anchorEl={downloadAnchor}
                  open={Boolean(downloadAnchor)}
                  onClose={handleDownloadClose}
                >
                  <MenuItem onClick={handleDownloadCaseFiles} disabled={!hasSelectedRows}>
                    Download Case Files
                  </MenuItem>
                  <MenuItem onClick={handleDownloadDecisions} disabled={!hasSelectedRows}>
                    Download Decisions
                  </MenuItem>
                </Menu>
                <Button
                  variant="contained"
                  startIcon={<GetAppIcon />}
                  onClick={handleExport}
                  sx={ACTION_BUTTON_SX}
                >
                  Export
                </Button>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} pt={2}>
            <Box sx={{ minHeight: `${TABLE_MIN_HEIGHT}px` }}>
              <DataGridPro
                autoHeight={false}
                rows={loading ? [] : rows}
                columns={columns}
                loading={loading}
                columnHeaderHeight={COLUMN_HEADER_HEIGHT}
                getRowHeight={() => ROW_HEIGHT}
                slots={DATAGRID_SLOTS}
                slotProps={{
                  noRowsOverlay: { isInitialLoad },
                  loadingOverlay: { columns },
                }}
                checkboxSelection
                rowSelectionModel={selectedRows}
                onRowSelectionModelChange={setSelectedRows}
                onCellClick={handleCellClick}
                pagination
                paginationMode="server"
                rowCount={totalRecords}
                paginationModel={{ page, pageSize }}
                onPaginationModelChange={handlePaginationModelChange}
                pageSizeOptions={PAGE_SIZE_OPTIONS}
                sortingMode="server"
                sortModel={sortModel}
                onSortModelChange={handleSortModelChange}
                sortingOrder={['asc', 'desc']}
                disableColumnMenu
                sx={{
                  ...SEARCH_RESULTS_DATAGRID_STYLES,
                  ...NO_ROWS_OVERLAY_SX,
                  height: '100%',
                  minHeight: `${TABLE_MIN_HEIGHT}px`,
                  '& .MuiDataGrid-cell': {
                    display: 'flex',
                    alignItems: 'center',
                    paddingTop: '4px',
                    paddingBottom: '4px',
                  },
                  '& .MuiDataGrid-cell:not(.MuiDataGrid-cellCheckbox)': {
                    cursor: 'pointer',
                  },
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <ConfirmDialog />
    </Grid>
  );
}

SearchResultsPageUI.propTypes = {
  page: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  sortModel: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  totalRecords: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  isInitialLoad: PropTypes.bool.isRequired,
  selectedRows: PropTypes.array.isRequired,
  setSelectedRows: PropTypes.func.isRequired,
  handlePaginationModelChange: PropTypes.func.isRequired,
  handleSortModelChange: PropTypes.func.isRequired,
  handleRowClick: PropTypes.func.isRequired,
  downloadAnchor: PropTypes.object,
  handleDownloadClick: PropTypes.func.isRequired,
  handleDownloadClose: PropTypes.func.isRequired,
  handleDownloadCaseFiles: PropTypes.func.isRequired,
  handleDownloadDecisions: PropTypes.func.isRequired,
  handleExport: PropTypes.func.isRequired,
  ConfirmDialog: PropTypes.elementType.isRequired,
};

SearchResultsPageUI.defaultProps = {
  downloadAnchor: null,
};
