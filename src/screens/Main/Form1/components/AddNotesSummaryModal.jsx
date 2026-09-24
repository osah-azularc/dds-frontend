import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const MAX_NOTES_LENGTH = 5000;

const AddNotesSummaryModal = ({ open, onClose, onSave, initialValue, title, saveLabel, loading }) => {
  const [summaryNotes, setSummaryNotes] = useState(initialValue);
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    if (!open) return;
    setSummaryNotes(initialValue);
    setErrorText('');
  }, [initialValue, open]);

  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  const handleSave = async () => {
    const normalizedSummaryNotes = String(summaryNotes ?? '').trim();

    if (!normalizedSummaryNotes) {
      setErrorText('Notes/Summary is required.');
      return;
    }

    const saveResult = await onSave(normalizedSummaryNotes);
    if (saveResult !== false) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pr: 6 }}>
        <Typography variant="h2">{title}</Typography>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: 'grey.500' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="Notes/Summary"
              variant="outlined"
              fullWidth
              minRows={5}
              multiline
              sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#fff' } }}
              value={summaryNotes}
              onChange={(e) => {
                setSummaryNotes(e.target.value.slice(0, MAX_NOTES_LENGTH));
                if (errorText) setErrorText('');
              }}
              inputProps={{ maxLength: MAX_NOTES_LENGTH }}
              error={Boolean(errorText)}
              helperText={errorText}
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
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={6} md={3}>
            <Button onClick={handleClose} color="secondary" fullWidth disabled={loading}>
              Cancel
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button onClick={handleSave} fullWidth disabled={loading}>
              {loading ? <CircularProgress size={18} color="inherit" /> : saveLabel}
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
  title: PropTypes.string,
  saveLabel: PropTypes.string,
  loading: PropTypes.bool,
};

AddNotesSummaryModal.defaultProps = {
  initialValue: '',
  title: 'Add Notes/Summary',
  saveLabel: 'Save',
  loading: false,
};

export default AddNotesSummaryModal;
