import { Box, Chip, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { renderCellWithTooltip } from '../../../../components/common/CellWithTooltip';

/**
 * Column definitions for the Docket Search results grid.
 * Ported from ecourt-frontend's Home/components/SearchResultsColumns.jsx —
 * the docket link uses the plain caseId (not base64-encoded) to match the
 * `/docket/:docketNo` convention DocketSearch.jsx already uses in this app.
 *
 * @param {Object} theme - MUI theme object
 * @param {Function} onDocketClick - handleRowClick from useSearchResultsState.js; used for the
 *   dds_superuser case, where a row's `docket` (eCourt case id) has no form1Id to link to
 *   directly yet and must be resolved first (see that hook's own comment).
 * @returns {Array} Column definitions
 */
export const getSearchResultsColumns = (theme, onDocketClick) => [
  {
    field: 'docket',
    headerName: 'Docket',
    flex: 1,
    minWidth: 100,
    renderCell: (params) => {
      const { form1Id } = params.row;
      const linkSx = {
        color: theme.palette.primary.main,
        textDecoration: 'underline',
        cursor: 'pointer',
        '&:hover': {
          textDecoration: 'underline',
          color: theme.palette.primary.dark,
        },
      };

      if (form1Id) {
        return (
          <Link component={RouterLink} to={`/form1/reqdt/${form1Id}`} sx={linkSx}>
            {params.value}
          </Link>
        );
      }

      if (!params.value || params.value === '...') {
        return params.value || '';
      }

      return (
        <Box
          component="button"
          type="button"
          onClick={() => onDocketClick(params.row)}
          sx={{
            ...linkSx,
            // Reset native <button> chrome -- a plain <button> (not MUI's Link, which
            // eslint-plugin-jsx-a11y's anchor-is-valid rule flags regardless of `component`)
            // so it needs its own background/border/font reset to read as a link.
            background: 'none',
            border: 'none',
            padding: 0,
            font: 'inherit',
          }}
        >
          {params.value}
        </Box>
      );
    },
  },
  {
    field: 'caseName',
    headerName: 'Case Name',
    flex: 1.5,
    minWidth: 160,
    renderCell: renderCellWithTooltip,
  },
  {
    field: 'caseType',
    headerName: 'Case Type',
    flex: 1.1,
    minWidth: 110,
    renderCell: renderCellWithTooltip,
  },
  {
    field: 'dateReceived',
    headerName: 'Date Received',
    flex: 1.2,
    minWidth: 100,
    renderCell: renderCellWithTooltip,
  },
  {
    field: 'dateRequested',
    headerName: 'Date Requested',
    flex: 1.3,
    minWidth: 100,
    renderCell: renderCellWithTooltip,
  },
  {
    field: 'hearingDate',
    headerName: 'Hearing Date',
    flex: 1.2,
    minWidth: 100,
    renderCell: renderCellWithTooltip,
  },
  {
    field: 'hearingTime',
    headerName: 'Hearing Time',
    flex: 1.2,
    minWidth: 90,
    renderCell: renderCellWithTooltip,
  },
  {
    field: 'hearingLocation',
    headerName: 'Hearing Location',
    flex: 1.4,
    minWidth: 150,
    renderCell: renderCellWithTooltip,
  },
  {
    field: 'county',
    headerName: 'County',
    flex: 1,
    minWidth: 90,
    renderCell: renderCellWithTooltip,
  },
  {
    field: 'status',
    headerName: 'Status',
    flex: 1.1,
    minWidth: 140,
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
    minWidth: 120,
    renderCell: renderCellWithTooltip,
  },
];
