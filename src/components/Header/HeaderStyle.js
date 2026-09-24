import topBg from '../../../src/assets/images/top-bg.jpg';

const styles = (theme) => ({
  HeaderOuter: {
    backgroundImage: `url(${topBg})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%',
  },

  HeaderPanel: {
    backgroundColor: (props) => (props.isHome ? 'rgba(255, 255, 255, .8)' : '#fff'),
    borderBottom: (props) => (props.isHome ? 'none' : '1px solid #d0d2d6'),
    /* height: '100px', */
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'column',
    paddingRight: theme.spacing(3),
    paddingLeft: theme.spacing(3),
    '@media (max-width: 1320px)': {
      paddingRight: theme.spacing(2),
      paddingLeft: theme.spacing(2),
    },
    '@media (max-width: 1024px)': {
      top: '0',
    },
  },

  HeaderLinks: {
    display: 'flex',
    flexWrap: 'nowrap',
    gap: theme.spacing(3),
    marginLeft: theme.spacing(4),
    position: 'static',
    minWidth: 0,
    overflowX: 'auto',
    overflowY: 'hidden',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },

    '& a': {
      fontFamily: 'Open Sans, sans-serif',
      cursor: 'pointer',
      textDecoration: 'none',
      padding: '31px 0',
      position: 'relative',
      color: '#36444f',
      borderBottom: '6px solid transparent',
      whiteSpace: 'nowrap',
      flexShrink: 0,

      '& .MuiTypography-root': {
        fontSize: 'clamp(14px, 1vw, 17px)',
      },

      '&:hover .MuiBox-root': {
        display: 'block',
      },
      '&:hover': {
        borderBottom: `6px solid ${theme.palette.primary.main}`,
      },
    },

    '& a.active-nav': {
      borderBottom: `6px solid ${theme.palette.primary.main}`,
    },

    '@media (max-width: 1319px)': {
      position: 'static',
      backgroundColor: '#fff',
      width: `calc(100% + ${theme.spacing(4)})`,
      marginLeft: `-${theme.spacing(2)}`,
      marginRight: `-${theme.spacing(2)}`,
      boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: 0,
      overflowX: 'visible',

      '& a': {
        width: '100%',
        boxSizing: 'border-box',
        padding: '10px 20px',
        borderBottom: 'none',
        '& .MuiTypography-root': {
          fontSize: '16px',
        },
        '& .MuiBox-root': {
          display: 'block',
          height: '100%',
          width: '5px',
        },
      },
    },
  },

});

export default styles;
