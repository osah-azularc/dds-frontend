import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Grid, Tab, Tabs, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import GeneralInformationForm from './components/GeneralInformationForm';
import DocumentPartyPanel from './components/DocumentPartyPanel';
import useForm1New from './useForm1New';

/**
 * "Enter New Form 1" screen — DDS's own agency-facing Form 1 submission.
 * Cross-checked against the legacy DDS portal's form1-new.phtml/
 * form1-new-controller.js (see CLAUDE.md's DDS reference-source list).
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
  } = useForm1New();

  const createdBy = [firstName, lastName].filter(Boolean).join(' ');

  return (
    <Box>
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

      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
        <Tabs value={0}>
          <Tab
            icon={<InfoOutlinedIcon fontSize="small" />}
            iconPosition="start"
            label="General Information"
          />
        </Tabs>
      </Box>

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
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <DocumentPartyPanel />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Form1;
