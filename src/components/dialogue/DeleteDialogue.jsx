import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Reusable delete confirmation dialog, matching the ecourt OSAH app's delete
 * modals (docket delete, party delete, etc.) - same title/message/note layout
 * with a Cancel + confirm action pair.
 */
const DeleteDialogue = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  note,
  confirmText,
  cancelText,
  fullWidth,
  maxWidth,
}) => {
  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
      fullWidth={fullWidth}
      maxWidth={maxWidth}
    >
      <DialogTitle id="confirmation-dialog-title" sx={{ pr: 6 }}>
        <Typography variant="h2">{title}</Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: 'grey.500' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Typography variant="body1">{message}</Typography>
          </Grid>
          {note && (
            <Grid item xs={12}>
              <Typography variant="body1">{note}</Typography>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={6} md={3}>
            <Button onClick={onClose} color="secondary" fullWidth>
              {cancelText}
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button onClick={handleConfirm} fullWidth>
              {confirmText}
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

DeleteDialogue.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  note: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  fullWidth: PropTypes.bool,
  maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
};

DeleteDialogue.defaultProps = {
  onConfirm: undefined,
  note: '',
  confirmText: 'Delete',
  cancelText: 'Cancel',
  fullWidth: true,
  maxWidth: 'sm',
};

export default DeleteDialogue;
