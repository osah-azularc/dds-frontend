import React from 'react';
import { Box, Button, CircularProgress, Grid, Typography } from '@mui/material';
import { FormProvider } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { FORM1_CAPABILITIES, hasForm1Capability } from '../../../utilities/form1Capabilities';
import { useConfirmDialog } from '../../../hooks/useConfirmDialog';
import DocketHeaderInfo from './components/DocketHeaderInfo';
import DocketTabBar from './components/DocketTabBar';
import DriverRequestSection from './components/DriverRequestSection';
import IncidentInformationSection from './components/IncidentInformationSection';
import OfficerInformationSection from './components/OfficerInformationSection';
import useForm1205Form from './useForm1205Form';
import useForm1New from './useForm1New';

// Matches legacy's #form-submit-warning-popup exactly (form1-1205form.phtml) -- shown on
// every Submit click, before any validation runs (same as legacy: the popup itself never
// blocks on missing fields, only confirms intent; the fields-required check still happens
// once the popup's own Submit is clicked, see useForm1205Form.js's onSubmit).
const SUBMIT_CONFIRM_MESSAGE =
  'Are you sure you are ready to submit the Form 1 to OSAH? This form will not be editable once it is in review.';

/**
 * Form 1205 screen (/form1/1205form/reqdt/:form1Id), reached from
 * DocketTabBar's "Form 1205" tab -- only enabled once the docket has a
 * Petitioner (matches legacy's form1.phtml/form1-notes.phtml tab gating).
 * Save For Later only checks each field's own format rule; Submit
 * additionally requires every legacy-required field and marks the docket
 * sent to DPS (see useForm1205Form.js's own docblock for why these two
 * buttons deliberately don't share the same validation). The whole screen --
 * every field plus both buttons -- goes read-only once the docket is no
 * longer a Draft (`actualStatus` other than 'pending'), matching
 * DocketTabBar.jsx's own convention for when a docket counts as already
 * under OSAH review.
 */
const Form1205Form = () => {
  const { form, existingDocket, parties, loadingExisting, refetchAfterPartyChange } =
    useForm1New();
  const userType = useSelector((state) => state.user.user_type);
  const canEdit1205 = hasForm1Capability(userType, FORM1_CAPABILITIES.FORM1205_EDIT);
  const canSubmit1205 = hasForm1Capability(userType, FORM1_CAPABILITIES.FORM1205_SUBMIT);
  const canViewOtherTabs = hasForm1Capability(userType, FORM1_CAPABILITIES.OTHER_TABS_VIEW);
  const isReviewLocked = existingDocket?.actualStatus !== 'pending';
  const fieldsDisabled = isReviewLocked || !canEdit1205;
  const { showConfirmDialog, ConfirmDialog } = useConfirmDialog();
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
    locked: fieldsDisabled,
    // Re-fetches the docket after a successful Submit so actualStatus (no longer 'pending')
    // flips isReviewLocked/fieldsDisabled right away -- without this, Save For Later/Submit
    // stayed clickable until the user left and came back to this same screen, since
    // existingDocket was otherwise never refetched on this page after submitting.
    onSubmitted: refetchAfterPartyChange,
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
                    onClick={() =>
                      showConfirmDialog('Warning', SUBMIT_CONFIRM_MESSAGE, handleSubmitForm, 'Submit')
                    }
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
      <ConfirmDialog />
    </Grid>
  );
};

export default Form1205Form;
