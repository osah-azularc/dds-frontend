import { useState, useCallback } from 'react';

/**
 * Custom hook for managing snackbar state
 * Replaces react-toastify toast notifications with CustomSnackbar component
 *
 * @returns {Object} - { snackbar, showSnackbar, handleSnackbarClose }
 *
 * @example
 * const { snackbar, showSnackbar, handleSnackbarClose } = useSnackbar();
 *
 *
 * // In JSX:
 * <CustomSnackbar
 *   open={snackbar.open}
 *   onClose={handleSnackbarClose}
 *   message={snackbar.message}
 *   severity={snackbar.severity}
 * />
 */
const useSnackbar = () => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info', // 'success', 'error', 'warning', 'info', 'default'
  });

  const showSnackbar = useCallback((message, severity = 'info') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  }, []);

  const handleSnackbarClose = useCallback((event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  return {
    snackbar,
    showSnackbar,
    handleSnackbarClose,
  };
};

export default useSnackbar;
