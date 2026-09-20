const styles = (theme) => ({
  CommonErrorBox: {
    display: 'flex',
    borderRadius: '4px',
    backgroundColor: theme.palette.error.main,
    padding: 2,
    color: theme.palette.common.white,
    justifyContent: 'space-between',
  },
  ErrorHeading: {
    color: theme.palette.common.white,
    fontWeight: theme.typography.fontWeightMedium,
  },
  ErrorInfo: {
    color: theme.palette.common.white,
    fontWeight: theme.typography.fontWeightMedium,
  },
  ErrorIconBox: {
    mr: 1,
  },
  CloseIconBox: {
    ml: 1,
    cursor: 'pointer',
  },
});

export default styles;
