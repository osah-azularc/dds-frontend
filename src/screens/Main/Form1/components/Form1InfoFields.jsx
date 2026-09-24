import { Grid, TextField } from '@mui/material';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import {
  AGENCY_CODE_OPTIONS,
  CASE_TYPE_OPTIONS,
  COUNTY_OPTIONS,
  HEARING_TYPE_OPTIONS,
} from '../constants/form1Constants';
import Form1DatePicker from './Form1DatePicker';
import Form1SelectField from './Form1SelectField';

const FIELD_SX = { '& .MuiOutlinedInput-root': { backgroundColor: '#fff' } };

const Form1InfoFields = ({ form, formErrors, onFieldChange }) => (
  <Grid container spacing={2.5}>
    <Grid item xs={12} sm={6}>
      <Form1SelectField
        label="Agency Code *"
        options={AGENCY_CODE_OPTIONS}
        value={form.agencyCode}
        onChange={(value) => onFieldChange('agencyCode', value)}
        error={!!formErrors.agencyCode}
        helperText={formErrors.agencyCode ?? ''}
      />
    </Grid>

    <Grid item xs={12} sm={6}>
      <Form1SelectField
        label="Case Type *"
        options={CASE_TYPE_OPTIONS}
        value={form.caseType}
        onChange={(value) => onFieldChange('caseType', value)}
        error={!!formErrors.caseType}
        helperText={formErrors.caseType ?? ''}
      />
    </Grid>

    <Grid item xs={12} sm={6}>
      <Form1SelectField
        label="County"
        options={COUNTY_OPTIONS}
        value={form.county}
        onChange={(value) => onFieldChange('county', value)}
      />
    </Grid>

    <Grid item xs={12} sm={6}>
      <Form1DatePicker
        label="Date Requested *"
        value={form.dateRequested}
        onChange={(value) => onFieldChange('dateRequested', value)}
        maxDate={dayjs()}
        error={!!formErrors.dateRequested}
        helperText={formErrors.dateRequested ?? ''}
      />
    </Grid>

    <Grid item xs={12} sm={6}>
      <TextField
        label="Agency Ref Number*"
        variant="outlined"
        fullWidth
        size="small"
        sx={FIELD_SX}
        value={form.agencyRefNumber}
        onChange={(e) => onFieldChange('agencyRefNumber', e.target.value)}
        error={!!formErrors.agencyRefNumber}
        helperText={formErrors.agencyRefNumber ?? ''}
      />
    </Grid>

    <Grid item xs={12} sm={6}>
      <Form1SelectField
        label="Hearing Type"
        options={HEARING_TYPE_OPTIONS}
        value={form.hearingType}
        onChange={(value) => onFieldChange('hearingType', value)}
      />
    </Grid>
  </Grid>
);

Form1InfoFields.propTypes = {
  form: PropTypes.object.isRequired,
  formErrors: PropTypes.object,
  onFieldChange: PropTypes.func.isRequired,
};

Form1InfoFields.defaultProps = {
  formErrors: {},
};

export default Form1InfoFields;
