import React from 'react';
import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { DRIVER_REQUEST_OPTIONS } from '../form1205Constants';

/**
 * "Driver was requested to submit to test and:*" radio group -- matches
 * legacy form1-1205form.phtml's four options exactly, laid out as a
 * vertical list (not a row) to match its own driver-requested-block markup.
 * A dedicated Controller (not the shared FormRadioField, which is Yes/No
 * only) since this has four options. No `rules` prop -- required-ness is
 * checked manually, Submit-only (see useForm1205Form.js's handleSubmitForm
 * and form1205ValidationRules.js's own docblock for why).
 */
const DriverRequestSection = ({ disabled }) => {
  const {
    control,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <Typography
        variant="body1"
        color={errors.driverRequest ? 'error' : 'secondary'}
        sx={{ mt: 3 }}
      >
        Driver was requested to submit to test and: *
      </Typography>
      <Controller
        name="driverRequest"
        control={control}
        render={({ field }) => (
          <FormControl error={!!errors.driverRequest} disabled={disabled}>
            <RadioGroup
              value={field.value ?? ''}
              onChange={(e) => {
                clearErrors('driverRequest');
                field.onChange(e.target.value);
              }}
            >
              {DRIVER_REQUEST_OPTIONS.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                  disabled={disabled}
                />
              ))}
            </RadioGroup>
            {errors.driverRequest && (
              <FormHelperText>{errors.driverRequest.message}</FormHelperText>
            )}
          </FormControl>
        )}
      />
    </>
  );
};

DriverRequestSection.propTypes = {
  disabled: PropTypes.bool,
};

DriverRequestSection.defaultProps = {
  disabled: false,
};

export default React.memo(DriverRequestSection);
