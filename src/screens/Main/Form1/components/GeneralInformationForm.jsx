import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import SingleSelectFilter from '../../../../components/common/SingleSelectFilter';
import { AGENCY_CODE, CASE_TYPE, HEARING_TYPE, ELIGIBLE_PERMIT_OPTIONS } from '../constants';

// AdapterDayjs's isValid()/isAfter() etc. expect a dayjs instance, not a
// native Date -- passing a plain `new Date()` as maxDate throws
// "value.isValid is not a function" and crashes the whole tree (no error
// boundary above this screen), which is what showed up as a blank page.
const today = () => dayjs();

// Keeps input boxes white against the panel's gray background, matching
// ecourt-frontend's DocketInfoFields.jsx / DocketDatePicker.jsx.
const FIELD_SX = { '& .MuiOutlinedInput-root': { backgroundColor: '#fff' } };
const datePickerSlotProps = { textField: { fullWidth: true, size: 'small', sx: FIELD_SX } };

/**
 * "OSAH Form 1 Information" panel — the left column of the "Enter New
 * Form 1" screen. Field set matches the legacy DDS portal's
 * form1-new.phtml exactly: Agency Code/Case Type are fixed single-option
 * dropdowns, Hearing Type is a disabled placeholder, and the Temporary
 * Permit fields only appear once "Eligible for a Permit?" is Yes.
 * Section header/typography/field styling mirrors ecourt-frontend's
 * DocketInfoFields.jsx / DocumentFileManagement.jsx conventions.
 */
const GeneralInformationForm = ({
  form,
  countyList,
  countyListLoading,
  saving,
  onFieldChange,
  onEligiblePermitChange,
  onEffectiveDateChange,
  onSave,
}) => {
  const isEligible = form.eligiblePermit === '1';

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h2" color="secondary" sx={{ mb: 2 }}>
          OSAH Form 1 Information
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Agency Code *"
              fullWidth
              size="small"
              value={AGENCY_CODE}
              sx={FIELD_SX}
            >
              <MenuItem value={AGENCY_CODE}>{AGENCY_CODE}</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Case Type *"
              fullWidth
              size="small"
              value={CASE_TYPE}
              sx={FIELD_SX}
            >
              <MenuItem value={CASE_TYPE}>{CASE_TYPE}</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <SingleSelectFilter
              label="County"
              options={countyList}
              value={form.county}
              onChange={(value) => onFieldChange({ county: value })}
              loading={countyListLoading}
              sx={FIELD_SX}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Date Requested *"
              value={form.dateRequested}
              onChange={(value) => onFieldChange({ dateRequested: value })}
              maxDate={today()}
              slotProps={datePickerSlotProps}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Agency Ref Number *"
              variant="outlined"
              fullWidth
              size="small"
              value={form.agencyRefNumber}
              onChange={(e) => onFieldChange({ agencyRefNumber: e.target.value })}
              sx={FIELD_SX}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Hearing Type"
              fullWidth
              size="small"
              value={HEARING_TYPE}
              disabled
              sx={FIELD_SX}
            />
          </Grid>
        </Grid>

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
                <DatePicker
                  label="Permit Effective Date *"
                  value={form.permitEffectiveDate}
                  onChange={onEffectiveDateChange}
                  slotProps={datePickerSlotProps}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Permit Expiration Date *"
                  value={form.permitExpiryDate}
                  disabled
                  slotProps={datePickerSlotProps}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Date of Birth *"
                  value={form.dob}
                  onChange={(value) => onFieldChange({ dob: value })}
                  maxDate={today()}
                  slotProps={datePickerSlotProps}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Incident Date *"
                  value={form.incidentDate}
                  onChange={(value) => onFieldChange({ incidentDate: value })}
                  maxDate={today()}
                  slotProps={datePickerSlotProps}
                />
              </Grid>
            </>
          )}
        </Grid>

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
      </Box>
    </LocalizationProvider>
  );
};

const formPropType = PropTypes.shape({
  county: PropTypes.object,
  dateRequested: PropTypes.object,
  agencyRefNumber: PropTypes.string,
  eligiblePermit: PropTypes.string,
  permitEffectiveDate: PropTypes.object,
  permitExpiryDate: PropTypes.object,
  dob: PropTypes.object,
  incidentDate: PropTypes.object,
});

GeneralInformationForm.propTypes = {
  form: formPropType.isRequired,
  countyList: PropTypes.array.isRequired,
  countyListLoading: PropTypes.bool.isRequired,
  saving: PropTypes.bool.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onEligiblePermitChange: PropTypes.func.isRequired,
  onEffectiveDateChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default React.memo(GeneralInformationForm);
