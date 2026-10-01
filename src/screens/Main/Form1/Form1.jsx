import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import { FORM1_CAPABILITIES, hasForm1Capability } from '../../../utilities/form1Capabilities';
import GeneralInformationForm from './components/GeneralInformationForm';
import DocumentPartyPanel from './components/DocumentPartyPanel';
import DocketHeaderInfo from './components/DocketHeaderInfo';
import DocketTabBar from './components/DocketTabBar';
import useForm1New from './useForm1New';

/**
 * "Enter New Form 1" screen — DDS's own agency-facing Form 1 submission.
 * Also reused, read-only, for both existing-docket review entry points (appRoutes.jsx):
 *   - /form1/reqdt/:form1Id — the regular DDS clerk/helpdesk flow
 *   - /docket/reqdt/:caseId — dds_superuser's docket click (a superuser search result has
 *     no form1Id to look up through the Form1 flow, so useForm1New looks the case up
 *     directly in the `docket` table instead -- see useSuperuserDocketData.js)
 * useForm1New loads whichever docket's data applies instead of starting blank when a
 * form1Id/caseId route param is present.
 * Cross-checked against the legacy DDS portal's form1-new.phtml/
 * form1-new-controller.js and form1.phtml (existing-docket review) — see
 * CLAUDE.md's DDS reference-source list.
 *
 * The "create new" flow (no form1Id) redirects roles without
 * HOME_FORM1_CREATE (helpdesk/superuser) straight back to Home -- Home.jsx
 * already disables/hides that entry point, but this route guard stops a
 * direct URL visit from bypassing it, which legacy itself never enforced
 * (see docs/dds-legacy-usertype-permissions.md's "Enter New Form 1" section).
 */
const Form1 = () => {
  const { firstName, lastName } = useSelector((state) => state.user);
  const userType = useSelector((state) => state.user.user_type);
  const canCreateForm1 = hasForm1Capability(userType, FORM1_CAPABILITIES.HOME_FORM1_CREATE);
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
    isSuperuserView,
    caseId,
    existingDocket,
    parties,
    documents,
    disposition,
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

  if (!isExisting && !canCreateForm1) {
    return <Navigate to="/home" replace />;
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
              isSuperuserView={isSuperuserView}
              caseId={caseId}
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
              // Temporary Permit eligibility is a Form1-specific workflow with no `docket`-
              // table source (see useForm1New.js) -- not applicable at all for
              // dds_superuser's docket-detail view, so the whole section (and its save
              // action, for the regular clerk existing-docket review that does keep it) is
              // suppressed there.
              showPermitSave={isSuperuserView ? false : undefined}
              showTemporaryPermit={!isSuperuserView}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <DocumentPartyPanel
              parties={parties}
              documents={documents}
              disposition={disposition}
              docketStatus={existingDocket?.status}
              form1Id={isExisting ? existingDocket?.form1Id : undefined}
              licenseNumberDefault={existingDocket?.agencyRefNumber}
              onPartyChanged={refetchAfterPartyChange}
              locked={isSuperuserView || (isExisting && existingDocket?.actualStatus !== 'pending')}
              viewOnly={isSuperuserView}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Form1;
