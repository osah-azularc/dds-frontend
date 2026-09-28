import React from 'react';
import { useSelector } from 'react-redux';
import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import GeneralInformationForm from './components/GeneralInformationForm';
import DocumentPartyPanel from './components/DocumentPartyPanel';
import DocketHeaderInfo from './components/DocketHeaderInfo';
import DocketTabBar from './components/DocketTabBar';
import useForm1New from './useForm1New';

/**
 * "Enter New Form 1" screen — DDS's own agency-facing Form 1 submission.
 * Also reused, read-only, to review an existing docket at
 * /form1/reqdt/:form1Id (reached by clicking a row in Docket Search) —
 * useForm1New loads that docket's data instead of starting blank when a
 * form1Id route param is present.
 * Cross-checked against the legacy DDS portal's form1-new.phtml/
 * form1-new-controller.js and form1.phtml (existing-docket review) — see
 * CLAUDE.md's DDS reference-source list.
 */
const Form1 = () => {
  const { firstName, lastName } = useSelector((state) => state.user);
  const {
    form,
    countyList,
    countyListLoading,
    saving,
    handleFieldChange,
    handleEligiblePermitChange,
    handleEffectiveDateChange,
    handleSave,
    isExisting,
    existingDocket,
    parties,
    loadingExisting,
    updatingPermit,
    handleUpdatePermit,
    refetchAfterPartyChange,
  } = useForm1New();

  const createdBy = [firstName, lastName].filter(Boolean).join(' ');

  if (loadingExisting) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container>
      {isExisting && existingDocket ? (
        <>
          <DocketHeaderInfo existingDocket={existingDocket} parties={parties} />
          <Grid item xs={12}>
            <DocketTabBar
              status={existingDocket.status}
              actualStatus={existingDocket.actualStatus}
              form1Id={existingDocket.form1Id}
              hasPetitioner={parties.some((party) => party.typeOfContact === 'Petitioner')}
            />
          </Grid>
        </>
      ) : (
        <Grid item xs={12}>
          <Box
            sx={{
              px: 3,
              py: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h1">Enter New Form 1</Typography>
            {createdBy && (
              <Typography variant="body2">
                <strong>Created By:</strong> {createdBy}
              </Typography>
            )}
          </Box>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }} />
        </Grid>
      )}

      <Grid item xs={12}>
        <Grid container sx={{ backgroundColor: '#f1f1f1' }}>
          <Grid item xs={12} md={4}>
            <GeneralInformationForm
              form={form}
              countyList={countyList}
              countyListLoading={countyListLoading}
              saving={saving}
              onFieldChange={handleFieldChange}
              onEligiblePermitChange={handleEligiblePermitChange}
              onEffectiveDateChange={handleEffectiveDateChange}
              onSave={handleSave}
              readOnly={isExisting}
              updatingPermit={updatingPermit}
              onUpdatePermit={handleUpdatePermit}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <DocumentPartyPanel
              parties={parties}
              form1Id={isExisting ? existingDocket?.form1Id : undefined}
              licenseNumberDefault={existingDocket?.agencyRefNumber}
              onPartyChanged={refetchAfterPartyChange}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Form1;
