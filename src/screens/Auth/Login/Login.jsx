import { Box, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FooterStrip from '../../../components/FooterStrip/FooterStrip';
import Form from '../../../components/Form/Form';
import MainLogo from '../../../components/MainLogo/MainLogo';
import useAuth from '../../../hooks/useAuth';
import { setUser } from '../../../store/slices/userSlice';
import styles from './LoginStyle';
/**
 * Login screen component responsible for authenticating users,
 * initializing RBAC data, and redirecting after successful login.
 *
 * @returns {JSX.Element} Rendered login screen.
 */
const Login = () => {
  const theme = useTheme();
  const classes = styles(theme);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { login } = useAuth();
  const [loginError, setLoginError] = useState(null);

  /**
   * Handles user login, stores authenticated user data,
   * initializes RBAC permissions, and redirects the user.
   *
   * @param {Object} data - Login form payload.
   * @returns {Promise<void>}
   */
  const handleLogin = async (data) => {
    try {
      const response = await login(data);

      if (response?.data?.success) {
        // Use token from response body (more reliable than cookie)
        const token = response.data.token || Cookies.get('token');
        let email = null;
        let user_id = null;
        let user_type = null;
        let firstName = null;
        let lastName = null;
        let isAdmin = null;
        let is_admin = null;
        let isActiveBilling = null;
        let review_form1s = null;

        // Decode JWT to extract all user fields
        if (token) {
          try {
            const decoded = jwtDecode(token);
            console.log(decoded);
            email = decoded.email;
            user_id = decoded.id;
            user_type = decoded.user_type;
            firstName = decoded.firstName;
            lastName = decoded.lastName;
            isAdmin = decoded.isAdmin;
            isActiveBilling = decoded.isActiveBilling;
            review_form1s = review_form1s || decoded.review_form1s;
          } catch (decodeError) {
            setLoginError('[Login] JWT decode error:', decodeError);
          }
        }

        // Get permissions from API response
        const permissions = response.data.permissions || [];

        // Store user data in Redux
        dispatch(
          setUser({
            email,
            userId: user_id,
            user_id,
            user_type,
            FirstName: firstName,
            LastName: lastName,
            permissions,
            isAdmin: isAdmin ?? is_admin,
            isActiveBilling,
            review_form1s,
          }),
        );

        // Handle redirect
        const redirectUrl = localStorage.getItem('redirectURL');
        navigate(redirectUrl || '/home');
        if (redirectUrl) localStorage.removeItem('redirectURL');
      } else {
        setLoginError(response?.data?.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      setLoginError('An error occurred during login. Please try again.');
    }
  };

  return (
    <Grid container sx={classes.LoginContainer}>
      <Grid item xs={12}>
        <Box sx={classes.TopStrip} />
        <Box sx={classes.LoginMainBox}>
          <Box>
            <MainLogo clickable={false} />
          </Box>
          <Form
            onSubmit={handleLogin}
            loginError={loginError}
            errorClose={() => setLoginError(null)}
            setLoginError={setLoginError}
          />
        </Box>
        <FooterStrip />
      </Grid>
    </Grid>
  );
};

export default Login;
