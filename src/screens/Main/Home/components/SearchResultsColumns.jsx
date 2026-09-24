import { Box, Chip } from '@mui/material';

// DataGrid only sets a native `title` tooltip on cells that don't define a custom renderCell
// (see GridCell.js) - use this for plain text columns so that default hover tooltip never shows.
const renderPlainCell = (params) => params.formattedValue ?? params.value;

/**
 * Get column definitions for the DDS search results DataGrid.
 * @param {Object} theme - MUI theme object
 * @returns {Array} Column definitions
 */
export const getSearchResultsColumns = (theme) => [
  {
    field: 'docket',
    headerName: 'Docket',
    flex: 1,
    minWidth: 130,
    // Styled to look like a link - the whole row is clickable (see
    // SearchResultsPage's onRowClick), so this isn't its own <a>/<Link>.
    renderCell: (params) => (
      <Box component="span" sx={{ color: theme.palette.primary.main, textDecoration: 'underline' }}>
        {params.value}
      </Box>
    ),
  },
  {
    field: 'caseName',
    headerName: 'Case Name',
    flex: 1.5,
    minWidth: 180,
    renderCell: renderPlainCell,
  },
  {
    field: 'caseType',
    headerName: 'Case Type',
    flex: 1.1,
    minWidth: 140,
    renderCell: renderPlainCell,
  },
  {
    field: 'dateReceived',
    headerName: 'Date Received',
    flex: 1.2,
    minWidth: 150,
    renderCell: renderPlainCell,
  },
  {
    field: 'hearingDate',
    headerName: 'Hearing Date',
    flex: 1.2,
    minWidth: 150,
    renderCell: renderPlainCell,
  },
  {
    field: 'hearingTime',
    headerName: 'Hearing Time',
    flex: 1.2,
    minWidth: 150,
    renderCell: renderPlainCell,
  },
  {
    field: 'hearingLocation',
    headerName: 'Hearing Location',
    flex: 1.4,
    minWidth: 180,
    renderCell: renderPlainCell,
  },
  {
    field: 'status',
    headerName: 'Status',
    flex: 1.1,
    minWidth: 160,
    renderCell: (params) =>
      params.value ? (
        <Chip
          size="small"
          label={params.value}
          sx={{
            backgroundColor: '#757575',
            color: '#fff',
            fontWeight: 600,
            fontSize: '0.75rem',
          }}
        />
      ) : (
        ''
      ),
  },
  {
    field: 'judge',
    headerName: 'Judge',
    flex: 1.2,
    minWidth: 150,
    renderCell: renderPlainCell,
  },
];
