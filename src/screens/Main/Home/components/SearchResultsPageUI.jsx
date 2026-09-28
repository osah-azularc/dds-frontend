import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGridPro } from '@mui/x-data-grid-pro';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getSearchResultsColumns } from './SearchResultsColumns';
import { transformSearchResults } from '../utils/searchResultsUtils';
import NoRowsOverlay, { NO_ROWS_OVERLAY_SX } from '../../../../components/common/NoRowsOverlay';
import SearchLoadingOverlay from './SearchLoadingOverlay';
import { SEARCH_RESULTS_DATAGRID_STYLES } from './dataGridStyles';

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
const TABLE_MIN_HEIGHT = 250;
const PAGE_SIZE_OPTIONS = [50, 100, 150, 200, 250, 300];

/**
 * Docket Search results grid. Ported from ecourt-frontend's
 * Home/components/SearchResultsPageUI.jsx, trimmed down to what DDS's
 * simpler search-results view needs (no bulk edit/designation/email/NOH
 * banners or modals, no row selection).
 */
export function SearchResultsPageUI({
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
}) {
  const theme = useTheme();
  const columns = useMemo(() => getSearchResultsColumns(theme), [theme]);
  const rows = useMemo(() => transformSearchResults(searchResults), [searchResults]);

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
              <Button startIcon={<ArrowBackIcon />} onClick={handleBackToSearch}>
                Back to Search
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} pt={2}>
            <Box sx={{ height: `${TABLE_MIN_HEIGHT}px` }}>
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
                  ...(loading && {
                    '& .MuiDataGrid-overlayWrapper, & .MuiDataGrid-overlayWrapperInner': {
                      height: `${pageSize * ROW_HEIGHT}px !important`,
                      minHeight: `${pageSize * ROW_HEIGHT}px !important`,
                    },
                  }),
                  '& .MuiDataGrid-cell': {
                    display: 'flex',
                    alignItems: 'center',
                    paddingTop: '4px',
                    paddingBottom: '4px',
                  },
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

SearchResultsPageUI.propTypes = {
  page: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  sortModel: PropTypes.array.isRequired,
  searchResults: PropTypes.array.isRequired,
  totalRecords: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  isInitialLoad: PropTypes.bool.isRequired,
  handlePaginationModelChange: PropTypes.func.isRequired,
  handleSortModelChange: PropTypes.func.isRequired,
  handleBackToSearch: PropTypes.func.isRequired,
};
