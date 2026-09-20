import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTheme } from '@mui/material/styles';
import { TextField, Paper, Button, Grid, IconButton, InputAdornment } from '@mui/material';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import styles from './LoginFormStyle';

const LoginForm = ({ onSubmit, loginError, errorClose, setLoginError }) => {
  const theme = useTheme();
  const classes = styles(theme);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    clearErrors,
    watch,
  } = useForm({ mode: 'onChange' });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const passwordValue = watch('password', '');

  const { onChange: onUsernameChange, ...usernameField } = register('username', {
    required: 'Username is required',
    validate: {
      notEmpty: (value) => value.trim().length > 0 || 'Username cannot contain only spaces',
      validUsername: (value) =>
        /^(?=.*[A-Za-z0-9])[A-Za-z0-9@._-]+$/.test(value.trim()) || 'Enter a valid username',
    },
  });

  const { onChange: onPasswordChange, ...passwordField } = register('password', {
    required: 'Password is required',
    validate: (value) => value.trim().length > 0 || 'Password cannot contain only spaces',
  });

  // Strips only leading whitespace so a stray space never wipes existing input or jumps the cursor.
  const stripLeadingSpace = (e) => {
    if (e.target.value.charAt(0) === ' ') {
      e.target.value = e.target.value.replace(/^\s+/, '');
    }
  };

  const handleErrorState = () => {
    if (loginError) {
      clearErrors();
      errorClose(false);
      setLoginError(null);
    }
  };

  return (
    <Paper
      sx={classes.LoginFormPaper}
      component="form"
      onSubmit={handleSubmit((data) => {
        const trimmedData = {
          ...data,
          username: data.username?.trim(),
          password: data.password?.trim(),
        };
        onSubmit(trimmedData, reset);
      })}
    >
      <Grid container spacing={3}>
        {loginError && (
          <Grid item xs={12}>
            <ErrorMessage handleErrorClose={errorClose} errorMessageKey={loginError} />
          </Grid>
        )}

        <Grid item xs={12}>
          <TextField
            {...usernameField}
            label="Username"
            variant="outlined"
            fullWidth
            onChange={(e) => {
              stripLeadingSpace(e);
              handleErrorState();
              onUsernameChange(e);
            }}
            error={!!errors.username}
            helperText={errors.username?.message}
            inputProps={{
              autoComplete: 'username',
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            {...passwordField}
            label="Password"
            type={isPasswordVisible ? 'text' : 'password'}
            variant="outlined"
            fullWidth
            onChange={(e) => {
              stripLeadingSpace(e);
              handleErrorState();
              onPasswordChange(e);
            }}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              endAdornment: passwordValue && (
                <InputAdornment position="end" sx={{ marginRight: '16px' }}>
                  <IconButton onClick={() => setIsPasswordVisible(!isPasswordVisible)} edge="end">
                    {isPasswordVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={classes.loginButton}
            disabled={isSubmitting}
            type="submit"
          >
            Login
          </Button>
        </Grid>

        {/* <Grid item xs={12} align="center">
          <Link onClick={() => navigate('/forgot-password')} >
            Forgot or Expired Password?
          </Link>
        </Grid> */}
      </Grid>
    </Paper>
  );
};

export default LoginForm;
