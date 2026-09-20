import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import styles from './ErrorMessageStyle';
import { useTheme } from '@mui/material/styles';
import { MESSAGES } from '../../constants/constant-messages';

const ErrorMessage = ({ handleErrorClose, errorMessageKey }) => {
  const theme = useTheme();
  const classes = styles(theme);

  let errorHeading = 'Incorrect Email or Password';
  let errorInfo = 'The email or password entered is invalid. Please try again.';

  if (errorMessageKey === MESSAGES.ACCOUNT_LOCKED) {
    errorHeading = 'Account Locked';
    errorInfo = 'Reach out to your system administrator if you need to reset your password';
  } else if (errorMessageKey && errorMessageKey !== 'true' && errorMessageKey !== true) {
    // Use dynamic error message from API response
    errorHeading = 'Login Error';
    errorInfo = errorMessageKey;
  }

  return (
    <Box sx={classes.CommonErrorBox}>
      <Box sx={classes.ErrorIconBox}>
        <ErrorOutlineOutlinedIcon />
      </Box>
      <Box sx={classes.ErrorTextBox}>
        <Typography variant="h6" component="div" sx={[classes.ErrorHeading]}>
          {errorHeading}
        </Typography>
        <Typography variant="body2" component="div" sx={classes.ErrorInfo}>
          {errorInfo}
        </Typography>
      </Box>

      <Box sx={classes.CloseIconBox} onClick={handleErrorClose}>
        <CloseOutlinedIcon />
      </Box>
    </Box>
  );
};

ErrorMessage.propTypes = {
  handleErrorClose: PropTypes.func.isRequired,
  errorMessageKey: PropTypes.string,
};
ErrorMessage.defaultProps = {
  errorMessageKey: '', // Add defaultProps declaration for errorMessageKey prop
};

export default ErrorMessage;
