import React from 'react';
import PropTypes from 'prop-types';
import { Button, CircularProgress, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { ELIGIBLE_PERMIT_OPTIONS } from '../constants';
import Form1DatePicker from './Form1DatePicker';

const FIELD_SX = { '& .MuiOutlinedInput-root': { backgroundColor: '#fff' } };

/**
 * "Temporary Permit" panel — shared by the "Enter New Form 1" screen and
 * the read-only existing-docket review. Fields only appear once "Eligible
 * for a Permit?" is Yes, matching the legacy DDS portal's
 * form1-new.phtml/form1.phtml (`ng-hide="elgpermit == 0"`).
 *
 * Unlike the rest of the existing-docket review screen, this section stays
 * editable even when reviewing an existing docket — legacy's form1.phtml
 * puts no `ng-disabled`/readonly_flag guard on Eligible for a Permit?/
 * Effective Date/DOB/Incident Date, only on the auto-computed Permit
 * Expiration Date (a plain HTML `disabled` attribute there, so it's always
 * disabled — not conditional, despite the look of the legacy markup).
 * On the existing-docket review screen, a "Save" button posts these fields
 * to dds-form1/updatedocket (ports DdsForm1Controller::updatedocketAction's
 * Temporary Permit portion) — the "Enter New Form 1" create flow saves
 * this section as part of its own overall Save button instead, so
 * showSaveButton/saving/onSave are only passed for the existing-docket case.
 */
const TemporaryPermitSection = ({
  form,
  onFieldChange,
  onEligiblePermitChange,
  onEffectiveDateChange,
  today,
  showSaveButton,
  saving,
  onSave,
  errors,
}) => {
  const isEligible = form.eligiblePermit === '1';

  return (
    <>
      <Typography variant="h2" color="secondary" sx={{ mt: 3, mb: 2 }}>
        Temporary Permit
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="Eligible for a Permit?"
            fullWidth
            size="small"
            value={form.eligiblePermit}
            onChange={(e) => onEligiblePermitChange(e.target.value)}
            sx={FIELD_SX}
          >
            {ELIGIBLE_PERMIT_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {isEligible && (
          <>
            <Grid item xs={12} sm={6}>
              <Form1DatePicker
                label="Permit Effective Date *"
                value={form.permitEffectiveDate}
                onChange={onEffectiveDateChange}
                error={Boolean(errors.permitEffectiveDate)}
                helperText={errors.permitEffectiveDate}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Form1DatePicker
                label="Permit Expiration Date *"
                value={form.permitExpiryDate}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Form1DatePicker
                label="Date of Birth *"
                value={form.dob}
                onChange={(value) => onFieldChange({ dob: value })}
                maxDate={today()}
                error={Boolean(errors.dob)}
                helperText={errors.dob}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Form1DatePicker
                label="Incident Date *"
                value={form.incidentDate}
                onChange={(value) => onFieldChange({ incidentDate: value })}
                error={Boolean(errors.incidentDate)}
                helperText={errors.incidentDate}
              />
            </Grid>
          </>
        )}
      </Grid>

      {showSaveButton && (
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <Button
              fullWidth
              onClick={onSave}
              disabled={saving}
              startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
            >
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </Grid>
        </Grid>
      )}
    </>
  );
};

const formPropType = PropTypes.shape({
  eligiblePermit: PropTypes.string,
  permitEffectiveDate: PropTypes.object,
  permitExpiryDate: PropTypes.object,
  dob: PropTypes.object,
  incidentDate: PropTypes.object,
});

TemporaryPermitSection.propTypes = {
  form: formPropType.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onEligiblePermitChange: PropTypes.func.isRequired,
  onEffectiveDateChange: PropTypes.func.isRequired,
  today: PropTypes.func.isRequired,
  showSaveButton: PropTypes.bool,
  saving: PropTypes.bool,
  onSave: PropTypes.func,
  // Inline validation errors (keyed by permitEffectiveDate/dob/incidentDate) -- rendered as
  // each field's own error/helperText instead of a warning snackbar, see useForm1New.js's
  // validatePermitFields.
  errors: PropTypes.shape({
    permitEffectiveDate: PropTypes.string,
    dob: PropTypes.string,
    incidentDate: PropTypes.string,
  }),
};

TemporaryPermitSection.defaultProps = {
  showSaveButton: false,
  saving: false,
  onSave: undefined,
  errors: {},
};

export default React.memo(TemporaryPermitSection);
