import axios from '../../utilities/axiosConfig';

export const createAccountAuth = () => {
  const fetchAccountSetupDetails = async (userId) => {
    try {
      const response = await axios.post(
        `/user/fetch-account-setup-details/${userId}`,
        {},
        { withCredentials: true },
      );
      return response;
    } catch (error) {
      if (error.response?.data?.message === 'Link expired') {
        return error.response;
      }
      if (error.response?.data?.message === 'Invalid link') {
        return error.response;
      }
      return null;
    }
  };

  const setAccountSetupPassword = async (userId, password) => {
    try {
      const response = await axios.post(
        '/user/set-account-setup-password',
        { userId, password },
        { withCredentials: true },
      );

      if (response.data.success) {
        return response;
      }
    } catch (error) {
      console.error(
        '[useAuth][setAccountSetupPassword] Error while setting account setup password:',
        error,
      );
    }
  };

  const cancelEmailInvitation = async (userId, adminEmail) => {
    try {
      const response = await axios.post(
        '/user/cancel-email-invitation',
        { userId, adminEmail },
        { withCredentials: true },
      );

      if (response.data.success) {
        return response;
      }
    } catch (error) {
      console.error(
        '[useAuth][cancelEmailInvitation] Error while cancelling email invitation:',
        error,
      );
    }
  };

  const checkEmailExists = async (email) => {
    try {
      const response = await axios.post(
        `/user/check-email-exists?email=${email}`,
        {},
        { withCredentials: true },
      );

      if (response.data.success) {
        return response.data.exists;
      }
      return null;
    } catch (error) {
      console.error('[useAuth][checkEmailExists] Error while checking email exists:', error);
    }
  };

  const fetchLoggedInUserDetails = async (requestConfig = {}) => {
    try {
      const response = await axios.get('/user/fetch-logged-in-user-details', {
        withCredentials: true,
        validateStatus: (status) =>
          (status >= 200 && status < 300) || status === 401 || status === 403,
        ...requestConfig,
      });
      return response.data;
    } catch (error) {
      if (error?.name === 'CanceledError' || error?.code === 'ERR_CANCELED') {
        throw error;
      }

      console.error(
        '[useAuth][fetchLoggedInUserDetails] Error while fetching user details:',
        error,
      );
      return {
        success: false,
        status: error?.response?.status ?? 500,
        message: error?.response?.data?.message || 'Unable to fetch logged in user details.',
      };
    }
  };

  return {
    fetchAccountSetupDetails,
    setAccountSetupPassword,
    cancelEmailInvitation,
    checkEmailExists,
    fetchLoggedInUserDetails,
  };
};
