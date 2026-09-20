/*eslint-disable */
import axios from 'axios';
import Cookies from 'js-cookie';
import { showErrorSnackbar } from './ErrorSnackBar';

let baseURL = 'http://localhost:9002';

export const SERVER_ERRORS = {
  NETWORK_ERROR: {
    code: 'ERR_NETWORK',
    message: 'Network Error',
    errorDisplayMessage: 'The server is currently unavailable. Please try again later.',
  },
  EXPIRED_SESSION: {
    status: 401,
    message: 'Unauthorized',
    errorDisplayMessage: 'Authentication expired. Logging out.',
  },
};

if (window.location.hostname !== 'localhost') {
  const parts = window.location.hostname.split('.');
  const subdomain = parts[0];
  const domain = parts.slice(1).join('.');
  baseURL = `https://${subdomain}.${domain}/api`;
}

const axiosInstance = axios.create({
  baseURL,
});

/** Flag to suppress API calls during an intentional logout. */
let _isLoggingOut = false;

/** Call before starting the logout flow to prevent stale API calls. */
export const setLoggingOut = (value) => {
  _isLoggingOut = value;
};

/** Check whether a logout is currently in progress. */
export const isLoggingOut = () => _isLoggingOut;
// Export baseURL for direct use (e.g., preview URLs that open in new windows)
export { baseURL };

axiosInstance.interceptors.request.use(
  (config) => {
    /* eslint-disable no-param-reassign */
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    // Return successful responses as-is
    return response;
  },
  (error) => {
    // A cancelled request (e.g. a component unmounting mid-request, or an intentional
    // AbortController signal like App.jsx's own auth-bootstrap timeout) isn't a real error -
    // it was triggered by the app itself on purpose, and every call site that actually cares
    // already checks for it before deciding whether to react (see App.jsx/useEfilingData.js).
    // Falling through to the generic branch below showed a raw, confusing "canceled" toast for
    // this on every page load - stay quiet here instead, same as those call sites already do.
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    // Handle different types of errors
    if (error.response) {
      // Server responded with error status (4xx, 5xx)
      const status = error.response.status;
      const errorData = error.response.data;

      // Don't show snackbar for certain status codes that should be handled locally
      const skipSnackbarStatuses = [401, 403, 409, 400]; // Authentication/authorization errors and business logic conflicts

      if (!skipSnackbarStatuses.includes(status)) {
        const errorMessage =
          errorData?.error ||
          errorData?.message ||
          `Server error: ${status} ${error.response.statusText}`;
        showErrorSnackbar(errorMessage);
      }
    } else if (error.request) {
      // Network error

      showErrorSnackbar('Network error: Unable to connect to server');
    } else {
      // Other errors

      showErrorSnackbar(error.message || 'An unexpected error occurred');
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
