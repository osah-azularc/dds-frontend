/**
 * Shared DataGrid styles for the Docket Search results grid
 *
 * This constant provides consistent styling to ensure proper text
 * truncation, scrolling, and hover behavior. Ported from ecourt-frontend's
 * Reports/components/dataGridStyles.js.
 */
export const SEARCH_RESULTS_DATAGRID_STYLES = {
  width: '100%',
  minWidth: 0,
  height: '100%',
  '--DataGrid-overlayHeight': 'auto',
  boxSizing: 'border-box',
  '& .MuiDataGrid-virtualScroller': {
    overflowX: 'auto',
    overflowY: 'auto',
  },
  '& .MuiDataGrid-overlayWrapper, & .MuiDataGrid-overlayWrapperInner': {
    height: '100px !important',
    minHeight: '100px !important',
  },
  '& .MuiDataGrid-overlay': {
    height: '100% !important',
    minHeight: '100px !important',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Truncate cell content and headers to avoid expansion
  '& .MuiDataGrid-cell, & .MuiDataGrid-columnHeader': {
    minWidth: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  // Ensure inner content elements also truncate (e.g., links)
  '& .MuiDataGrid-cellContent': {
    display: 'block',
    maxWidth: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  '& .MuiDataGrid-row:hover': {
    cursor: 'pointer',
  },
};
