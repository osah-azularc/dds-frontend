const styles = (theme) => ({
  DocketSearchContainer: {
    position: 'relative',
    padding: '120px 10px 20px 10px',
    background: 'rgba(255, 255, 255, .5)',
    borderBottom: '2px solid #d5d7db',
    '@media (max-width: 1024px)': {
      padding: '20px 10px',
    },
  },

  DocketNumberBlockOuter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },

  DocketNumberBlock: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: theme.spacing(0, 0, 0, 2),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1],
    overflow: 'hidden',
    border: '2px solid #d5d7db',
    '& .MuiInputBase-root input': {
      fontSize: '30px',
      padding: '8px',
      color: '#8d96a8',
      textAlign: 'center',
      width: '250px',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderRadius: '0',
      border: 'none',
    },
  },

  Search: {
    display: 'flex',
    px: theme.spacing(1),
    '& .MuiSvgIcon-root': {
      color: '#596171',
    },
  },

  AdditionalOptionsToggle: {
    display: 'flex',
    alignItems: 'center',
    mt: 1,
    cursor: 'pointer',
    color: '#36444f',
    '& .MuiSvgIcon-root': {
      fontSize: '20px',
    },
  },
});

export default styles;
