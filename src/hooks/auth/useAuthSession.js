import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import axios, { setLoggingOut } from '../../utilities/axiosConfig';
import { clearStore } from '../../store/actions/clearStoreAction';
import { clearAllStorage } from '../../utilities/storageService';

const clearClientSessionArtifacts = () => {
  clearAllStorage();
  Cookies.remove('token');
  Cookies.remove('user');
  Cookies.remove('temp_secret');
  Cookies.remove('verified');
  Cookies.remove('socialverified');
};

export const createSessionAuth = ({ navigate, dispatch, logoutChannel }) => {
  const register = async (formValues) => {
    try {
      const response = await axios.post(
        '/user/signup',
        { ...formValues },
        { withCredentials: true },
      );

      toast.success(`Registration successful! ${response.data.message}`, {
        autoClose: 7000,
        position: 'top-center',
      });
      navigate('/');
    } catch (error) {
      console.error('[useAuth][register] Registration failed:', error);
      toast.error('Registration failed!', {
        autoClose: 2000,
        position: 'top-center',
      });
    }
  };

  const login = async (formValues) => {
    try {
      const { username, password } = formValues;
      const response = await axios.post(
        '/user/login',
        { username, password },
        { withCredentials: true },
      );

      if (response.data.key) {
        toast.info(response.data.message, { autoClose: 5000, position: 'top-center' });
        return null;
      }
      if (response.data) {
        return response;
      }
      return null;
    } catch (error) {
      // Return error response data so the caller can display the actual API message
      if (error.response?.data) {
        return { data: error.response.data };
      }
      toast.error('Login Failed!', { autoClose: 2000, position: 'top-center' });
      return null;
    }
  };

  const twofavalidateotp = async (accesscode, data) => {
    const user = data?.user || data?.email || null;

    if (!user) {
      toast.error('OTP Verification Failed! Missing user information.', {
        autoClose: 2000,
        position: 'top-center',
      });
      return;
    }

    try {
      const response = await axios.post(
        '/user/twofavalidateOtp',
        { ...data, accesscode, user },
        { withCredentials: true },
      );

      if (response.data.isVerified) {
        toast.success('Logged in successfully', { autoClose: 2000, position: 'top-center' });
        navigate('/home');
      }
    } catch (error) {
      clearClientSessionArtifacts();
      navigate('/');
      toast.error('OTP Verification Failed! Please try again', {
        autoClose: 2000,
        position: 'top-center',
      });
    }
  };

  const logout = async (email) => {
    const finalizeLogout = () => {
      dispatch(clearStore());
      logoutChannel?.postMessage?.('logout');
      clearClientSessionArtifacts();
      navigate('/');
      // Reset the flag after navigation so future requests work normally
      setLoggingOut(false);
    };

    try {
      const response = await axios.post('/user/logout', { email }, { withCredentials: true });

      if (response?.data?.success === true) {
        finalizeLogout();
        return;
      }

      finalizeLogout();
    } catch (error) {
      finalizeLogout();
    }
  };

  return {
    register,
    login,
    twofavalidateotp,
    logout,
  };
};
