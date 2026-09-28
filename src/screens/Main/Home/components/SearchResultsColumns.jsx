import { Chip, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { renderCellWithTooltip } from '../../../../components/common/CellWithTooltip';

/**
 * Column definitions for the Docket Search results grid.
 * Ported from ecourt-frontend's Home/components/SearchResultsColumns.jsx —
 * the docket link uses the plain caseId (not base64-encoded) to match the
 * `/docket/:docketNo` convention DocketSearch.jsx already uses in this app.
 *
 * @param {Object} theme - MUI theme object
 * @returns {Array} Column definitions
 */
export const getSearchResultsColumns = (theme) => [
  {
    field: 'docket',
    headerName: 'Docket',
    flex: 1,
    minWidth: 130,
    renderCell: (params) => {
      const { form1Id } = params.row;
      if (!form1Id) {
        return params.value || '';
      }

      return (
        <Link
          component={RouterLink}
          to={`/form1/reqdt/${form1Id}`}
          sx={{
            color: theme.palette.primary.main,
            textDecoration: 'underline',
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
              color: theme.palette.primary.dark,
            },
          }}
        >
          {params.value}
        </Link>
      );
    },
  },
  {
    field: 'caseName',
    headerName: 'Case Name',
    flex: 1.5,
    minWidth: 180,
    renderCell: renderCellWithTooltip,
  },
  {
    field: 'caseType',
    headerName: 'Case Type',
    flex: 1.1,
    minWidth: 140,
    renderCell: renderCellWithTooltip,
  },
  {
    field: 'dateReceived',
    headerName: 'Date Received',
    flex: 1.2,
    minWidth: 150,
    renderCell: renderCellWithTooltip,
  },
  {
    field: 'dateRequested',
    headerName: 'Date Requested',
    flex: 1.3,
    minWidth: 170,
    renderCell: renderCellWithTooltip,
  },
  {
    field: 'hearingDate',
    headerName: 'Hearing Date',
    flex: 1.2,
    minWidth: 150,
    renderCell: renderCellWithTooltip,
  },
  {
    field: 'hearingTime',
    headerName: 'Hearing Time',
    flex: 1.2,
    minWidth: 160,
    renderCell: renderCellWithTooltip,
  },
  {
    field: 'hearingLocation',
    headerName: 'Hearing Location',
    flex: 1.4,
    minWidth: 180,
    renderCell: renderCellWithTooltip,
  },
  {
    field: 'county',
    headerName: 'County',
    flex: 1,
    minWidth: 130,
    renderCell: renderCellWithTooltip,
  },
  {
    field: 'status',
    headerName: 'Status',
    flex: 1.1,
    minWidth: 200,
    renderCell: (params) => (
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
    ),
  },
  {
    field: 'judge',
    headerName: 'Judge',
    flex: 1.2,
    minWidth: 150,
    renderCell: renderCellWithTooltip,
  },
];
