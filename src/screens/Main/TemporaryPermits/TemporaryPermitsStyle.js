const styles = (theme) => ({
  HeaderSection: {
    p: 3,
    backgroundColor: '#fff',
    borderBottom: '1px solid #dfe3e8',
  },
  ContentContainer: {
    p: 3,
    backgroundColor: '#fff',
  },
  Section: {
    maxWidth: '420px',
  },
  SectionTitle: {
    mb: 2.5,
  },
  SectionDivider: {
    my: 4,
    maxWidth: '600px',
  },
  FieldBackground: {
    mb: 2.5,
    '& .MuiOutlinedInput-root': { backgroundColor: '#fff' },
  },
  PrintButton: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
});

export default styles;
