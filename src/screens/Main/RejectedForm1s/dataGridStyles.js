/**
 * Shared DataGrid styles for the Rejected Form 1's list.
 * Mirrors the Reports/ReviewForm1s DataGridPro styling used elsewhere in the OSAH apps
 * so text truncation, scrolling and hover behavior stay consistent.
 */
export const REJECTED_FORM1S_DATAGRID_STYLES = {
  width: '100%',
  minWidth: 0,
  '--DataGrid-overlayHeight': 'auto',
  boxSizing: 'border-box',
  border: '1px solid #dfe3e8',
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
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: '#ECEFF1',
  },
  '& .MuiDataGrid-columnHeaderTitle': {
    fontWeight: 600,
  },
  '& .MuiDataGrid-cell, & .MuiDataGrid-columnHeader': {
    minWidth: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  '& .MuiDataGrid-cell': {
    display: 'flex',
    alignItems: 'center',
    paddingTop: '8px',
    paddingBottom: '8px',
  },
  '& .MuiDataGrid-cellContent': {
    display: 'block',
    maxWidth: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
};

export const SKELETON_MIN_DURATION_MS = 1000;
