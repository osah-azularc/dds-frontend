import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Grid } from '@mui/material';
import { DataGridPro } from '@mui/x-data-grid-pro';
import AddIcon from '@mui/icons-material/Add';
import DeleteDialogue from '../../../../components/common/DeleteDialogue';
import NoRowsOverlay, { NO_ROWS_OVERLAY_SX } from '../../../../components/common/NoRowsOverlay';
import {
  deleteForm1Note,
  getForm1Notes,
  saveForm1Note,
} from '../../../../services/form1NotesService';
import { showErrorSnackbar, showSuccessSnackbar } from '../../../../utilities/ErrorSnackBar';
import AddNotesSummaryModal from './AddNotesSummaryModal';
import NotesTabColumns from './NotesTabColumns';

const DEFAULT_SORT = { field: 'date', sort: 'desc' };
const DEFAULT_PAGE_SIZE = 10;
const DATAGRID_SLOTS = { noRowsOverlay: NoRowsOverlay };
const NO_ROWS_OVERLAY_PROPS = { message: 'No records found.' };

const mapNoteRow = (row) => ({
  id: row.id,
  date: row.date || '-',
  summaryNotes: row.summaryNotes || '',
  updatedBy: row.updatedBy || '-',
});

/**
 * Notes/Summary table for the existing-docket review screen's Notes tab
 * (/form1/notes/reqdt/:form1Id). Server-side paginated/sortable DataGridPro,
 * matching this screen's own established table pattern (SearchResultsPageUI.jsx)
 * and ecourt-frontend's own Docket/NotesTab.jsx. Add Note is only enabled
 * while the docket is still Draft (actualStatus === 'pending'), matching
 * form1-notes.phtml's disableAddEditNote gate; Edit/Delete stay available
 * regardless, since this screen has no read-only "review" mode of its own.
 */
const NotesTable = ({ form1Id, canAddEdit, canManage }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 0,
    limit: DEFAULT_PAGE_SIZE,
    totalPages: 0,
  });
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: DEFAULT_PAGE_SIZE });
  const [sortModel, setSortModel] = useState([DEFAULT_SORT]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [saving, setSaving] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchNotes = useCallback(async () => {
    if (!form1Id) return;
    setLoading(true);
    const activeSort = sortModel[0] || DEFAULT_SORT;
    try {
      const response = await getForm1Notes(form1Id, {
        page: paginationModel.page,
        limit: paginationModel.pageSize,
        sortBy: activeSort.field,
        sortOrder: activeSort.sort,
      });
      setNotes((response.result || []).map(mapNoteRow));
      setPagination(
        response.pagination || {
          total: 0,
          page: 0,
          limit: paginationModel.pageSize,
          totalPages: 0,
        },
      );
    } catch (error) {
      showErrorSnackbar(error.response?.data?.error || 'Failed to load notes.');
    } finally {
      setLoading(false);
    }
  }, [form1Id, paginationModel, sortModel]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleSortModelChange = (newSortModel) => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
    setSortModel(newSortModel?.length ? newSortModel : [DEFAULT_SORT]);
  };

  const handleAddOpen = () => {
    setEditingNote(null);
    setModalOpen(true);
  };

  const handleEditOpen = (note) => {
    setEditingNote(note);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    if (saving) return;
    setModalOpen(false);
    setEditingNote(null);
  };

  const handleSave = async (summaryNotes) => {
    setSaving(true);
    try {
      await saveForm1Note(form1Id, editingNote?.id, summaryNotes);
      showSuccessSnackbar(
        editingNote ? 'Notes updated successfully.' : 'Notes added successfully.',
      );
      setModalOpen(false);
      setEditingNote(null);
      await fetchNotes();
    } catch (error) {
      showErrorSnackbar(
        error.response?.data?.error ||
          (editingNote
            ? 'Notes not updated, please try again.'
            : 'Notes not added, please try again.'),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!noteToDelete) return;
    setDeleting(true);
    try {
      await deleteForm1Note(noteToDelete.id);
      showSuccessSnackbar('Notes deleted successfully');
      await fetchNotes();
    } catch (error) {
      showErrorSnackbar(
        error.response?.data?.error || 'Something went wrong! Please try again later.',
      );
    } finally {
      setDeleting(false);
      setNoteToDelete(null);
    }
  };

  const columns = NotesTabColumns({
    onEditNoteOpen: handleEditOpen,
    onDeleteNoteOpen: setNoteToDelete,
    canManage,
  });

  return (
    <Box sx={{ backgroundColor: '#fff', p: 3 }}>
      <Grid container spacing={3}>
        {canAddEdit && (
          <Grid item xs={12} sm={6} md={3}>
            <Button color="primary" startIcon={<AddIcon />} fullWidth onClick={handleAddOpen}>
              Add Note/Summary
            </Button>
          </Grid>
        )}
        <Grid item xs={12}>
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
            sortingMode="server"
            sortModel={sortModel}
            onSortModelChange={handleSortModelChange}
            disableRowSelectionOnClick
            disableColumnMenu
            getRowHeight={() => 'auto'}
            slots={DATAGRID_SLOTS}
            slotProps={{ noRowsOverlay: NO_ROWS_OVERLAY_PROPS }}
            sx={NO_ROWS_OVERLAY_SX}
          />
        </Grid>
      </Grid>

      <AddNotesSummaryModal
        open={modalOpen}
        onClose={handleModalClose}
        onSave={handleSave}
        initialValue={editingNote?.summaryNotes || ''}
        isEditMode={Boolean(editingNote)}
        saving={saving}
      />

      <DeleteDialogue
        open={Boolean(noteToDelete)}
        onClose={() => setNoteToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete"
        message="Do you want to delete the notes?"
        confirmText={deleting ? 'Deleting…' : 'Delete'}
      />
    </Box>
  );
};

NotesTable.propTypes = {
  form1Id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  canAddEdit: PropTypes.bool,
  canManage: PropTypes.bool,
};

NotesTable.defaultProps = { canAddEdit: true, canManage: true };

export default React.memo(NotesTable);
