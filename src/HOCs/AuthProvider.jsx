import Cookies from 'js-cookie';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { clearStore } from '../store/actions/clearStoreAction';
import axiosInstance, { SERVER_ERRORS, isLoggingOut } from '../utilities/axiosConfig';

const APIContext = createContext();
const AuthContext = ({ children }) => {
  const dispatch = useDispatch();
  const [errorModalTrigger, setErrorModalTrigger] = useState(false);
  const [errorTitle, setErrorTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    axiosInstance.interceptors.response.use(
      (res) => res,
      (error) => {
        if (!error.response && error.code === SERVER_ERRORS.NETWORK_ERROR.code) {
          setErrorTitle('Something went wrong.');
          setErrorMessage('Server is not responding. Please contact support.');
          setErrorModalTrigger(true);
          return Promise.reject(error); // Re-reject the error
        }
        // Check if this is a login-related 401 error (should not show session expired modal)
        const isLoginError =
          error.config?.url?.includes('/user/login') ||
          error.response?.data?.message?.includes('not an active user') ||
          error.response?.data?.message === 'Invalid credentials.';

        if (
          error.response &&
          error.response.status === SERVER_ERRORS.EXPIRED_SESSION.status &&
          !isLoginError &&
          !isLoggingOut()
        ) {
          // 401 Unauthorized error: Cookie expired or invalid
          // 1. Clear Redux store
          dispatch(clearStore());

          // 2. Remove tokens/cookies from local storage/cookies
          Cookies.remove('user');
          Cookies.remove('token');
          Cookies.remove('verified');
          document.cookie = 'jwt=; Max-Age=0'; // Clear the JWT cookie

          // 3. Show error message
          setErrorTitle('Session has expired');
          setErrorMessage('Your session has expired. Please login again.');
          setErrorModalTrigger(true);
          return Promise.reject(error); // Or just return; if you don't need to stop the promise chain
        }
        return Promise.reject(error);
      },
    );
  }, [dispatch]);

  const value = useMemo(
    () => ({
      errorModalTrigger,
      errorTitle,
      errorMessage,
      setErrorModalTrigger,
    }),
    [errorModalTrigger, errorTitle, errorMessage, setErrorModalTrigger],
  );

  return <APIContext.Provider value={value}>{children}</APIContext.Provider>;
};

export default AuthContext;

export function useAuthAPI() {
  const context = useContext(APIContext);
  if (context === undefined) {
    throw new Error('Context must be used within a Provider');
  }
  return context;
}
