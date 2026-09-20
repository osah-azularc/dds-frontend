const styles = () => ({
  LoginMainBox: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    position: 'relative',
  },
  LoginContainer: {
    height: 'calc(100vh - 43px)',
  },
  TopStrip: {
    width: '100%',
    background: '#8d96a8',
    height: '6px',
  },
  FooterStrip: {
    width: '100%',
    background: '#596171',
    height: '37px',
    '@media screen and (max-width: 768px)': {
      height: 'auto',
    },
  },
});

export default styles;
