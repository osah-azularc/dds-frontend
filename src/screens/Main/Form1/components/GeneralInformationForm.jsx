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
import SingleSelectFilter from '../../../../components/common/SingleSelectFilter';
import { AGENCY_CODE, CASE_TYPE, HEARING_TYPE } from '../constants';
import Form1DatePicker from './Form1DatePicker';
import HearingInformationSection from './HearingInformationSection';
import TemporaryPermitSection from './TemporaryPermitSection';

// Plain label + bold value display for the Agency Code/Case Type/County/
// Status fields once reviewing an existing docket -- these are never
// editable here (Agency Code/Case Type are fixed constants; County/Status
// are OSAH-controlled after submission), so a disabled dropdown-look box
// implied an interactivity that didn't exist. Matches the UI design team's
// own SummaryField (dds-frontend-feature-ui-design's DocketDetailView.jsx).
const SummaryField = ({ label, value }) => (
  <Grid item xs={12} sm={6}>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body1" fontWeight={600}>
      {value || '...'}
    </Typography>
  </Grid>
);

SummaryField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node,
};

SummaryField.defaultProps = {
  value: null,
};

// AdapterDayjs's isValid()/isAfter() etc. expect a dayjs instance, not a
// native Date -- passing a plain `new Date()` as maxDate throws
// "value.isValid is not a function" and crashes the whole tree (no error
// boundary above this screen), which is what showed up as a blank page.
const today = () => dayjs();

// Keeps input boxes white against the panel's gray background, matching
// ecourt-frontend's DocketInfoFields.jsx / DocketDatePicker.jsx.
const FIELD_SX = { '& .MuiOutlinedInput-root': { backgroundColor: '#fff' } };

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
 * DocketInfoFields.jsx / DocumentFileManagement.jsx conventions. Date
 * fields all go through Form1DatePicker so they share Form 1205's calendar
 * icon/typed-date-parsing behavior instead of MUI's own default adornment.
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
  showPermitSave,
  showTemporaryPermit,
  isSuperuserView,
  permitErrors,
}) => {
  const effectiveShowPermitSave = showPermitSave ?? readOnly;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h2" color="secondary" sx={{ mb: 2 }}>
        {isSuperuserView ? 'Docket Information' : 'Form1 Information'}
      </Typography>

      <Grid container spacing={3}>
        {readOnly ? (
          <>
            <SummaryField label="Agency Code" value={AGENCY_CODE} />
            <SummaryField label="Case Type" value={CASE_TYPE} />
            <SummaryField label="County" value={form.county?.label} />
            <SummaryField label="Status" value={form.status} />
          </>
        ) : (
          <>
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
          </>
        )}
      </Grid>

      {readOnly && (
        <HearingInformationSection
          hearingSite={form.hearingSite}
          hearingDate={form.hearingDate}
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
          <Form1DatePicker
            label="Date Requested *"
            value={form.dateRequested}
            onChange={(value) => onFieldChange({ dateRequested: value })}
            maxDate={today()}
            disabled={readOnly}
          />
        </Grid>
        {readOnly && (
          <Grid item xs={12} sm={6}>
            <Form1DatePicker label="Date Received" value={form.dateReceivedByOSAH} disabled />
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
        {readOnly && !isSuperuserView && (
          <Grid item xs={12} sm={6}>
            <Form1DatePicker label="Date Entered" value={form.dateEntered} disabled />
          </Grid>
        )}
      </Grid>

      {showTemporaryPermit && (
        <TemporaryPermitSection
          form={form}
          onFieldChange={onFieldChange}
          onEligiblePermitChange={onEligiblePermitChange}
          onEffectiveDateChange={onEffectiveDateChange}
          today={today}
          showSaveButton={effectiveShowPermitSave}
          saving={updatingPermit}
          onSave={onUpdatePermit}
          errors={permitErrors}
        />
      )}

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
  // Whether the Temporary Permit section shows its own Save button. Defaults to `readOnly`
  // (Form1.jsx's regular clerk existing-docket review, which still allows editing just this
  // section) -- Form1.jsx passes false for dds_superuser's docket-detail view (reviewing a
  // raw `docket` row there doesn't mean the viewer can update it; there's no endpoint for
  // this at all on that path).
  showPermitSave: PropTypes.bool,
  // Whether the Temporary Permit section renders at all. There's no Temporary Permit
  // workflow for dds_superuser's docket-detail view (a raw `docket` row has no permit
  // eligibility data -- see useForm1New.js), so Form1.jsx passes false there instead of
  // showing an always-blank, always-"No" section.
  showTemporaryPermit: PropTypes.bool,
  // dds_superuser's docket-detail view (Form1.jsx) -- swaps the panel heading to "Docket
  // Information" (there's no Form1 record behind a raw `docket` row) and hides Date
  // Entered, which isn't meaningful for that view.
  isSuperuserView: PropTypes.bool,
  // Inline validation errors for the Temporary Permit section's own fields (keyed by
  // permitEffectiveDate/dob/incidentDate) -- see useForm1New.js's validatePermitFields.
  permitErrors: PropTypes.shape({
    permitEffectiveDate: PropTypes.string,
    dob: PropTypes.string,
    incidentDate: PropTypes.string,
  }),
};

GeneralInformationForm.defaultProps = {
  readOnly: false,
  updatingPermit: false,
  onUpdatePermit: undefined,
  showPermitSave: undefined,
  showTemporaryPermit: true,
  isSuperuserView: false,
  permitErrors: {},
};

export default React.memo(GeneralInformationForm);
