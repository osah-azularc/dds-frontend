import React from 'react';
import PropTypes from 'prop-types';
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
import CloseIcon from '@mui/icons-material/Close';

/**
 * Reusable delete confirmation dialog. Ported from ecourt-frontend's
 * components/dialogue/DeleteDialogue.jsx.
 */
function DeleteDialogue({ open, onClose, onConfirm, title, message, confirmText, cancelText }) {
  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Typography variant="h2">{title}</Typography>
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={(theme) => ({ position: 'absolute', right: 8, top: 8, color: theme.palette.grey[500] })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Typography variant="body1">{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Grid container spacing={2} justifyContent="center" sx={{ pb: 2 }}>
          <Grid item xs={12} sm={4}>
            <Button onClick={onClose} color="secondary" fullWidth>
              {cancelText}
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button onClick={handleConfirm} fullWidth>
              {confirmText}
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
}

DeleteDialogue.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
};

DeleteDialogue.defaultProps = {
  onConfirm: undefined,
  confirmText: 'Delete',
  cancelText: 'Cancel',
};

export default DeleteDialogue;
