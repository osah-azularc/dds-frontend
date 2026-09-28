import React from 'react';
import { Box, CircularProgress, Grid } from '@mui/material';
import DocketHeaderInfo from './components/DocketHeaderInfo';
import DocketTabBar from './components/DocketTabBar';
import HistoryTable from './components/HistoryTable';
import useForm1New from './useForm1New';

/**
 * History tab screen (/form1/history/reqdt/:form1Id), reached from
 * DocketTabBar's "History" tab. Reuses useForm1New for the docket
 * header/tab bar data the same way Form1Notes.jsx does. Read-only -- see
 * HistoryTable.jsx's own docblock.
 */
const Form1History = () => {
  const { existingDocket, parties, loadingExisting } = useForm1New();

  if (loadingExisting || !existingDocket) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
        <CircularProgress />
      </Box>
    );
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
