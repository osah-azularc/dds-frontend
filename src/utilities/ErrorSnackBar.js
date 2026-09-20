/*eslint-disable */
import { toast } from 'react-toastify';

// Common error snackbar function
export const showErrorSnackbar = (message) => {
  toast.error(message, {
    position: 'bottom-right',
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

// Common success snackbar function
export const showSuccessSnackbar = (message) => {
  toast.success(message, {
    position: 'bottom-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

// Common warning snackbar function
export const showWarningSnackbar = (message) => {
  toast.warning(message, {
    position: 'bottom-right',
    autoClose: 3500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

// Common info snackbar function
export const showInfoSnackbar = (message) => {
  toast.info(message, {
    position: 'bottom-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};
