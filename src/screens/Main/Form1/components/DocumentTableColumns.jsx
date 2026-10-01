import { IconButton, Tooltip } from '@mui/material';
import ArchiveIcon from '@mui/icons-material/Archive';
import DownloadIcon from '@mui/icons-material/Download';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';

const isTruthyFlag = (value) => String(value ?? '') === '1';
const hasAltStorageDoc = (value) => {
  const normalized = String(value ?? '').trim();
  return normalized !== '' && normalized.toLowerCase() !== 'undefined';
};

const ICON_COLUMN_PROPS = {
  sortable: false,
  headerName: ' ',
  headerAlign: 'center',
  align: 'center',
  width: 36,
};

/**
 * Document & File Management column set -- ports legacy's sudocket.phtml/
 * docket.phtml document row markup (form1.phtml's own table never got these
 * icons, so sudocket.phtml -- the DDS superuser docket view -- is the
 * source of truth, confirmed against production). A seal/lock column and an
 * archived column are each only added when at least one row needs it
 * (mirrors ecourt-frontend's own DocumentGridColumns.jsx), and the
 * Download/View action icons are gated on the exact same is_sealed/
 * docArchived conditions as sudocketcontroller.js's `checkDoc` markup: a
 * sealed OR archived document loses both actions outright (empty cell,
 * matching legacy's own empty `<td>` for that case); a document in
 * alternative (>250MB) S3 storage (`document_name_in_aws_bucket` populated)
 * that's neither sealed nor archived keeps Download but shows a disabled
 * "Unable to view" eye instead of View, matching legacy's
 * `large-doc-view-eye` row.
 */
export const buildDocumentColumns = ({ rows, onDownload, onView }) => {
  const showSealedColumn = rows.some((row) => isTruthyFlag(row?.isSealed));
  const showArchivedColumn = rows.some((row) => isTruthyFlag(row?.docArchived));

  return [
    { field: 'documentType', headerName: 'Document', flex: 1, minWidth: 130 },
    ...(showSealedColumn
      ? [
          {
            field: 'sealed',
            ...ICON_COLUMN_PROPS,
            renderCell: ({ row }) =>
              isTruthyFlag(row.isSealed) ? (
                <Tooltip title="This document is under seal." placement="top" arrow>
                  <LockIcon color="secondary" sx={{ fontSize: '16px' }} />
                </Tooltip>
              ) : null,
          },
        ]
      : []),
    ...(showArchivedColumn
      ? [
          {
            field: 'archived',
            ...ICON_COLUMN_PROPS,
            renderCell: ({ row }) =>
              isTruthyFlag(row.docArchived) ? (
                <Tooltip
                  title="This record has been archived. Please contact the clerk's office at 404-657-2800."
                  placement="top"
                  arrow
                >
                  <ArchiveIcon color="secondary" sx={{ fontSize: '16px' }} />
                </Tooltip>
              ) : null,
          },
        ]
      : []),
    { field: 'documentName', headerName: 'Name', flex: 1.4, minWidth: 160 },
    { field: 'dateRequested', headerName: 'Date', flex: 1, minWidth: 120 },
    { field: 'description', headerName: 'Description', flex: 1.4, minWidth: 160 },
    {
      field: 'download',
      ...ICON_COLUMN_PROPS,
      renderCell: ({ row }) => {
        if (isTruthyFlag(row.isSealed) || isTruthyFlag(row.docArchived)) return null;
        return (
          <IconButton
            size="small"
            onClick={() => onDownload(row.documentId)}
            title="Download Document"
          >
            <DownloadIcon fontSize="small" />
          </IconButton>
        );
      },
    },
    {
      field: 'view',
      ...ICON_COLUMN_PROPS,
      renderCell: ({ row }) => {
        if (isTruthyFlag(row.isSealed) || isTruthyFlag(row.docArchived)) return null;
        if (hasAltStorageDoc(row.documentNameInAwsBucket)) {
          return (
            <Tooltip title="Unable to view" placement="top" arrow>
              <span>
                <IconButton size="small" disabled>
                  <VisibilityIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          );
        }
        return (
          <IconButton size="small" onClick={() => onView(row.documentId)} title="View Document">
            <VisibilityIcon fontSize="small" />
          </IconButton>
        );
      },
    },
  ];
};
