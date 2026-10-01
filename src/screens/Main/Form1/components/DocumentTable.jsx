import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { DataGridPro } from '@mui/x-data-grid-pro';
import NoRowsOverlay, { NO_ROWS_OVERLAY_SX } from '../../../../components/common/NoRowsOverlay';
import { downloadForm1Document } from '../../../../services/form1DocumentService';
import { showErrorSnackbar } from '../../../../utilities/ErrorSnackBar';
import { buildDocumentColumns } from './DocumentTableColumns';

const DATAGRID_SLOTS = { noRowsOverlay: NoRowsOverlay };
const NO_ROWS_OVERLAY_PROPS = { message: 'No records found.' };
const DOCUMENT_TABLE_HEIGHT = 300;

/**
 * Document & File Management table (Document/Name/Date/Description),
 * matching the legacy DDS portal's form1.phtml column layout and styled
 * like ecourt-frontend's own DocumentGridTable.jsx (DataGridPro, shared
 * NoRowsOverlay empty state -- see that component's own docblock for why a
 * plain `localeText.noRowsLabel` string doesn't reliably show with zero
 * rows). `documents` comes from dds-backend's /docketDetail/documents (see
 * form1DocumentService.js/useForm1New.js), scoped to this Form 1's own
 * caseId/Docket_caseid.
 *
 * Fixed height with internal scroll (`autoHeight={false}`) -- a growing
 * panel pushed Party Information further down the page on cases with many
 * documents, so this caps it and scrolls instead, the same fixed-height +
 * internal-scroll pattern SearchResultsPageUI.jsx already uses for its own
 * DataGridPro. theme.js sets `autoHeight: true` as an app-wide MuiDataGrid
 * default prop, so it has to be overridden here explicitly -- merely
 * omitting the `autoHeight` prop still lets the theme default apply.
 *
 * Sealed/archived icons and Download/View actions (DocumentTableColumns.jsx)
 * port legacy's sudocket.phtml document row -- View opens the backend's
 * resolved path/signed-URL in a new tab (prefixed with this app's own
 * origin, matching ecourt-frontend's useDocketDetailDocumentApi.js exactly,
 * including its same latent gap for alt-storage signed URLs, which are
 * already absolute); Download streams/saves the file via
 * downloadForm1Document's blob handling.
 */
const DocumentTable = ({ documents }) => {
  const handleDownload = useCallback(async (documentId) => {
    const result = await downloadForm1Document(documentId, true);
    if (!result.success) {
      showErrorSnackbar(result.error || 'Error processing document');
    }
  }, []);

  const handleView = useCallback(async (documentId) => {
    const result = await downloadForm1Document(documentId, false);
    if (result.success && result.data && result.data !== '0') {
      window.open(`${window.location.origin}${result.data}`, '_blank', 'noopener');
      return;
    }
    showErrorSnackbar(result.error || 'File Does Not Exist!');
  }, []);

  const columns = useMemo(
    () => buildDocumentColumns({ rows: documents, onDownload: handleDownload, onView: handleView }),
    [documents, handleDownload, handleView],
  );

  return (
    <Box sx={{ mt: 1, height: DOCUMENT_TABLE_HEIGHT }}>
      <DataGridPro
        autoHeight={false}
        rows={documents}
        columns={columns}
        getRowId={(row) => row.documentId}
        hideFooter
        disableColumnMenu
        disableRowSelectionOnClick
        slots={DATAGRID_SLOTS}
        slotProps={{ noRowsOverlay: NO_ROWS_OVERLAY_PROPS }}
        sx={{
          ...NO_ROWS_OVERLAY_SX,
          height: '100%',
          '& .MuiDataGrid-cell': { fontSize: '0.875rem' },
          '& .MuiDataGrid-virtualScroller': { overflowY: 'auto' },
        }}
      />
    </Box>
  );
};

DocumentTable.propTypes = {
  documents: PropTypes.arrayOf(
    PropTypes.shape({
      documentId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      documentType: PropTypes.string,
      documentName: PropTypes.string,
      dateRequested: PropTypes.string,
      description: PropTypes.string,
      isSealed: PropTypes.string,
      docArchived: PropTypes.string,
      documentNameInAwsBucket: PropTypes.string,
    }),
  ),
};

DocumentTable.defaultProps = {
  documents: [],
};

export default React.memo(DocumentTable);
