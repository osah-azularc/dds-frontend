const styles = (theme) => ({
  MainLogo: {
    cursor: 'pointer',
    [theme.breakpoints.down('sm')]: {
      img: {
        width: '100%',
        padding: '10px 0',
      },
    },
  },
});

export default styles;
