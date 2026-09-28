import React from 'react';
import { Box, CircularProgress, Grid } from '@mui/material';
import DocketHeaderInfo from './components/DocketHeaderInfo';
import DocketTabBar from './components/DocketTabBar';
import NotesTable from './components/NotesTable';
import useForm1New from './useForm1New';

/**
 * Notes tab screen (/form1/notes/reqdt/:form1Id), reached from
 * DocketTabBar's "Notes" tab. Reuses useForm1New for the docket header/tab
 * bar data (existingDocket/parties) the same way Form1.jsx does -- this
 * screen only needs the read side of that hook.
 */
const Form1Notes = () => {
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
          activeTab="notes"
          hasPetitioner={parties.some((party) => party.typeOfContact === 'Petitioner')}
        />
      </Grid>
      <Grid item xs={12}>
        <NotesTable
          form1Id={existingDocket.form1Id}
          canAddEdit={existingDocket.actualStatus === 'pending'}
        />
      </Grid>
    </Grid>
  );
};

export default Form1Notes;
