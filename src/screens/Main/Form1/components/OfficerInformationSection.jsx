import React from 'react';
import PropTypes from 'prop-types';
import { useWatch } from 'react-hook-form';
import { Grid, MenuItem, TextField, Typography } from '@mui/material';
import { formatPhoneOrFaxNumber, formatZipCode } from '../../../../utilities/phoneAndFaxFormatter';
import { EMAIL_VALIDATION } from '../../../../utilities/validationPatterns';
import {
  FormRadioField,
  FormSelectField,
  FormTextField,
} from '../../../../components/common/reactHookFormFields';
import { OFFICER_CONTACT_TYPE } from '../form1205Constants';
import { ZIP_CODE_VALIDATION } from '../form1205ValidationRules';

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
 * (uneditable) until "Is this a new party or new address?" is Yes
 * (`ng-disabled` mirrors legacy's `officeryesno`; Last Name has its own
 * autocomplete-by-badge-number lookup in legacy, not built here yet, so
 * it's left always editable, same treatment as the Add Party modal's
 * Petitioner Attorney Last Name field).
 *
 * First Name/Precinct/City/State/Zip/Georgia State Patrol are required on
 * Submit even though their fields stay disabled by default -- legacy's
 * first_name/address1_h (Precinct)/city/zip_code all carry a literal,
 * unconditional `class="add_1205 req"` (not gated by officeryesno), and the
 * Georgia State Patrol radio's own required check runs unconditionally too,
 * outside officeryesno's jQuery `.add_1205` loop
 * (form1-1205form-controller.js's update1205()). officeryesno's disabling
 * only blocks *editing* until the user opts in; it was never meant to exempt
 * these fields' own requiredness. That required check itself isn't a
 * react-hook-form `rules` prop here, though -- see useForm1205Form.js's
 * handleSubmitForm, which checks it manually so Save For Later can skip it
 * (see form1205ValidationRules.js's own docblock for why). Zip/Email's
 * *format* rule (ZIP_CODE_VALIDATION/EMAIL_VALIDATION) is the one thing that
 * still runs as a plain `rules` prop, active on every save attempt --
 * otherwise a locked-but-malformed value would get silently resent and fail
 * the backend's own pattern check instead.
 *
 * `locked` (the docket-level lock, see Form1205Form.jsx) is the one thing
 * that actually drops the zip/email format rules to `undefined` -- a truly
 * read-only screen never saves at all, so there's nothing left to validate.
 * `fieldsDisabled` (locked || isNewOfficer !== '1') separately gates every
 * field's `disabled` prop -- only whether editing is allowed.
 */
const OfficerInformationSection = ({ control, stateOptions, locked }) => {
  const isNewOfficer = useWatch({ control, name: 'isNewOfficer' });
  const fieldsDisabled = locked || isNewOfficer !== '1';

  return (
    <>
      <Typography variant="h2" color="secondary" sx={{ mt: 4, mb: 2.5 }}>
        Officer Information
      </Typography>
      <Grid container spacing={2.5}>
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
          <FormTextField name="lastName" label="Last Name *" disabled={locked} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormTextField name="firstName" label="First Name *" disabled={fieldsDisabled} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormTextField name="middleName" label="Middle Name" disabled={fieldsDisabled} />
        </Grid>

        <Grid item xs={12}>
          <FormTextField name="precinct" label="Precinct *" disabled={fieldsDisabled} />
        </Grid>

        <Grid item xs={12}>
          <FormRadioField
            name="isGeorgiaState"
            label="Does the Officer belong to Georgia State Patrol or Georgia Department of Public Safety? *"
            disabled={fieldsDisabled}
          />
        </Grid>

        <Grid item xs={12}>
          <FormTextField name="address" label="Address" disabled={fieldsDisabled} />
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormTextField name="city" label="City *" disabled={fieldsDisabled} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormSelectField
            name="state"
            label="State *"
            options={stateOptions}
            disabled={fieldsDisabled}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormTextField
            name="zip"
            label="Zip Code *"
            rules={locked ? undefined : ZIP_CODE_VALIDATION}
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
          <FormTextField
            name="email"
            label="Email"
            rules={locked ? undefined : EMAIL_VALIDATION}
            disabled={fieldsDisabled}
          />
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
