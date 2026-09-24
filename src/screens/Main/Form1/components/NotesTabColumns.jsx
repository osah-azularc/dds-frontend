import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, IconButton, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const NotesTabColumns = ({ onEditNoteOpen, onDeleteNoteOpen }) => [
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
  {
    field: 'updatedBy',
    headerName: 'Updated By',
    width: 160,
  },
  {
    field: 'edit',
    headerName: ' ',
    sortable: false,
    width: 44,
    align: 'center',
    headerAlign: 'center',
    renderCell: ({ row }) => (
      <IconButton onClick={() => onEditNoteOpen(row)} size="small" title="Edit Note">
        <EditIcon fontSize="small" />
      </IconButton>
    ),
  },
  {
    field: 'delete',
    headerName: ' ',
    sortable: false,
    width: 44,
    align: 'center',
    headerAlign: 'center',
    renderCell: ({ row }) => (
      <IconButton onClick={() => onDeleteNoteOpen(row)} size="small" title="Delete Note">
        <DeleteIcon fontSize="small" />
      </IconButton>
    ),
  },
];

NotesTabColumns.propTypes = {
  onEditNoteOpen: PropTypes.func.isRequired,
  onDeleteNoteOpen: PropTypes.func.isRequired,
};

export default NotesTabColumns;
