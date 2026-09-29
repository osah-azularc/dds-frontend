import React from 'react';
import PropTypes from 'prop-types';
import { Grid, TextField, Typography } from '@mui/material';
import Form1DatePicker from './Form1DatePicker';

const FIELD_SX = { '& .MuiOutlinedInput-root': { backgroundColor: '#fff' } };

/**
 * "Hearing Information" panel shown when reviewing an existing docket
 * (/form1/reqdt/:form1Id). Judge/CMA/hearing site are assigned by OSAH staff
 * after submission, so this only ever has data once a docket is approved —
 * matches the legacy DDS portal's form1.phtml Hearing Information block,
 * all fields disabled there too (agencies can't edit hearing assignment).
 *
 * Hearing Date renders through Form1DatePicker (disabled) rather than a
 * plain TextField with a manually-formatted string -- it used to show
 * MM-DD-YYYY with no calendar icon while Form 1205's date fields
 * (FormDateField) show MUI's default format with a calendar icon in a
 * clickable IconButton. Form1DatePicker matches that exactly.
 */
const HearingInformationSection = ({
  hearingSite,
  hearingDate,
  hearingTime,
  judge,
  judgeAssistant,
}) => (
  <>
    <Typography variant="h2" color="secondary" sx={{ mt: 3, mb: 2 }}>
      Hearing Information
    </Typography>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          label="Location"
          fullWidth
          size="small"
          value={hearingSite}
          disabled
          sx={FIELD_SX}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Form1DatePicker label="Hearing Date" value={hearingDate} disabled />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Hearing Time"
          fullWidth
          size="small"
          value={hearingTime}
          disabled
          sx={FIELD_SX}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField label="Judge" fullWidth size="small" value={judge} disabled sx={FIELD_SX} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Judge Assistant"
          fullWidth
          size="small"
          value={judgeAssistant}
          disabled
          sx={FIELD_SX}
        />
      </Grid>
    </Grid>
  </>
);

HearingInformationSection.propTypes = {
  hearingSite: PropTypes.string,
  hearingDate: PropTypes.object,
  hearingTime: PropTypes.string,
  judge: PropTypes.string,
  judgeAssistant: PropTypes.string,
};

HearingInformationSection.defaultProps = {
  hearingSite: '',
  hearingDate: null,
  hearingTime: '',
  judge: '',
  judgeAssistant: '',
};

export default React.memo(HearingInformationSection);
