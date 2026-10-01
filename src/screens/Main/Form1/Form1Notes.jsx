import React from 'react';
import { Box, CircularProgress, Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { FORM1_CAPABILITIES, hasForm1Capability } from '../../../utilities/form1Capabilities';
import DocketHeaderInfo from './components/DocketHeaderInfo';
import DocketTabBar from './components/DocketTabBar';
import NotesTable from './components/NotesTable';
import useForm1New from './useForm1New';

/**
 * Notes tab screen (/form1/notes/reqdt/:form1Id), reached from
 * DocketTabBar's "Notes" tab. Reuses useForm1New for the docket header/tab
 * bar data (existingDocket/parties) the same way Form1.jsx does -- this
 * screen only needs the read side of that hook.
 *
 * Redirects to General Information for dds_superuser (OTHER_TABS_VIEW) --
 * DocketTabBar.jsx hides this tab for that usertype, this stops a direct
 * URL visit from bypassing it.
 */
const Form1Notes = () => {
  const { existingDocket, parties, loadingExisting } = useForm1New();
  const userType = useSelector((state) => state.user.user_type);
  const canManageNotes = hasForm1Capability(userType, FORM1_CAPABILITIES.NOTES_MANAGE);
  const canViewOtherTabs = hasForm1Capability(userType, FORM1_CAPABILITIES.OTHER_TABS_VIEW);

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
          activeTab="notes"
          hasPetitioner={parties.some((party) => party.typeOfContact === 'Petitioner')}
        />
      </Grid>
      <Grid item xs={12}>
        <NotesTable
          form1Id={existingDocket.form1Id}
          canAddEdit={existingDocket.actualStatus === 'pending' && canManageNotes}
          canManage={canManageNotes}
        />
      </Grid>
    </Grid>
  );
};

export default Form1Notes;
