import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import {
  CHEMICAL_TEST_OPTIONS,
  COUNTY_OPTIONS,
  GENDER_OPTIONS,
  HEIGHT_FEET_OPTIONS,
  HEIGHT_INCHES_OPTIONS,
  OFFICER_CONTACT_TYPE_OPTIONS,
  US_STATE_OPTIONS,
} from '../constants/form1Constants';
import { useForm1205 } from '../useForm1205';
import Form1DatePicker from './Form1DatePicker';
import Form1SelectField from './Form1SelectField';
import Form1TimePicker from './Form1TimePicker';

const FIELD_SX = { '& .MuiOutlinedInput-root': { backgroundColor: '#fff' } };

const YesNoRadioGroup = ({
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  row = true,
}) => (
  <Box>
    <Typography variant="body2" sx={{ mb: 0.5 }}>
      {label}
      {required ? '*' : ''}
    </Typography>
    <RadioGroup row={row} value={value} onChange={(e) => onChange(e.target.value)}>
      <FormControlLabel
        value="yes"
        control={<Radio disabled={disabled} />}
        label="Yes"
        disabled={disabled}
      />
      <FormControlLabel
        value="no"
        control={<Radio disabled={disabled} />}
        label="No"
        disabled={disabled}
      />
    </RadioGroup>
  </Box>
);

YesNoRadioGroup.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  row: PropTypes.bool,
};


/**
 * Form 1205 tab content (see DocketDetailView's tab panels) - the DDS/Form1
 * ALS citation intake form: Incident Information (citation, driver/vehicle
 * details, chemical-test result) and Officer Information (the requesting
 * officer's contact + address), mirroring the OSAH ecourt app's Form 1205.
 *
 * There's no Form 1205 endpoint yet, so this only owns local field state -
 * see useForm1205 for the TODO on wiring it up once one exists.
 */
const Form1205Panel = ({ classes }) => {
  const {
    form,
    handleFieldChange,
    saving,
    submitting,
    handleSaveForLater,
    handleSubmit,
    isExistingParty,
  } = useForm1205();

  return (
    <Box sx={{ p: 3, backgroundColor: '#fff' }}>
      <Typography variant="h2" color="secondary" sx={classes.SectionTitle}>
        Incident Information
      </Typography>
      <Grid container spacing={2.5}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Citation #*"
            variant="outlined"
            fullWidth
            size="small"
            sx={FIELD_SX}
            value={form.citationNumber}
            onChange={(e) => handleFieldChange('citationNumber', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Form1SelectField
            label="County of Occurrence*"
            options={COUNTY_OPTIONS}
            value={form.countyOfOccurrence}
            onChange={(value) => handleFieldChange('countyOfOccurrence', value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Form1DatePicker
            label="Incident Date*"
            value={form.incidentDate}
            onChange={(value) => handleFieldChange('incidentDate', value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Form1TimePicker
            label="Incident Time"
            value={form.incidentTime}
            onChange={(value) => handleFieldChange('incidentTime', value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Officer Badge Number"
            variant="outlined"
            fullWidth
            size="small"
            sx={FIELD_SX}
            value={form.officerBadgeNumber}
            onChange={(e) => handleFieldChange('officerBadgeNumber', e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <YesNoRadioGroup
            label="Commercial Vehicle?"
            value={form.commercialVehicle}
            onChange={(value) => handleFieldChange('commercialVehicle', value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <YesNoRadioGroup
            label="Hazardous Materials?"
            value={form.hazardousMaterials}
            onChange={(value) => handleFieldChange('hazardousMaterials', value)}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Form1SelectField
            label="State of Issue"
            options={US_STATE_OPTIONS}
            value={form.stateOfIssue}
            onChange={(value) => handleFieldChange('stateOfIssue', value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="License Class"
            variant="outlined"
            fullWidth
            size="small"
            sx={FIELD_SX}
            value={form.licenseClass}
            onChange={(e) => handleFieldChange('licenseClass', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Form1DatePicker
            label="Date of Birth*"
            value={form.dateOfBirth}
            onChange={(value) => handleFieldChange('dateOfBirth', value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Restrictions"
            variant="outlined"
            fullWidth
            size="small"
            sx={FIELD_SX}
            value={form.restrictions}
            onChange={(e) => handleFieldChange('restrictions', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Form1SelectField
            label="Gender"
            options={GENDER_OPTIONS}
            value={form.gender}
            onChange={(value) => handleFieldChange('gender', value)}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Form1SelectField
                label="Feet"
                options={HEIGHT_FEET_OPTIONS}
                value={form.heightFeet}
                onChange={(value) => handleFieldChange('heightFeet', value)}
              />
            </Grid>
            <Grid item xs={6}>
              <Form1SelectField
                label="Inches"
                options={HEIGHT_INCHES_OPTIONS}
                value={form.heightInches}
                onChange={(value) => handleFieldChange('heightInches', value)}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Weight"
            variant="outlined"
            fullWidth
            size="small"
            sx={FIELD_SX}
            value={form.weight}
            onChange={(e) => handleFieldChange('weight', e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            Driver was requested to submit test and:*
          </Typography>
          <RadioGroup
            value={form.testRequestResult}
            onChange={(e) => handleFieldChange('testRequestResult', e.target.value)}
          >
            {CHEMICAL_TEST_OPTIONS.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio />}
                label={option.label}
              />
            ))}
          </RadioGroup>
        </Grid>
      </Grid>

      <Box sx={classes.SectionSpacing}>
        <Typography variant="h2" color="secondary" sx={classes.SectionTitle}>
          Officer Information
        </Typography>
        <Grid container spacing={2.5}>
          <Grid item xs={12}>
            <YesNoRadioGroup
              label="Is this a new party or new address?"
              value={form.isNewPartyOrAddress}
              onChange={(value) => handleFieldChange('isNewPartyOrAddress', value)}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Form1SelectField
              label="Contact Type*"
              options={OFFICER_CONTACT_TYPE_OPTIONS}
              value={form.contactType}
              onChange={(value) => handleFieldChange('contactType', value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Last Name*"
              variant="outlined"
              fullWidth
              size="small"
              sx={FIELD_SX}
              value={form.lastName}
              onChange={(e) => handleFieldChange('lastName', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="First Name*"
              variant="outlined"
              fullWidth
              size="small"
              sx={FIELD_SX}
              value={form.firstName}
              onChange={(e) => handleFieldChange('firstName', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Middle Name"
              variant="outlined"
              fullWidth
              size="small"
              sx={FIELD_SX}
              value={form.middleName}
              onChange={(e) => handleFieldChange('middleName', e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Precinct*"
              variant="outlined"
              fullWidth
              size="small"
              disabled={isExistingParty}
              sx={FIELD_SX}
              value={form.precinct}
              onChange={(e) => handleFieldChange('precinct', e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <YesNoRadioGroup
              label="Does the Officer belong to Georgia State Patrol or Georgia Department of Public Safety?"
              value={form.belongsToGspOrDps}
              onChange={(value) => handleFieldChange('belongsToGspOrDps', value)}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Address"
              variant="outlined"
              fullWidth
              size="small"
              disabled={isExistingParty}
              sx={FIELD_SX}
              value={form.address}
              onChange={(e) => handleFieldChange('address', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="City*"
              variant="outlined"
              fullWidth
              size="small"
              sx={FIELD_SX}
              value={form.city}
              onChange={(e) => handleFieldChange('city', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Form1SelectField
              label="State*"
              options={US_STATE_OPTIONS}
              value={form.state}
              onChange={(value) => handleFieldChange('state', value)}
              disabled={isExistingParty}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Zip Code*"
              variant="outlined"
              fullWidth
              size="small"
              disabled={isExistingParty}
              sx={FIELD_SX}
              value={form.zipCode}
              onChange={(e) => handleFieldChange('zipCode', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Phone"
              variant="outlined"
              fullWidth
              size="small"
              sx={FIELD_SX}
              value={form.phone}
              onChange={(e) => handleFieldChange('phone', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              size="small"
              sx={FIELD_SX}
              value={form.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Fax"
              variant="outlined"
              fullWidth
              size="small"
              sx={FIELD_SX}
              value={form.fax}
              onChange={(e) => handleFieldChange('fax', e.target.value)}
            />
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={2} sx={classes.SectionSpacing}>
        <Grid item xs={12} sm="auto">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveForLater}
            disabled={saving || submitting}
            startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
            sx={{ minWidth: 180 }}
          >
            {saving ? 'Saving…' : 'Save For Later'}
          </Button>
        </Grid>
        <Grid item xs={12} sm="auto">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={saving || submitting}
            startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null}
            sx={{ minWidth: 180 }}
          >
            {submitting ? 'Submitting…' : 'Submit'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

Form1205Panel.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default Form1205Panel;
