import { useCallback, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

/**
 * Generic confirm (Cancel/OK) dialog hook. Used by the Docket Search results
 * screen's Download Case Files action for the "Attention: Files over 250 MB
 * will not be downloaded" popup, matching legacy's #downloadDocketAlert modal
 * (osah.repos/module/Osahform/view/osahform/dds/superuser.phtml).
 * Ported from ecourt-frontend's useConfirmDialog.jsx, restyled with inline
 * sx (DDS has no DialogTitleBox/DialogHeading global CSS classes).
 * `showConfirmDialog`'s optional 4th arg overrides the confirm button's label (default "OK") --
 * e.g. Form1205Form.jsx's own Submit confirmation, which matches legacy's "Warning" popup
 * (form1-1205form.phtml) exactly, including its yellow "Submit" button.
 */
export function useConfirmDialog() {
  const [dialogState, setDialogState] = useState({
    open: false,
    title: '',
    message: '',
    onConfirm: null,
    confirmLabel: 'OK',
  });

  const showConfirmDialog = useCallback((title, message, onConfirm, confirmLabel = 'OK') => {
    setDialogState({ open: true, title, message, onConfirm, confirmLabel });
  }, []);

  const handleClose = useCallback((confirmed) => {
    setDialogState((prev) => {
      if (confirmed && prev.onConfirm) prev.onConfirm();
      return { open: false, title: '', message: '', onConfirm: null, confirmLabel: 'OK' };
    });
  }, []);

  const ConfirmDialog = useCallback(
    () => (
      <Dialog open={dialogState.open} onClose={() => handleClose(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{dialogState.title}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.primary' }}>
            {dialogState.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => handleClose(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={() => handleClose(true)}
            variant="contained"
            autoFocus
            sx={{
              backgroundColor: '#D4A500',
              color: '#fff',
              textTransform: 'none',
              '&:hover': { backgroundColor: '#C49500' },
            }}
          >
            {dialogState.confirmLabel}
          </Button>
        </DialogActions>
      </Dialog>
    ),
    [dialogState, handleClose],
  );

  return { showConfirmDialog, ConfirmDialog };
}
