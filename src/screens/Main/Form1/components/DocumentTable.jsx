import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { DataGridPro } from '@mui/x-data-grid-pro';
import NoRowsOverlay, { NO_ROWS_OVERLAY_SX } from '../../../../components/common/NoRowsOverlay';

const COLUMNS = [
  { field: 'documentType', headerName: 'Document', flex: 1, minWidth: 130 },
  { field: 'documentName', headerName: 'Name', flex: 1.4, minWidth: 160 },
  { field: 'dateRequested', headerName: 'Date', flex: 1, minWidth: 120 },
  { field: 'description', headerName: 'Description', flex: 1.4, minWidth: 160 },
];

const DATAGRID_SLOTS = { noRowsOverlay: NoRowsOverlay };
const NO_ROWS_OVERLAY_PROPS = { message: 'No records found.' };

/**
 * Document & File Management table (Document/Name/Date/Description),
 * matching the legacy DDS portal's form1.phtml column layout and styled
 * like ecourt-frontend's own DocumentGridTable.jsx (DataGridPro, shared
 * NoRowsOverlay empty state -- see that component's own docblock for why a
 * plain `localeText.noRowsLabel` string doesn't reliably show with zero
 * rows). `documents` comes from dds-backend's /docketDetail/documents (see
 * form1DocumentService.js/useForm1New.js), scoped to this Form 1's own
 * caseId/Docket_caseid.
 */
const DocumentTable = ({ documents }) => (
  <Box sx={{ mt: 1 }}>
    <DataGridPro
      autoHeight
      rows={documents}
      columns={COLUMNS}
      getRowId={(row) => row.documentId}
      hideFooter
      disableColumnMenu
      disableRowSelectionOnClick
      slots={DATAGRID_SLOTS}
      slotProps={{ noRowsOverlay: NO_ROWS_OVERLAY_PROPS }}
      sx={{ ...NO_ROWS_OVERLAY_SX, '& .MuiDataGrid-cell': { fontSize: '0.875rem' } }}
    />
  </Box>
);

DocumentTable.propTypes = {
  documents: PropTypes.arrayOf(
    PropTypes.shape({
      documentId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      documentType: PropTypes.string,
      documentName: PropTypes.string,
      dateRequested: PropTypes.string,
      description: PropTypes.string,
    }),
  ),
};

DocumentTable.defaultProps = {
  documents: [],
};

export default React.memo(DocumentTable);
