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
import { AGENCY_CODE, CASE_TYPE, HEARING_TYPE } from '../constants';
import HearingInformationSection from './HearingInformationSection';
import TemporaryPermitSection from './TemporaryPermitSection';

const displayDate = (value) => (value ? value.format('MM-DD-YYYY') : '');

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
 * "Form1 Information" panel — the left column of the "Enter New Form 1"
 * screen, also reused read-only to review an existing docket. Field set
 * matches the legacy DDS portal's form1-new.phtml/form1.phtml: Agency
 * Code/Case Type are fixed single-option dropdowns, and the Temporary
 * Permit fields only appear once "Eligible for a Permit?" is Yes. When
 * readOnly, Status/Hearing Information/Date Received/Date Entered are
 * shown too — those are only ever set once OSAH staff have processed the
 * docket, so they're blank (and hidden) on the "create new" flow.
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
  readOnly,
  updatingPermit,
  onUpdatePermit,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h2" color="secondary" sx={{ mb: 2 }}>
          Form1 Information
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
              disabled={readOnly}
              sx={FIELD_SX}
            />
          </Grid>
          {readOnly && (
            <Grid item xs={12} sm={6}>
              <TextField
                label="Status"
                fullWidth
                size="small"
                value={form.status}
                disabled
                sx={FIELD_SX}
              />
            </Grid>
          )}
        </Grid>

        {readOnly && (
          <HearingInformationSection
            hearingSite={form.hearingSite}
            hearingDate={displayDate(form.hearingDate)}
            hearingTime={form.hearingTime}
            judge={form.judge}
            judgeAssistant={form.judgeAssistant}
          />
        )}

        <Typography variant="h2" color="secondary" sx={{ mt: 3, mb: 2 }}>
          Additional Information
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Date Requested *"
              value={form.dateRequested}
              onChange={(value) => onFieldChange({ dateRequested: value })}
              maxDate={today()}
              disabled={readOnly}
              slotProps={datePickerSlotProps}
            />
          </Grid>
          {readOnly && (
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date Received"
                fullWidth
                size="small"
                value={displayDate(form.dateReceivedByOSAH)}
                disabled
                sx={FIELD_SX}
              />
            </Grid>
          )}

          <Grid item xs={12} sm={6}>
            <TextField
              label="Agency Ref Number *"
              variant="outlined"
              fullWidth
              size="small"
              value={form.agencyRefNumber}
              onChange={(e) => onFieldChange({ agencyRefNumber: e.target.value })}
              disabled={readOnly && form.status !== 'Draft'}
              sx={FIELD_SX}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Hearing Type"
              fullWidth
              size="small"
              value={readOnly ? form.hearingMode : HEARING_TYPE}
              disabled
              sx={FIELD_SX}
            />
          </Grid>
          {readOnly && (
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date Entered"
                fullWidth
                size="small"
                value={displayDate(form.dateEntered)}
                disabled
                sx={FIELD_SX}
              />
            </Grid>
          )}
        </Grid>

        <TemporaryPermitSection
          form={form}
          onFieldChange={onFieldChange}
          onEligiblePermitChange={onEligiblePermitChange}
          onEffectiveDateChange={onEffectiveDateChange}
          today={today}
          showSaveButton={readOnly}
          saving={updatingPermit}
          onSave={onUpdatePermit}
        />

        {!readOnly && (
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
  status: PropTypes.string,
  hearingSite: PropTypes.string,
  hearingDate: PropTypes.object,
  hearingTime: PropTypes.string,
  judge: PropTypes.string,
  judgeAssistant: PropTypes.string,
  hearingMode: PropTypes.string,
  dateReceivedByOSAH: PropTypes.object,
  dateEntered: PropTypes.object,
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
  readOnly: PropTypes.bool,
  updatingPermit: PropTypes.bool,
  onUpdatePermit: PropTypes.func,
};

GeneralInformationForm.defaultProps = {
  readOnly: false,
  updatingPermit: false,
  onUpdatePermit: undefined,
};

export default React.memo(GeneralInformationForm);
