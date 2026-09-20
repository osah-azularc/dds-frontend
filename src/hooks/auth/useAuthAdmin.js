import { toast } from 'react-toastify';
import axios from '../../utilities/axiosConfig';
import { ADMIN_SETTINGS } from '../../utilities/requestModuleTags';

export const createAdminAuth = () => {
  const adminRequestConfig = {
    withCredentials: true,
    headers: { 'x-module': ADMIN_SETTINGS },
  };

  const addNewUser = async (formValues) => {
    try {
      const response = await axios.post(
        '/user/add-new-user',
        { ...formValues },
        adminRequestConfig,
      );

      if (response.data.success) {
        toast.success(`Registration successful! ${response.data.message}`, {
          autoClose: 7000,
          position: 'top-center',
        });
        return response;
      }
    } catch (error) {
      toast.error('Registration failed!', { autoClose: 2000, position: 'top-center' });
    }
  };

  const editUser = async (formValues) => {
    try {
      const response = await axios.post('/user/edit-user', { ...formValues }, adminRequestConfig);
      if (response.data.success) {
        return response;
      }
    } catch (error) {
      console.error('[useAuth][editUser] Error while editing user:', error);
    }
  };

  const editUserAndResendInvite = async (formValues) => {
    try {
      const response = await axios.post(
        '/user/edit-user-resend-invite',
        { ...formValues },
        adminRequestConfig,
      );

      if (response.data.success) {
        return response;
      }
    } catch (error) {
      console.error('[useAuth][editUserAndResendInvite] User edit failed:', error);
      toast.error('User edit failed!', { autoClose: 2000, position: 'top-center' });
      return error.response;
    }
  };

  const disableUser = async (userId) => {
    try {
      const response = await axios.post(
        '/user/disable-user-access',
        { userId },
        adminRequestConfig,
      );

      if (response.data.success) {
        toast.success(`User disabled successfully! ${response.data.message}`, {
          autoClose: 7000,
          position: 'top-center',
        });
        return response;
      }
    } catch (error) {
      toast.error('User disable failed!', { autoClose: 2000, position: 'top-center' });
    }
  };

  const restoreUser = async (userId) => {
    try {
      const response = await axios.post(
        '/user/restore-user-access',
        { userId },
        adminRequestConfig,
      );

      if (response.data.success) {
        toast.success(`${response.data.message}`, { autoClose: 7000, position: 'top-center' });
        return response;
      }
    } catch (error) {
      toast.error('User access restoration failed!', {
        autoClose: 2000,
        position: 'top-center',
      });
    }
  };

  const unlockUser = async (userId, loggedInRole) => {
    try {
      const response = await axios.post(
        '/user/unlock-user',
        { userId, loggedInRole },
        adminRequestConfig,
      );

      if (response.data.success) {
        return response;
      }
    } catch (error) {
      console.error('[useAuth][unlockUser] Error while unlocking user:', error);
    }
  };

  return {
    addNewUser,
    editUser,
    editUserAndResendInvite,
    disableUser,
    restoreUser,
    unlockUser,
  };
};
