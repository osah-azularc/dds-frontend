import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGridPro } from '@mui/x-data-grid-pro';
import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSearchResultsColumns } from './components/SearchResultsColumns';
import NoRowsOverlay from './components/NoRowsOverlay';
import {
  SEARCH_RESULTS_COLUMN_HEADER_HEIGHT,
  SEARCH_RESULTS_DATAGRID_STYLES,
  SEARCH_RESULTS_ROW_HEIGHT,
  SEARCH_RESULTS_TABLE_MIN_HEIGHT,
} from './components/searchResultsDataGridStyles';
import { formatDate, formatTime, transformSearchResults } from './utils/searchResultsUtils';
import { useSearchResultsPage } from './useSearchResultsPage';
import styles from './SearchResultsPageStyles';

const SearchResultsPage = () => {
  const theme = useTheme();
  const classes = styles(theme);
  const navigate = useNavigate();
  const {
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
  } = useSearchResultsPage();

  const rows = useMemo(
    () => transformSearchResults(searchResults, formatDate, formatTime),
    [searchResults],
  );
  const columns = useMemo(() => getSearchResultsColumns(theme), [theme]);

  const handleRowClick = useCallback(
    (params) => {
      // `params.row` is the DataGrid-shaped row (formatted dates, missing
      // fields like parties/county) - look up the raw record that has
      // everything DocketDetailView needs.
      const rawDocket = searchResults.find((item) => (item.docketId ?? item.caseId) === params.id);
      navigate(`/form1/${params.id}`, { state: { docket: rawDocket } });
    },
    [navigate, searchResults],
  );

  return (
    <Box sx={classes.PageOuter}>
      <Box sx={classes.GridContainer}>
        <DataGridPro
          autoHeight={false}
          rows={loading ? [] : rows}
          columns={columns}
          loading={loading}
          columnHeaderHeight={SEARCH_RESULTS_COLUMN_HEADER_HEIGHT}
          getRowHeight={() => SEARCH_RESULTS_ROW_HEIGHT}
          slots={{ noRowsOverlay: NoRowsOverlay }}
          slotProps={{ noRowsOverlay: { isInitialLoad } }}
          pagination
          paginationMode="server"
          rowCount={totalRecords}
          paginationModel={{ page, pageSize }}
          onPaginationModelChange={(model) => {
            if (model.page !== page) handlePageChange(null, model.page);
            if (model.pageSize !== pageSize)
              handlePageSizeChange({ target: { value: model.pageSize } });
          }}
          pageSizeOptions={[10, 25, 50, 100]}
          sortingMode="server"
          sortModel={sortModel}
          onSortModelChange={handleSortModelChange}
          sortingOrder={['asc', 'desc']}
          disableColumnMenu
          onRowClick={handleRowClick}
          sx={{
            ...SEARCH_RESULTS_DATAGRID_STYLES,
            height: '100%',
            minHeight: `${SEARCH_RESULTS_TABLE_MIN_HEIGHT}px`,
          }}
        />
      </Box>
    </Box>
  );
};

export default React.memo(SearchResultsPage);
