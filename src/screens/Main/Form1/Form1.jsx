import InfoIcon from '@mui/icons-material/Info';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box, Button, CircularProgress, Grid, Tab, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import DocketDetailView from './components/DocketDetailView';
import Form1ActionsPanel from './components/Form1ActionsPanel';
import Form1InfoFields from './components/Form1InfoFields';
import TemporaryPermitSection from './components/TemporaryPermitSection';
import styles from './Form1Style';
import { useForm1Form } from './useForm1Form';

const Form1 = () => {
  const theme = useTheme();
  const classes = styles(theme);
  const [tab, setTab] = useState('1');
  const { docketId } = useParams();
  const location = useLocation();
  const { form, formErrors, saving, isSaved, createdByName, handleFieldChange, handleSave } =
    useForm1Form();

  // Opened from a search results row (see SearchResultsPage's onRowClick) -
  // show what that row already had instead of the "create new" form below.
  if (docketId) {
    return <DocketDetailView docketId={docketId} docket={location.state?.docket} />;
  }

  return (
    <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start">
      <Grid item xs={12} sx={classes.HeaderSection}>
        <Box sx={classes.HeaderContent}>
          <Typography component="h1" variant="h1" color="secondary">
            Enter New Form 1
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Created By: {createdByName}
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <TabContext value={tab}>
          <Box sx={classes.TabListContainer}>
            <TabList onChange={(_, newValue) => setTab(newValue)} aria-label="form1 tabs">
              <Tab
                icon={<InfoIcon fontSize="small" />}
                iconPosition="start"
                label="General Information"
                value="1"
              />
            </TabList>
          </Box>

          <TabPanel value="1" className="CustomTabPanel">
            <Grid container sx={classes.ContentContainer}>
              <Grid item xs={12} md={4} sx={classes.LeftPanel}>
                <Typography variant="h2" color="secondary" sx={classes.SectionTitle}>
                  OSAH Form 1 Information
                </Typography>
                <Form1InfoFields
                  form={form}
                  formErrors={formErrors}
                  onFieldChange={handleFieldChange}
                />

                <Box sx={classes.SectionSpacing}>
                  <TemporaryPermitSection
                    eligibleForPermit={form.eligibleForPermit}
                    onChange={(value) => handleFieldChange('eligibleForPermit', value)}
                    titleSx={classes.SectionTitle}
                  />
                </Box>

                <Grid container spacing={2.5} sx={classes.SectionSpacing}>
                  <Grid item xs={12} sm={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={handleSave}
                      disabled={saving}
                      startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
                    >
                      {saving ? 'Saving…' : 'Save'}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} md={8} sx={classes.RightPanel}>
                <Box sx={classes.RightPanelContent}>
                  <Form1ActionsPanel
                    disabled={!isSaved}
                    sectionTitleSx={classes.SectionTitle}
                    sectionSpacingSx={classes.SectionSpacing}
                  />
                </Box>
              </Grid>
            </Grid>
          </TabPanel>
        </TabContext>
      </Grid>
    </Grid>
  );
};

export default Form1;
