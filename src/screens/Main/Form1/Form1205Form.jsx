import React from 'react';
import { Box, Button, CircularProgress, Grid, Typography } from '@mui/material';
import { FormProvider } from 'react-hook-form';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import DocketHeaderInfo from './components/DocketHeaderInfo';
import DocketTabBar from './components/DocketTabBar';
import DriverRequestSection from './components/DriverRequestSection';
import IncidentInformationSection from './components/IncidentInformationSection';
import OfficerInformationSection from './components/OfficerInformationSection';
import useForm1205Form from './useForm1205Form';
import useForm1New from './useForm1New';

/**
 * Form 1205 screen (/form1/1205form/reqdt/:form1Id), reached from
 * DocketTabBar's "Form 1205" tab -- only enabled once the docket has a
 * Petitioner (matches legacy's form1.phtml/form1-notes.phtml tab gating).
 * Save For Later/Submit validate (see form1205ValidationRules.js) then save
 * both sections (see useForm1205Form.js); Submit additionally marks the
 * docket sent to DPS. The whole screen -- every field plus both buttons --
 * goes read-only once the docket is no longer a Draft (`actualStatus`
 * other than 'pending'), matching DocketTabBar.jsx's own convention for
 * when a docket counts as already under OSAH review.
 */
const Form1205Form = () => {
  const { form, existingDocket, parties, loadingExisting } = useForm1New();
  const {
    formMethods,
    countyList,
    countyListLoading,
    stateOptions,
    saving,
    today,
    handleSave,
    handleSubmitForm,
  } = useForm1205Form({
    form1Id: existingDocket?.form1Id,
    prefill: { dob: form.dob, incidentDate: form.incidentDate, county: form.county },
  });

  if (loadingExisting || !existingDocket) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  const isReviewLocked = existingDocket.actualStatus !== 'pending';

  return (
    <Grid container>
      <DocketHeaderInfo existingDocket={existingDocket} parties={parties} />
      <Grid item xs={12}>
        <DocketTabBar
          status={existingDocket.status}
          actualStatus={existingDocket.actualStatus}
          form1Id={existingDocket.form1Id}
          activeTab="form1205"
          hasPetitioner={parties.some((party) => party.typeOfContact === 'Petitioner')}
        />
      </Grid>
      <Grid item xs={12}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={{ backgroundColor: '#fff', p: 3 }}>
            <FormProvider {...formMethods}>
              <IncidentInformationSection
                countyList={countyList}
                countyListLoading={countyListLoading}
                stateOptions={stateOptions}
                today={today}
                disabled={isReviewLocked}
              />
              <DriverRequestSection disabled={isReviewLocked} />
              <OfficerInformationSection
                control={formMethods.control}
                stateOptions={stateOptions}
                locked={isReviewLocked}
              />

              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">
                    * Required Fields
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    color="secondary"
                    fullWidth
                    onClick={handleSave}
                    disabled={saving || isReviewLocked}
                  >
                    {saving ? <CircularProgress size={20} /> : 'Save For Later'}
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button fullWidth onClick={handleSubmitForm} disabled={saving || isReviewLocked}>
                    {saving ? <CircularProgress size={20} /> : 'Submit'}
                  </Button>
                </Grid>
              </Grid>
            </FormProvider>
          </Box>
        </LocalizationProvider>
      </Grid>
    </Grid>
  );
};

export default Form1205Form;
