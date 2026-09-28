import React from 'react';
import PropTypes from 'prop-types';
import { Grid, TextField, Typography } from '@mui/material';

const FIELD_SX = { '& .MuiOutlinedInput-root': { backgroundColor: '#fff' } };

/**
 * "Hearing Information" panel shown when reviewing an existing docket
 * (/form1/reqdt/:form1Id). Judge/CMA/hearing site are assigned by OSAH staff
 * after submission, so this only ever has data once a docket is approved —
 * matches the legacy DDS portal's form1.phtml Hearing Information block,
 * all fields disabled there too (agencies can't edit hearing assignment).
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
        <TextField
          label="Hearing Date"
          fullWidth
          size="small"
          value={hearingDate}
          disabled
          sx={FIELD_SX}
        />
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
  hearingDate: PropTypes.string,
  hearingTime: PropTypes.string,
  judge: PropTypes.string,
  judgeAssistant: PropTypes.string,
};

HearingInformationSection.defaultProps = {
  hearingSite: '',
  hearingDate: '',
  hearingTime: '',
  judge: '',
  judgeAssistant: '',
};

export default React.memo(HearingInformationSection);
