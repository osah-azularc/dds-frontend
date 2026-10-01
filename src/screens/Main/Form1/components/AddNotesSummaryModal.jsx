import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from '@mui/material';

const MAX_NOTES_LENGTH = 5000;
const FIELD_SX = { '& .MuiOutlinedInput-root': { backgroundColor: '#fff' } };

/**
 * Add/Edit Notes-Summary modal for the Notes tab -- one dialog for both
 * (title/save label swap via isEditMode), matching how AddPartyModal.jsx
 * already doubles as its own Add/Edit dialog. Ported from
 * ecourt-frontend's own Dailog/AddNotesSummaryModal.jsx.
 */
const AddNotesSummaryModal = ({ open, onClose, onSave, initialValue, isEditMode, saving }) => {
  const [summaryNotes, setSummaryNotes] = useState('');
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    if (!open) return;
    setSummaryNotes(initialValue);
    setErrorText('');
  }, [initialValue, open]);

  const handleClose = () => {
    if (saving) return;
    onClose();
  };

  const handleSave = () => {
    const trimmed = summaryNotes.trim();
    if (!trimmed) {
      setErrorText('Notes/Summary is required.');
      return;
    }
    onSave(trimmed);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Typography variant="h2">
          {isEditMode ? 'Edit Notes/Summary' : 'Add Notes/Summary'}
        </Typography>
      </DialogTitle>
      <DialogContent>
        {/* mt: Grid's own negative top margin (from spacing) otherwise leaves no room above
            Notes/Summary's floating label, clipping it against DialogTitle -- same fix as
            AddPartyModal.jsx's Contact Type field. */}
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12}>
            <TextField
              label="Notes/Summary"
              fullWidth
              multiline
              minRows={5}
              value={summaryNotes}
              onChange={(e) => {
                setSummaryNotes(e.target.value.slice(0, MAX_NOTES_LENGTH));
                if (errorText) setErrorText('');
              }}
              inputProps={{ maxLength: MAX_NOTES_LENGTH }}
              error={Boolean(errorText)}
              helperText={errorText}
              sx={FIELD_SX}
            />
            <Typography
              variant="caption"
              color={summaryNotes.length >= MAX_NOTES_LENGTH ? 'error' : 'text.secondary'}
              sx={{ display: 'block', textAlign: 'right', mt: 1 }}
            >
              {summaryNotes.length}/{MAX_NOTES_LENGTH}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Grid container spacing={2} justifyContent="center" sx={{ pb: 2 }}>
          <Grid item xs={12} sm={4}>
            <Button fullWidth color="secondary" onClick={handleClose} disabled={saving}>
              Cancel
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button fullWidth onClick={handleSave} disabled={saving}>
              {saving ? <CircularProgress size={18} color="inherit" /> : 'Save'}
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

AddNotesSummaryModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  initialValue: PropTypes.string,
  isEditMode: PropTypes.bool,
  saving: PropTypes.bool,
};

AddNotesSummaryModal.defaultProps = {
  initialValue: '',
  isEditMode: false,
  saving: false,
};

export default React.memo(AddNotesSummaryModal);
