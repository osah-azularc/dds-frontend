const screenTabStyles = (theme) => ({
  TabListContainer: {
    maxWidth: '100%',
    borderBottom: '1px solid',
    borderColor: theme.palette.divider,
    position: 'relative',
    paddingLeft: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#8d96a8',
    [theme.breakpoints.down('sm')]: {
      padding: '0',
      paddingLeft: '0',
    },
    '& .MuiTab-root': {
      color: '#fff',
      textAlign: 'center',
      fontSize: '15px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '14px !important',
        padding: '12px 6px',
        minWidth: 'unset',
        minHeight: '48px',
        lineHeight: 1.2,
        textAlign: 'center',
      },
    },
    '& .MuiTab-root.Mui-selected': {
      color: '#fff',
    },
    '& .MuiTabs-root': {
      width: '100%',
    },
    '& .MuiTabs-indicator': {
      height: '6px',
      borderRadius: '25px',
    },
  },
  Tab2ListContainer: {
    backgroundColor: '#8d96a8',
    '& .MuiTab-root': {
      color: '#fff !important',
    },
  },
  PartiesCard: {
    border: '1px solid #d5d7db',
    height: '200px',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  PartiesCardTop: {
    background: '#f1f1f1',
    borderBottom: '1px solid #d5d7db',
    padding: '4px 16px',
  },
  PartiesCardBody: {
    padding: '16px',
  },
  SectionCount: {
    '& h2': {
      fontWeight: '700',
      color: '#fff',
      backgroundColor: theme.palette.primary.main,
      height: '30px',
      width: '30px',
      borderRadius: '25px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '16px',
    },
  },
});

export default screenTabStyles;
