const loginFormStyles = (theme) => ({
  LoginFormPaper: {
    boxShadow: '0 0 20px -2px #9b9b9b',
    maxWidth: '380px',
    mt: 4,
    mb: 4,
    marginLeft: 'auto',
    marginRight: 'auto',
    p: 5,
    '@media screen and (max-width: 767px)': {
      m: 2,
    },
  },
  LoginHeading: {
    fontWeight: theme.typography.fontWeightMedium,
    mt: -2,
  },
  LoginFormBoldText: {
    color: theme.palette.text.secondary,
    fontWeight: theme.typography.fontWeightMedium,
  },
  LoginDivider: {
    position: 'relative',
    mt: 3,
    mb: 6,
  },
  OrDividerText: {
    position: 'absolute',
    top: '50%',
    textAlign: 'center',
    background: '#fff',
    padding: '0 10px',
    transform: 'translate(-50%, -50%)',
    left: '50%',
    color: theme.palette.text.primary,
  },
  RememberMe: {
    pl: 2,
  },
});

export default loginFormStyles;
