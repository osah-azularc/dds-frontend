const styles = (theme) => ({
  ContentContainer: {
    p: 3,
    backgroundColor: '#fff',
  },
  TopBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 2,
    mb: 2.5,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'stretch',
    },
  },
  SearchField: {
    minWidth: '280px',
    '& .MuiOutlinedInput-root': { backgroundColor: '#fff' },
    [theme.breakpoints.down('sm')]: {
      minWidth: '100%',
    },
  },
  ActionButton: {
    minWidth: '84px',
  },
});

export default styles;
