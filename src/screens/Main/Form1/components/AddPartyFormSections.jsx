import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import { formatPhoneOrFaxNumber } from '../../../../utilities/phoneAndFaxFormatter';
import {
  EMAIL_VALIDATION,
  FAX_VALIDATION,
  LICENSE_NUMBER_VALIDATION_REQUIRED,
  NEW_CONTACT_VALIDATION_REQUIRED,
  PHONE_VALIDATION,
} from '../../../../utilities/validationPatterns';
import { FormRadioField, FormTextField } from '../../../../components/common/reactHookFormFields';

/**
 * Petitioner gets License Number (really the docket's own Agency Reference
 * Number, see useAddPartyForm.js's docblock); Petitioner Attorney gets the
 * "new party or new address?" radio, Attorney Bar #, and Company Name.
 * Matches form1.phtml's flag_type-driven field set exactly. Every field
 * stays editable regardless of whether it was autopopulated -- selecting a
 * suggestion only sets initial values, it never locks anything (see
 * useAddPartyForm.js's docblock).
 */
export const TypeSpecificFields = ({ isPetitioner, isAttorney, disabled }) => {
  if (isPetitioner) {
    return (
      <Grid item xs={12} sm={6}>
        <FormTextField
          name="licenseNumber"
          label="License Number *"
          rules={LICENSE_NUMBER_VALIDATION_REQUIRED}
          disabled={disabled}
        />
      </Grid>
    );
  }

  if (!isAttorney) return null;

  return (
    <>
      <Grid item xs={12}>
        <FormRadioField
          name="isNewContact"
          label="Is this a new party or new address? *"
          rules={NEW_CONTACT_VALIDATION_REQUIRED}
          disabled={disabled}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormTextField name="attorneyBar" label="Attorney Bar #" disabled={disabled} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormTextField
          name="company"
          label="Company Name (If there is no company, please enter a title, i.e. Attorney at Law)"
          disabled={disabled}
        />
      </Grid>
    </>
  );
};

TypeSpecificFields.propTypes = {
  isPetitioner: PropTypes.bool.isRequired,
  isAttorney: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
};

TypeSpecificFields.defaultProps = {
  disabled: false,
};

export const ContactMethodFields = ({ disabled }) => (
  <>
    <Grid item xs={12} sm={4}>
      <FormTextField
        name="phone"
        label="Phone"
        rules={PHONE_VALIDATION}
        formatter={formatPhoneOrFaxNumber}
        placeholder="(XXX) XXX-XXXX"
        inputProps={{ maxLength: 14 }}
        disabled={disabled}
      />
    </Grid>
    <Grid item xs={12} sm={4}>
      <FormTextField
        name="email"
        label="Email"
        rules={EMAIL_VALIDATION}
        type="email"
        disabled={disabled}
      />
    </Grid>
    <Grid item xs={12} sm={4}>
      <FormTextField
        name="fax"
        label="Fax"
        rules={FAX_VALIDATION}
        formatter={formatPhoneOrFaxNumber}
        placeholder="(XXX) XXX-XXXX"
        inputProps={{ maxLength: 14 }}
        disabled={disabled}
      />
    </Grid>
  </>
);

ContactMethodFields.propTypes = {
  disabled: PropTypes.bool,
};

ContactMethodFields.defaultProps = {
  disabled: false,
};
