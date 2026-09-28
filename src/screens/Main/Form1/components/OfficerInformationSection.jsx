import React from 'react';
import PropTypes from 'prop-types';
import { useWatch } from 'react-hook-form';
import { Grid, MenuItem, TextField, Typography } from '@mui/material';
import { formatPhoneOrFaxNumber, formatZipCode } from '../../../../utilities/phoneAndFaxFormatter';
import {
  FormRadioField,
  FormSelectField,
  FormTextField,
} from '../../../../components/common/reactHookFormFields';
import { OFFICER_CONTACT_TYPE } from '../form1205Constants';
import {
  CITY_VALIDATION_REQUIRED,
  FIRST_NAME_VALIDATION_REQUIRED,
  GEORGIA_FLAG_VALIDATION_REQUIRED,
  LAST_NAME_VALIDATION_REQUIRED,
  PRECINCT_VALIDATION_REQUIRED,
  STATE_VALIDATION_REQUIRED,
  ZIP_CODE_VALIDATION_REQUIRED,
} from '../form1205ValidationRules';

const FIELD_SX = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#fff',
    '&.Mui-disabled': { backgroundColor: '#f5f5f5' },
  },
};

/**
 * "Officer Information" section of the Form 1205 screen -- maps onto
 * form1_parties (typeofcontact='Officer'). Matches legacy's
 * form1-1205form.phtml exactly: First/Middle Name, the Georgia State
 * Patrol/DPS question, and the rest of the fields below it stay disabled
 * until "Is this a new party or new address?" is Yes (`ng-disabled`
 * mirrors legacy's `officeryesno`; Last Name has its own
 * autocomplete-by-badge-number lookup in legacy, not built here yet, so
 * it's left always editable, same treatment as the Add Party modal's
 * Petitioner Attorney Last Name field). Precinct/City/State/Zip/Georgia
 * State Patrol are required only while enabled -- legacy's own required
 * (`add_1205`) fields carry the same `ng-disabled` as everything else here,
 * so a disabled/locked field (already-saved data the user isn't editing
 * right now) never blocks Save/Submit. `rules` is dropped to `undefined`
 * rather than passed disabled, since FormTextField/FormSelectField/
 * FormRadioField intentionally don't forward `disabled` to react-hook-
 * form's own Controller (see reactHookFormFields.jsx) -- only `rules`
 * decides whether a field is validated.
 *
 * `locked` is a second, docket-level reason every field (including
 * Last Name and the isNewOfficer toggle itself, both otherwise always
 * editable) goes disabled -- the whole screen is read-only once the
 * docket is no longer a Draft (see Form1205Form.jsx).
 */
const OfficerInformationSection = ({ control, stateOptions, locked }) => {
  const isNewOfficer = useWatch({ control, name: 'isNewOfficer' });
  const fieldsDisabled = locked || isNewOfficer !== '1';

  return (
    <>
      <Typography variant="h2" color="secondary" sx={{ mt: 4, mb: 2 }}>
        Officer Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormRadioField
            name="isNewOfficer"
            label="Is this a new party or new address? *"
            disabled={locked}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            select
            label="Contact Type *"
            fullWidth
            size="small"
            value={OFFICER_CONTACT_TYPE}
            sx={FIELD_SX}
          >
            <MenuItem value={OFFICER_CONTACT_TYPE}>{OFFICER_CONTACT_TYPE}</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormTextField
            name="lastName"
            label="Last Name *"
            rules={locked ? undefined : LAST_NAME_VALIDATION_REQUIRED}
            disabled={locked}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormTextField
            name="firstName"
            label="First Name *"
            rules={fieldsDisabled ? undefined : FIRST_NAME_VALIDATION_REQUIRED}
            disabled={fieldsDisabled}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormTextField name="middleName" label="Middle Name" disabled={fieldsDisabled} />
        </Grid>

        <Grid item xs={12}>
          <FormTextField
            name="precinct"
            label="Precinct *"
            rules={fieldsDisabled ? undefined : PRECINCT_VALIDATION_REQUIRED}
            disabled={fieldsDisabled}
          />
        </Grid>

        <Grid item xs={12}>
          <FormRadioField
            name="isGeorgiaState"
            label="Does the Officer belong to Georgia State Patrol or Georgia Department of Public Safety? *"
            rules={fieldsDisabled ? undefined : GEORGIA_FLAG_VALIDATION_REQUIRED}
            disabled={fieldsDisabled}
          />
        </Grid>

        <Grid item xs={12}>
          <FormTextField name="address" label="Address" disabled={fieldsDisabled} />
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormTextField
            name="city"
            label="City *"
            rules={fieldsDisabled ? undefined : CITY_VALIDATION_REQUIRED}
            disabled={fieldsDisabled}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormSelectField
            name="state"
            label="State *"
            options={stateOptions}
            rules={fieldsDisabled ? undefined : STATE_VALIDATION_REQUIRED}
            disabled={fieldsDisabled}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormTextField
            name="zip"
            label="Zip Code *"
            rules={fieldsDisabled ? undefined : ZIP_CODE_VALIDATION_REQUIRED}
            formatter={formatZipCode}
            disabled={fieldsDisabled}
            inputProps={{ maxLength: 10 }}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormTextField
            name="phone"
            label="Phone"
            formatter={formatPhoneOrFaxNumber}
            disabled={fieldsDisabled}
            placeholder="(XXX) XXX-XXXX"
            inputProps={{ maxLength: 14 }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormTextField name="email" label="Email" disabled={fieldsDisabled} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormTextField
            name="fax"
            label="Fax"
            formatter={formatPhoneOrFaxNumber}
            disabled={fieldsDisabled}
            placeholder="(XXX) XXX-XXXX"
            inputProps={{ maxLength: 14 }}
          />
        </Grid>
      </Grid>
    </>
  );
};

OfficerInformationSection.propTypes = {
  control: PropTypes.object.isRequired,
  stateOptions: PropTypes.array.isRequired,
  locked: PropTypes.bool,
};

OfficerInformationSection.defaultProps = {
  locked: false,
};

export default React.memo(OfficerInformationSection);
