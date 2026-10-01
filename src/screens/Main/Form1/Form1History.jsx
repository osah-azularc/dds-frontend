import React from 'react';
import { Box, CircularProgress, Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { FORM1_CAPABILITIES, hasForm1Capability } from '../../../utilities/form1Capabilities';
import DocketHeaderInfo from './components/DocketHeaderInfo';
import DocketTabBar from './components/DocketTabBar';
import HistoryTable from './components/HistoryTable';
import useForm1New from './useForm1New';

/**
 * History tab screen (/form1/history/reqdt/:form1Id), reached from
 * DocketTabBar's "History" tab. Reuses useForm1New for the docket
 * header/tab bar data the same way Form1Notes.jsx does. Read-only -- see
 * HistoryTable.jsx's own docblock.
 *
 * Redirects to General Information for dds_superuser (OTHER_TABS_VIEW) --
 * DocketTabBar.jsx hides this tab for that usertype, this stops a direct
 * URL visit from bypassing it.
 */
const Form1History = () => {
  const { existingDocket, parties, loadingExisting } = useForm1New();
  const userType = useSelector((state) => state.user.user_type);
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
          activeTab="history"
          hasPetitioner={parties.some((party) => party.typeOfContact === 'Petitioner')}
        />
      </Grid>
      <Grid item xs={12}>
        <HistoryTable form1Id={existingDocket.form1Id} />
      </Grid>
    </Grid>
  );
};

export default Form1History;
