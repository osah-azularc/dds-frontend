import { useState, useEffect, Suspense, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import AppRouteMain from './routes/index';
import { BrowserRouter } from 'react-router-dom';
import Loader from './components/Loader/Loader';
import { ToastContainer } from 'react-toastify';
import { StyledEngineProvider } from '@mui/material';
import { SnackbarProvider } from './context/snackbarContext';
import 'react-toastify/dist/ReactToastify.css';
import AuthContext from './HOCs/AuthProvider';
import ErrorModal from './utilities/ErrorModal';

import Cookies from 'js-cookie';
import { clearAllStorage, clearLegacyAuthStorage } from './utilities/storageService';
import { clearStore } from './store/actions/clearStoreAction';
import { setUser } from './store/slices/userSlice';
import useAuth from './hooks/useAuth';

const AUTH_BOOTSTRAP_TIMEOUT_MS = 10000;
const PUBLIC_AUTH_PATHS = ['/', '/login', '/forgot-password', '/signup', '/unauthorized-access'];

const isPublicAuthPath = (pathname = '') => {
  if (PUBLIC_AUTH_PATHS.includes(pathname)) {
    return true;
  }

  return pathname.startsWith('/account-setup');
};

function AppContent() {
  const [authBootstrapComplete, setAuthBootstrapComplete] = useState(false);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => Boolean(state?.user?.isAuthenticated));
  const isAuthenticatedRef = useRef(isAuthenticated);
  const { fetchLoggedInUserDetails } = useAuth();
  const fetchLoggedInUserDetailsRef = useRef(fetchLoggedInUserDetails);

  useEffect(() => {
    isAuthenticatedRef.current = isAuthenticated;
  }, [isAuthenticated]);

  useEffect(() => {
    fetchLoggedInUserDetailsRef.current = fetchLoggedInUserDetails;
  }, [fetchLoggedInUserDetails]);

  useEffect(() => {
    clearLegacyAuthStorage();
  }, []);

  const clearClientAuthState = useCallback(() => {
    dispatch(clearStore());
    clearAllStorage();
    Cookies.remove('token');
    Cookies.remove('user');
    Cookies.remove('temp_secret');
    Cookies.remove('verified');
    Cookies.remove('socialverified');
  }, [dispatch]);

  useEffect(() => {
    const shouldBootstrapAuth =
      isAuthenticatedRef.current || !isPublicAuthPath(window.location.pathname);

    if (!shouldBootstrapAuth) {
      setAuthBootstrapComplete(true);
      return undefined;
    }

    let isMounted = true;
    const abortController = new AbortController();
    const bootstrapTimeoutId = window.setTimeout(() => {
      abortController.abort();
    }, AUTH_BOOTSTRAP_TIMEOUT_MS);

    const bootstrapAuthState = async () => {
      try {
        const payload = await fetchLoggedInUserDetailsRef.current({
          signal: abortController.signal,
        });

        if (!isMounted) {
          return;
        }

        if (payload?.status === 401 || payload?.status === 403) {
          if (!isAuthenticatedRef.current) {
            clearClientAuthState();
          }
          return;
        }

        if (!payload?.success) {
          return;
        }

        const { user } = payload.data || {};
        const normalizedUserId = user?.userId ?? user?.user_id;

        if (normalizedUserId && user?.email) {
          dispatch(setUser({ ...user, isAuthenticated: true }));
        } else {
          clearClientAuthState();
        }
      } catch (error) {
        if (
          error?.name === 'AbortError' ||
          error?.name === 'CanceledError' ||
          error?.code === 'ERR_CANCELED'
        ) {
          return;
        }

        if (!isMounted) {
          return;
        }

        if (error?.response?.status === 401 || error?.response?.status === 403) {
          if (!isAuthenticatedRef.current) {
            clearClientAuthState();
          }
        }
      } finally {
        window.clearTimeout(bootstrapTimeoutId);

        if (isMounted) {
          setAuthBootstrapComplete(true);
        }
      }
    };

    bootstrapAuthState();

    return () => {
      isMounted = false;
      window.clearTimeout(bootstrapTimeoutId);
      abortController.abort();
    };
  }, [clearClientAuthState, dispatch]);

  useEffect(() => {
    const logoutChannel = new BroadcastChannel('logout');

    logoutChannel.onmessage = (event) => {
      if (event.data !== 'logout') {
        return;
      }

      clearClientAuthState();

      if (window.location.pathname !== '/') {
        window.location.assign('/');
      }
    };

    return () => {
      logoutChannel.close();
    };
  }, [clearClientAuthState]);

  const canRenderDuringBootstrap = isAuthenticated || isPublicAuthPath(window.location.pathname);

  if (!authBootstrapComplete && !canRenderDuringBootstrap) {
    return <Loader />;
  }

  return (
    <>
      <ErrorModal />
      <Suspense fallback={<Loader />}>
        <AppRouteMain />
      </Suspense>

      <ToastContainer />
    </>
  );
}

function App() {
  return (
    <AuthContext>
      <SnackbarProvider>
        <StyledEngineProvider injectFirst>
          <BrowserRouter unstable_useTransitions={false}>
            <AppContent />
          </BrowserRouter>
        </StyledEngineProvider>
      </SnackbarProvider>
    </AuthContext>
  );
}

export default App;
