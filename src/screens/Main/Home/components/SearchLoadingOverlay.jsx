import { Box, Skeleton } from '@mui/material';
import PropTypes from 'prop-types';

const SKELETON_ROW_HEIGHT = 44;
const SKELETON_WIDTHS = ['32%', '48%', '62%', '40%', '55%'];
const FALLBACK_COLUMN_COUNT = 5;
const DEFAULT_ROW_COUNT = 10;

/**
 * Skeleton loading overlay matching the DataGrid's column layout, so the
 * skeleton rows line up with the real rows once they load. Ported from
 * ecourt-frontend's Home/components/SearchLoadingOverlay.jsx (checkbox-column
 * support dropped — DDS's search results grid has no row selection).
 */
const SearchLoadingOverlay = ({ columns = [], rowCount = DEFAULT_ROW_COUNT }) => {
  const visibleColumns = columns.filter((column) => column.hide !== true);
  const overlayColumns =
    visibleColumns.length > 0
      ? visibleColumns
      : Array.from({ length: FALLBACK_COLUMN_COUNT }, (_, index) => ({
          field: `skeleton-${index}`,
        }));

  const gridTemplateColumns = overlayColumns
    .map((column) => {
      if (typeof column.width === 'number') {
        return `${column.width}px`;
      }
      if (typeof column.flex === 'number') {
        const minWidth = typeof column.minWidth === 'number' ? column.minWidth : 120;
        return `minmax(${minWidth}px, ${Math.max(column.flex, 1)}fr)`;
      }
      const minWidth = typeof column.minWidth === 'number' ? column.minWidth : 120;
      return `minmax(${minWidth}px, 1fr)`;
    })
    .join(' ');

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        minHeight: rowCount * SKELETON_ROW_HEIGHT,
        alignSelf: 'stretch',
        backgroundColor: 'background.paper',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {Array.from({ length: rowCount }, (_, rowIndex) => (
        <Box
          key={`loading-row-${rowIndex}`}
          sx={{
            display: 'grid',
            gridTemplateColumns,
            minWidth: '100%',
            flex: '0 0 auto',
            height: SKELETON_ROW_HEIGHT,
          }}
        >
          {overlayColumns.map((column, columnIndex) => (
            <Box
              key={column.field}
              sx={{
                px: 1.5,
                py: 0.5,
                display: 'flex',
                alignItems: 'center',
                minWidth: 0,
              }}
            >
              <Skeleton
                variant="text"
                animation="wave"
                sx={{
                  width: SKELETON_WIDTHS[(rowIndex + columnIndex) % SKELETON_WIDTHS.length],
                  maxWidth: '100%',
                  fontSize: '0.5rem',
                  transform: 'none',
                }}
              />
            </Box>
          ))}
        </Box>
      ))}
      <Box sx={{ flex: '1 1 auto' }} />
    </Box>
  );
};

SearchLoadingOverlay.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      hide: PropTypes.bool,
      width: PropTypes.number,
      minWidth: PropTypes.number,
      flex: PropTypes.number,
    }),
  ),
  rowCount: PropTypes.number,
};

export default SearchLoadingOverlay;
