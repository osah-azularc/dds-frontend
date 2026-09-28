import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import {
  FormAutocompleteField,
  FormRadioField,
  FormSelectField,
  FormTextField,
} from '../../../../components/common/reactHookFormFields';
import {
  FormDateField,
  FormTimeField,
} from '../../../../components/common/reactHookFormDateTimeFields';
import { FEET_OPTIONS, GENDER_OPTIONS, INCHES_OPTIONS } from '../form1205Constants';
import {
  CITATION_VALIDATION_REQUIRED,
  COUNTY_OCCUR_VALIDATION_REQUIRED,
  DOB_VALIDATION_REQUIRED,
  INCIDENT_DATE_VALIDATION_REQUIRED,
} from '../form1205ValidationRules';

/**
 * "Incident Information" section of the Form 1205 screen -- maps onto
 * form1_dds_1205_offence. Field set/layout matches legacy's
 * form1-1205form.phtml exactly (Citation #/County of Occurrence/Incident
 * Date/Incident Time/Officer Badge Number, then Commercial Vehicle?/
 * Hazardous Materials?, then State of Issue/License Class/Date of
 * Birth/Restrictions/Gender/Height/Weight). Required fields/messages match
 * form1205ValidationRules.js exactly, dropped to `undefined` while
 * `disabled` (the whole docket is locked for editing once it's past Draft
 * -- see Form1205Form.jsx) so a locked field never blocks Save/Submit,
 * matching the same disabled-vs-rules split OfficerInformationSection.jsx
 * uses.
 */
const IncidentInformationSection = ({
  countyList,
  countyListLoading,
  stateOptions,
  today,
  disabled,
}) => (
  <>
    <Typography variant="h2" color="secondary" sx={{ mb: 2.5 }}>
      Incident Information
    </Typography>
    <Grid container spacing={2.5}>
      <Grid item xs={12} sm={6} md={3}>
        <FormTextField
          name="citation"
          label="Citation # *"
          rules={disabled ? undefined : CITATION_VALIDATION_REQUIRED}
          disabled={disabled}
          inputProps={{ maxLength: 10 }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <FormAutocompleteField
          name="countyOccur"
          label="County of Occurrence *"
          options={countyList}
          rules={disabled ? undefined : COUNTY_OCCUR_VALIDATION_REQUIRED}
          loading={countyListLoading}
          disabled={disabled}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <FormDateField
          name="incidentDate"
          label="Incident Date *"
          rules={disabled ? undefined : INCIDENT_DATE_VALIDATION_REQUIRED}
          maxDate={today()}
          disabled={disabled}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <FormTimeField name="incidentTime" label="Incident Time" disabled={disabled} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <FormTextField name="officerBadgeNumber" label="Officer Badge Number" disabled={disabled} />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <FormRadioField name="commercialVehicle" label="Commercial Vehicle?" disabled={disabled} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <FormRadioField name="hazardousVehicle" label="Hazardous Materials?" disabled={disabled} />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <FormAutocompleteField
          name="stateOfIssue"
          label="State of Issue"
          options={stateOptions}
          disabled={disabled}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <FormTextField name="licenseClass" label="License Class" disabled={disabled} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <FormDateField
          name="dob"
          label="Date of Birth *"
          rules={disabled ? undefined : DOB_VALIDATION_REQUIRED}
          maxDate={today()}
          disabled={disabled}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <FormTextField name="restrictions" label="Restrictions" disabled={disabled} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <FormSelectField
          name="gender"
          label="Gender"
          options={GENDER_OPTIONS}
          disabled={disabled}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <FormSelectField
              name="feet"
              label="Height (feet)"
              options={FEET_OPTIONS.map((option) => ({ label: option, value: option }))}
              disabled={disabled}
            />
          </Grid>
          <Grid item xs={6}>
            <FormSelectField
              name="inches"
              label="Height (inches)"
              options={INCHES_OPTIONS.map((option) => ({ label: option, value: option }))}
              disabled={disabled}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <FormTextField
          name="weight"
          label="Weight"
          formatter={(value) => value.replace(/\D/g, '').slice(0, 4)}
          disabled={disabled}
        />
      </Grid>
    </Grid>
  </>
);

IncidentInformationSection.propTypes = {
  countyList: PropTypes.array.isRequired,
  countyListLoading: PropTypes.bool.isRequired,
  stateOptions: PropTypes.array.isRequired,
  today: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

IncidentInformationSection.defaultProps = {
  disabled: false,
};

export default React.memo(IncidentInformationSection);
