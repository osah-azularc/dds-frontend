import { Box, Skeleton } from '@mui/material';
import PropTypes from 'prop-types';

export const SKELETON_ROW_HEIGHT = 44;
const SKELETON_WIDTHS = ['32%', '48%', '62%', '40%', '55%'];
const FALLBACK_COLUMN_COUNT = 5;
const DEFAULT_ROW_COUNT = 10;

/** Skeleton loading overlay for the Rejected Form 1's DataGrid, mirroring the ePortal/ReviewForm1s pattern. */
const RejectedForm1sLoadingOverlay = ({ columns = [], rowCount = DEFAULT_ROW_COUNT }) => {
  const visibleColumns = columns.filter((column) => column.hide !== true);
  const overlayColumns =
    visibleColumns.length > 0
      ? visibleColumns
      : Array.from({ length: FALLBACK_COLUMN_COUNT }, (_, index) => ({
          field: `skeleton-${index}`,
        }));

  const columnTemplateParts = overlayColumns.map((column) => {
    if (typeof column.width === 'number') {
      return `${column.width}px`;
    }
    if (typeof column.flex === 'number') {
      const minWidth = typeof column.minWidth === 'number' ? column.minWidth : 120;
      return `minmax(${minWidth}px, ${Math.max(column.flex, 1)}fr)`;
    }
    const minWidth = typeof column.minWidth === 'number' ? column.minWidth : 120;
    return `minmax(${minWidth}px, 1fr)`;
  });

  const gridTemplateColumns = columnTemplateParts.join(' ');

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
          {overlayColumns.map((column, columnIndex) => {
            const isActionColumn = column.field === 'action';
            return (
              <Box
                key={column.field}
                sx={{
                  px: 1.5,
                  py: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isActionColumn ? 'flex-end' : 'flex-start',
                  minWidth: 0,
                }}
              >
                {isActionColumn ? (
                  <Skeleton variant="rounded" animation="wave" width={84} height={32} />
                ) : (
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
                )}
              </Box>
            );
          })}
        </Box>
      ))}
    </Box>
  );
};

RejectedForm1sLoadingOverlay.propTypes = {
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

export default RejectedForm1sLoadingOverlay;
