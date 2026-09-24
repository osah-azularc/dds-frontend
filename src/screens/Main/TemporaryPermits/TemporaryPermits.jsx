import PrintIcon from '@mui/icons-material/Print';
import { Box, Button, CircularProgress, Divider, Grid, TextField, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import styles from './TemporaryPermitsStyle';
import { useTemporaryPermits } from './useTemporaryPermits';

const TemporaryPermits = () => {
  const theme = useTheme();
  const classes = styles(theme);
  const {
    licenseNumber,
    setLicenseNumber,
    printingAll,
    printingOne,
    handlePrintAll,
    handlePrintOne,
  } = useTemporaryPermits();

  return (
    <Grid container direction="column">
      <Grid item xs={12} sx={classes.HeaderSection}>
        <Typography component="h1" variant="h1" color="secondary">
          Print Temporary Permits
        </Typography>
      </Grid>

      <Grid item xs={12} sx={classes.ContentContainer}>
        <Box sx={classes.Section}>
          <Typography variant="h2" color="secondary" sx={classes.SectionTitle}>
            Select button to print all &quot;unprinted&quot; permits
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={printingAll ? <CircularProgress size={16} color="inherit" /> : <PrintIcon />}
            onClick={handlePrintAll}
            disabled={printingAll}
            sx={classes.PrintButton}
          >
            {printingAll ? 'Printing…' : 'Print Permits'}
          </Button>
        </Box>

        <Divider sx={classes.SectionDivider} />

        <Box sx={classes.Section}>
          <Typography variant="h2" color="secondary" sx={classes.SectionTitle}>
            Enter License Number to print one permit
          </Typography>
          <TextField
            label="License Number"
            variant="outlined"
            fullWidth
            size="small"
            sx={classes.FieldBackground}
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={printingOne ? <CircularProgress size={16} color="inherit" /> : <PrintIcon />}
            onClick={handlePrintOne}
            disabled={printingOne}
            sx={classes.PrintButton}
          >
            {printingOne ? 'Printing…' : 'Print Permits'}
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default TemporaryPermits;
