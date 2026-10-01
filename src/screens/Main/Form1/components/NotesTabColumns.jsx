import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

/**
 * DataGridPro columns for the Notes tab (Date/Notes-Summary/Updated By +
 * Edit/Delete actions), matching the legacy DDS portal's form1-notes.phtml
 * table layout. Ported from ecourt-frontend's own NotesTabColumns.jsx.
 *
 * `canManage` hides both action icons for viewers without notes-manage
 * capability (see utilities/form1Capabilities.js) -- independent of
 * NotesTable's own status-driven `canAddEdit` gate on the "Add" button.
 */
const NotesTabColumns = ({ onEditNoteOpen, onDeleteNoteOpen, canManage }) =>
  [
    { field: 'date', headerName: 'Date', width: 150 },
    {
      field: 'summaryNotes',
      headerName: 'Notes/Summary',
      flex: 1,
      minWidth: 320,
      renderCell: ({ value }) => (
        <Box sx={{ py: 1, whiteSpace: 'normal', overflowWrap: 'anywhere' }}>
          <Typography variant="body2">{value || '-'}</Typography>
        </Box>
      ),
    },
    { field: 'updatedBy', headerName: 'Updated By', width: 160 },
    canManage && {
      field: 'edit',
      headerName: ' ',
      sortable: false,
      width: 44,
      align: 'center',
      headerAlign: 'center',
      cellClassName: 'icon-action-cell',
      renderCell: ({ row }) => (
        <IconButton onClick={() => onEditNoteOpen(row)} size="small" title="Edit Note">
          <EditIcon fontSize="small" />
        </IconButton>
      ),
    },
    canManage && {
      field: 'delete',
      headerName: ' ',
      sortable: false,
      width: 44,
      align: 'center',
      headerAlign: 'center',
      cellClassName: 'icon-action-cell',
      renderCell: ({ row }) => (
        <IconButton onClick={() => onDeleteNoteOpen(row)} size="small" title="Delete Note">
          <DeleteIcon fontSize="small" />
        </IconButton>
      ),
    },
  ].filter(Boolean);

export default NotesTabColumns;
