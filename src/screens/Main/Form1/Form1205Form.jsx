import React from 'react';
import { Box, Button, CircularProgress, Grid, Typography } from '@mui/material';
import { FormProvider } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { FORM1_CAPABILITIES, hasForm1Capability } from '../../../utilities/form1Capabilities';
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
  const userType = useSelector((state) => state.user.user_type);
  const canEdit1205 = hasForm1Capability(userType, FORM1_CAPABILITIES.FORM1205_EDIT);
  const canSubmit1205 = hasForm1Capability(userType, FORM1_CAPABILITIES.FORM1205_SUBMIT);
  const canViewOtherTabs = hasForm1Capability(userType, FORM1_CAPABILITIES.OTHER_TABS_VIEW);
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

  if (!canViewOtherTabs) {
    return <Navigate to={`/form1/reqdt/${existingDocket.form1Id}`} replace />;
  }

  const isReviewLocked = existingDocket.actualStatus !== 'pending';
  const fieldsDisabled = isReviewLocked || !canEdit1205;

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
                disabled={fieldsDisabled}
              />
              <DriverRequestSection disabled={fieldsDisabled} />
              <OfficerInformationSection
                control={formMethods.control}
                stateOptions={stateOptions}
                locked={fieldsDisabled}
              />

              <Grid container spacing={2} sx={{ mt: 4 }}>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">
                    * Required Fields
                  </Typography>
                </Grid>
                <Grid item xs={12} sm="auto">
                  <Button
                    color="secondary"
                    onClick={handleSave}
                    disabled={saving || fieldsDisabled}
                    startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
                    sx={{ minWidth: 180 }}
                  >
                    Save For Later
                  </Button>
                </Grid>
                <Grid item xs={12} sm="auto">
                  <Button
                    onClick={handleSubmitForm}
                    disabled={saving || isReviewLocked || !canSubmit1205}
                    startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
                    sx={{ minWidth: 180 }}
                  >
                    Submit
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
