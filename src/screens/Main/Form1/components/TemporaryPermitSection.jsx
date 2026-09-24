import { Box, Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { PERMIT_ELIGIBLE_OPTIONS } from '../constants/form1Constants';
import Form1SelectField from './Form1SelectField';

const TemporaryPermitSection = ({ eligibleForPermit, onChange, titleSx }) => (
  <Box>
    <Typography variant="h2" color="secondary" sx={titleSx}>
      Temporary Permit
    </Typography>
    <Grid container spacing={2.5}>
      <Grid item xs={12} sm={6}>
        <Form1SelectField
          label="Eligible for a Permit?"
          options={PERMIT_ELIGIBLE_OPTIONS}
          value={eligibleForPermit}
          onChange={onChange}
        />
      </Grid>
    </Grid>
  </Box>
);

TemporaryPermitSection.propTypes = {
  eligibleForPermit: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  titleSx: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default TemporaryPermitSection;
