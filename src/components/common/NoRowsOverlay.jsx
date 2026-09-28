import React from 'react';
import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Shared "no rows" overlay for every DataGridPro table in this app
 * (`slots={{ noRowsOverlay: NoRowsOverlay }}`) -- a plain `localeText.
 * noRowsLabel` string doesn't reliably show when the grid has zero rows
 * (MuiDataGrid-overlayWrapper collapses to ~0px), so every table should use
 * this custom overlay instead, merging NO_ROWS_OVERLAY_SX into its own `sx`
 * prop to give that wrapper a guaranteed minimum height to render into (see
 * NotesTable.jsx/HistoryTable.jsx for the plain-`autoHeight` pattern, or
 * SearchResultsPageUI.jsx for a fixed-height, always-scrolling table).
 * `message` is customizable per table.
 */
const NoRowsOverlay = ({ message }) => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
    <Typography variant="body2" color="text.secondary">
      {message}
    </Typography>
  </Box>
);

NoRowsOverlay.propTypes = {
  message: PropTypes.string,
};

NoRowsOverlay.defaultProps = {
  message: 'No records found.',
};

// Merge into a DataGridPro's own `sx` prop alongside `slots={{ noRowsOverlay: NoRowsOverlay }}`.
// Only affects the empty-state overlay -- has no effect on row/footer layout when rows exist,
// so it's safe to combine with either `autoHeight` or a fixed-height container.
export const NO_ROWS_OVERLAY_SX = {
  '& .MuiDataGrid-overlayWrapper, & .MuiDataGrid-overlayWrapperInner': {
    minHeight: '150px',
  },
};

export default NoRowsOverlay;
