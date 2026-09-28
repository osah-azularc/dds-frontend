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
import { DRIVER_REQUEST_VALIDATION_REQUIRED } from '../form1205ValidationRules';

/**
 * "Driver was requested to submit to test and:*" radio group -- matches
 * legacy form1-1205form.phtml's four options exactly, laid out as a
 * vertical list (not a row) to match its own driver-requested-block markup.
 * A dedicated Controller (not the shared FormRadioField, which is Yes/No
 * only) since this has four options. `rules` is dropped to `undefined`
 * while `disabled`, same as every other field on this screen (see
 * IncidentInformationSection.jsx).
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
        rules={disabled ? undefined : DRIVER_REQUEST_VALIDATION_REQUIRED}
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
