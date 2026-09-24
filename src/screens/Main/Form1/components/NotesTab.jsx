import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Grid } from '@mui/material';
import { DataGridPro } from '@mui/x-data-grid-pro';
import PropTypes from 'prop-types';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { SnackbarContext } from '../../../../context/snackbarContext';
import DeleteDialogue from '../../../../components/dialogue/DeleteDialogue';
import {
  addDocketNote,
  deleteDocketNote,
  getDocketNotes,
  updateDocketNote,
} from '../../../../services/api/docketNotesService';
import { mapNotesResponseToRows } from '../notesTabUtils';
import AddNotesSummaryModal from './AddNotesSummaryModal';
import NotesTabColumns from './NotesTabColumns';

const DEFAULT_NOTES_PAGE_SIZE = 10;

const getDefaultNotesPagination = (limit = DEFAULT_NOTES_PAGE_SIZE) => ({
  total: 0,
  page: 0,
  limit,
  totalPages: 0,
});

const NotesTab = ({ caseId }) => {
  const openSnackbar = useContext(SnackbarContext);
  const normalizedCaseId = String(caseId ?? '').trim();
  const previousCaseIdRef = useRef(normalizedCaseId);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isNotesModalOpen, setNotesModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [activeNote, setActiveNote] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: DEFAULT_NOTES_PAGE_SIZE,
  });
  const [pagination, setPagination] = useState(getDefaultNotesPagination(DEFAULT_NOTES_PAGE_SIZE));

  const fetchNotes = useCallback(async () => {
    if (!normalizedCaseId) {
      previousCaseIdRef.current = normalizedCaseId;
      setNotes([]);
      setPagination(getDefaultNotesPagination(paginationModel.pageSize));
      return;
    }

    if (previousCaseIdRef.current !== normalizedCaseId) {
      previousCaseIdRef.current = normalizedCaseId;
      setNotes([]);
      setPaginationModel((previous) => ({ page: 0, pageSize: previous.pageSize }));
      setPagination((previous) => getDefaultNotesPagination(previous.limit));
      return;
    }

    setLoading(true);
    const result = await getDocketNotes(normalizedCaseId, {
      page: paginationModel.page,
      limit: paginationModel.pageSize,
    });

    if (result.success) {
      setNotes(mapNotesResponseToRows(result.data, normalizedCaseId));
      setPagination(result.pagination || getDefaultNotesPagination(paginationModel.pageSize));
    } else {
      setNotes([]);
      setPagination(getDefaultNotesPagination(paginationModel.pageSize));
      openSnackbar?.(result.error || result.message || 'Failed to load notes', 'error');
    }

    setLoading(false);
  }, [normalizedCaseId, openSnackbar, paginationModel.page, paginationModel.pageSize]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleModalClose = useCallback(() => {
    if (saving) return;
    setNotesModalOpen(false);
    setActiveNote(null);
    setModalMode('add');
  }, [saving]);

  const handleDeleteDialogClose = useCallback(() => {
    if (deleteLoading) return;
    setDeleteDialogOpen(false);
    setActiveNote(null);
  }, [deleteLoading]);

  const handleAddNoteOpen = useCallback(() => {
    setModalMode('add');
    setActiveNote(null);
    setNotesModalOpen(true);
  }, []);

  const handleEditNoteOpen = useCallback((note) => {
    setModalMode('edit');
    setActiveNote(note);
    setNotesModalOpen(true);
  }, []);

  const handleDeleteNoteOpen = useCallback((note) => {
    setActiveNote(note);
    setDeleteDialogOpen(true);
  }, []);

  const columns = useMemo(
    () =>
      NotesTabColumns({
        onEditNoteOpen: handleEditNoteOpen,
        onDeleteNoteOpen: handleDeleteNoteOpen,
      }),
    [handleDeleteNoteOpen, handleEditNoteOpen],
  );

  const handleSaveNote = useCallback(
    async (summaryNotes) => {
      if (!normalizedCaseId) return false;

      setSaving(true);
      try {
        const result =
          modalMode === 'edit' && activeNote
            ? await updateDocketNote(activeNote.noteId, summaryNotes)
            : await addDocketNote(normalizedCaseId, summaryNotes);

        if (!result.success) {
          openSnackbar?.(
            result.error ||
              result.message ||
              (modalMode === 'edit'
                ? 'Notes not updated, please try again.'
                : 'Notes not added, please try again.'),
            'error',
          );
          return false;
        }

        await fetchNotes();
        openSnackbar?.(
          modalMode === 'edit' ? 'Notes updated successfully.' : 'Notes added successfully.',
          'success',
        );
        return true;
      } finally {
        setSaving(false);
      }
    },
    [activeNote, fetchNotes, modalMode, normalizedCaseId, openSnackbar],
  );

  const handleDeleteConfirm = useCallback(async () => {
    const noteToDelete = activeNote;
    if (!noteToDelete || !normalizedCaseId) return;

    setDeleteLoading(true);
    try {
      const result = await deleteDocketNote(noteToDelete.noteId);

      if (!result.success) {
        openSnackbar?.(result.error || result.message || 'Failed to delete note', 'error');
        return;
      }

      await fetchNotes();
      openSnackbar?.('Notes deleted successfully', 'success');
    } finally {
      setDeleteLoading(false);
      setActiveNote(null);
    }
  }, [activeNote, fetchNotes, normalizedCaseId, openSnackbar]);

  return (
    <Grid container direction="column">
      <Grid item xs={12} sx={{ p: 3, minWidth: 0 }}>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={handleAddNoteOpen}
            disabled={!normalizedCaseId || loading || saving}
          >
            Add Note/Summary
          </Button>
        </Box>
        <Box>
          <DataGridPro
            autoHeight
            rows={notes}
            columns={columns}
            loading={loading}
            pagination
            paginationMode="server"
            rowCount={pagination.total}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 25, 50, 100]}
            disableRowSelectionOnClick
            disableColumnMenu
            disableColumnSorting
            getRowHeight={() => 'auto'}
            localeText={{
              noRowsLabel: normalizedCaseId ? 'No Results Found.' : 'No docket selected',
            }}
            slotProps={{ loadingOverlay: { variant: 'skeleton', noRowsVariant: 'skeleton' } }}
          />
        </Box>
      </Grid>

      <AddNotesSummaryModal
        open={isNotesModalOpen}
        onClose={handleModalClose}
        onSave={handleSaveNote}
        initialValue={activeNote?.summaryNotes || ''}
        title={modalMode === 'edit' ? 'Update Notes/Summary' : 'Add Notes/Summary'}
        saveLabel={modalMode === 'edit' ? 'Update' : 'Save'}
        loading={saving}
      />
      <DeleteDialogue
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        onConfirm={handleDeleteConfirm}
        title="Delete"
        message="Do you want to delete the notes?"
        confirmText={deleteLoading ? 'Deleting...' : 'Delete'}
      />
    </Grid>
  );
};

NotesTab.propTypes = {
  caseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

NotesTab.defaultProps = {
  caseId: null,
};

export default NotesTab;
