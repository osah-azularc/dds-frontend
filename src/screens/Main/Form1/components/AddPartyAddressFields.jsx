import React from 'react';
import PropTypes from 'prop-types';
import { Button, Grid } from '@mui/material';
import {
  ADDRESS_LINE_1_VALIDATION_REQUIRED,
  CITY_VALIDATION_REQUIRED,
  INTERNATIONAL_ADDRESS_VALIDATION_REQUIRED,
  STATE_VALIDATION_REQUIRED,
  ZIP_CODE_VALIDATION,
  ZIP_CODE_VALIDATION_REQUIRED,
} from '../../../../utilities/validationPatterns';
import { formatZipCode } from '../../../../utilities/phoneAndFaxFormatter';
import {
  FormRadioField,
  FormSelectField,
  FormTextField,
} from '../../../../components/common/reactHookFormFields';

/**
 * International-address toggle + Address Line 1/2/City/State/Zip (hidden
 * when international), plus the "Add Additional Address" second-address
 * fields -- Petitioner only, matching legacy's AAA_flag_type. Split out of
 * AddPartyFormSections.jsx to stay under this project's 300-line file limit.
 */
export const AddressFields = ({
  isInternational,
  stateOptions,
  showAltButton,
  showAltAddress,
  onToggleAlt,
  disabled,
}) => (
  <>
    <Grid item xs={12}>
      <FormRadioField
        name="isInternationalAddr"
        label="Is this an international address?"
        disabled={disabled}
      />
    </Grid>

    {isInternational ? (
      <Grid item xs={12}>
        <FormTextField
          name="internationalAddress"
          label="International Address *"
          rules={INTERNATIONAL_ADDRESS_VALIDATION_REQUIRED}
          multiline
          minRows={4}
          disabled={disabled}
        />
      </Grid>
    ) : (
      <>
        <Grid item xs={12}>
          <FormTextField
            name="address1"
            label="Address Line 1 *"
            rules={ADDRESS_LINE_1_VALIDATION_REQUIRED}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12}>
          <FormTextField name="address2" label="Address Line 2" disabled={disabled} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormTextField
            name="city"
            label="City *"
            rules={CITY_VALIDATION_REQUIRED}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormSelectField
            name="state"
            label="State *"
            options={stateOptions}
            rules={STATE_VALIDATION_REQUIRED}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormTextField
            name="zip"
            label="Zip Code *"
            rules={ZIP_CODE_VALIDATION_REQUIRED}
            formatter={formatZipCode}
            placeholder="XXXXX or XXXXX-XXXX"
            inputProps={{ maxLength: 10 }}
            disabled={disabled}
          />
        </Grid>
      </>
    )}

    {showAltButton && (
      <Grid item xs={12}>
        <Button variant="outlined" onClick={onToggleAlt} disabled={disabled}>
          {showAltAddress ? 'Remove Additional Address' : 'Add Additional Address'}
        </Button>
      </Grid>
    )}
    {showAltButton && showAltAddress && (
      <>
        <Grid item xs={12}>
          <FormTextField name="altAddress1" label="Second Address Line 1" disabled={disabled} />
        </Grid>
        <Grid item xs={12}>
          <FormTextField name="altAddress2" label="Second Address Line 2" disabled={disabled} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormTextField name="altCity" label="Second City" disabled={disabled} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormSelectField
            name="altState"
            label="Second State"
            options={stateOptions}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormTextField
            name="altZipCode"
            label="Second Zip Code"
            rules={ZIP_CODE_VALIDATION}
            formatter={formatZipCode}
            placeholder="XXXXX or XXXXX-XXXX"
            inputProps={{ maxLength: 10 }}
            disabled={disabled}
          />
        </Grid>
      </>
    )}
  </>
);

AddressFields.propTypes = {
  isInternational: PropTypes.bool.isRequired,
  stateOptions: PropTypes.array.isRequired,
  showAltButton: PropTypes.bool.isRequired,
  showAltAddress: PropTypes.bool.isRequired,
  onToggleAlt: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

AddressFields.defaultProps = {
  disabled: false,
};
