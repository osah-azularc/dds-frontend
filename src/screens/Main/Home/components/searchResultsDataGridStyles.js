export const SEARCH_RESULTS_COLUMN_HEADER_HEIGHT = 50;
export const SEARCH_RESULTS_ROW_HEIGHT = 44;

// Percentage heights can't cascade down the DataGrid's own overlay wrapper
// chain (its actual height is `auto`, sized off no content) so the "No
// Results Found" overlay is given a definite pixel height instead, letting
// NoRowsOverlay center against a real number instead of silently collapsing
// to its text's own height.
const SEARCH_RESULTS_OVERLAY_HEIGHT = 100;

// The table's overall min-height is kept in lockstep with header + overlay
// height - anything taller leaves dead white space below the "No Results
// Found" text (the grid's virtualScroller pads out to fill the container,
// but the fixed-height overlay doesn't grow to match).
export const SEARCH_RESULTS_TABLE_MIN_HEIGHT =
  SEARCH_RESULTS_COLUMN_HEADER_HEIGHT + SEARCH_RESULTS_OVERLAY_HEIGHT;

/**
 * Shared DataGrid styles for the DDS search results grid, matching the
 * layout used by the eCourt search results grid (truncation, hover, overlay
 * sizing behavior).
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
    height: `${SEARCH_RESULTS_OVERLAY_HEIGHT}px !important`,
    minHeight: `${SEARCH_RESULTS_OVERLAY_HEIGHT}px !important`,
  },
  '& .MuiDataGrid-overlay': {
    height: '100% !important',
    minHeight: `${SEARCH_RESULTS_OVERLAY_HEIGHT}px !important`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  '& .MuiDataGrid-cell, & .MuiDataGrid-columnHeader': {
    minWidth: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  '& .MuiDataGrid-cellContent': {
    display: 'block',
    maxWidth: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  '& .MuiDataGrid-cell': {
    display: 'flex',
    alignItems: 'center',
    paddingTop: '4px',
    paddingBottom: '4px',
  },
  '& .MuiDataGrid-row:hover': {
    cursor: 'pointer',
  },
};
