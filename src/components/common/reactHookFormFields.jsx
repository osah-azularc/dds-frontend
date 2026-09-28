import React from 'react';
import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';
import {
  Autocomplete,
  FormControl,
  FormControlLabel,
  FormHelperText,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { stripLeadingWhitespace } from '../../utilities/formFieldHelpers';

const FIELD_SX = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#fff',
    '&.Mui-disabled': { backgroundColor: '#f5f5f5' },
  },
};

/**
 * Shared react-hook-form field components -- pull control/errors from the
 * surrounding FormProvider so every field shows its own inline error under
 * itself (error/helperText), instead of a single toast summarizing one
 * problem at a time. Originally built for AddPartyModal.jsx (ported from
 * ecourt-frontend's addPartiesFormFields.jsx), moved here once Form1205Form
 * needed the same pattern -- see each field's own `reValidateMode: 'onBlur'`
 * caller (useAddPartyForm.js/useForm1205Form.js) for why the explicit
 * `clearErrors` call on change is needed: without it, an error would
 * otherwise sit there, unchanged, until blur.
 *
 * `disabled` is applied only to the rendered MUI component below, never to
 * `Controller` itself -- react-hook-form's own `disabled` prop excludes the
 * field from both validation AND the submitted values object, which breaks
 * any screen where a "locked" field still holds real data that must be
 * saved (e.g. Form1205's Officer Information, locked once "Is this a new
 * party or new address?" is No). Callers that need required-only-while-
 * editable behavior should make their own `rules` prop conditional instead
 * (see OfficerInformationSection.jsx).
 */
export const FormTextField = ({ name, label, rules, formatter, disabled, ...rest }) => {
  const {
    control,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value, ...field } }) => (
        <TextField
          {...field}
          value={value ?? ''}
          label={label}
          variant="outlined"
          fullWidth
          size="small"
          disabled={disabled}
          onChange={(e) => {
            clearErrors(name);
            const noLeadingSpace = stripLeadingWhitespace(e.target.value);
            onChange(formatter ? formatter(noLeadingSpace) : noLeadingSpace);
          }}
          error={!!errors[name]}
          helperText={errors[name]?.message}
          sx={FIELD_SX}
          {...rest}
        />
      )}
    />
  );
};

FormTextField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  rules: PropTypes.object,
  formatter: PropTypes.func,
  disabled: PropTypes.bool,
};

FormTextField.defaultProps = { rules: undefined, formatter: undefined, disabled: false };

/**
 * Controller-wrapped plain dropdown -- a `<TextField select>` since DDS's
 * option lists are plain {label, value} pairs.
 */
export const FormSelectField = ({ name, label, options, rules, disabled, ...rest }) => {
  const {
    control,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, ...field } }) => (
        <TextField
          {...field}
          select
          label={label}
          fullWidth
          size="small"
          disabled={disabled}
          onChange={(e) => {
            clearErrors(name);
            onChange(e);
          }}
          error={!!errors[name]}
          helperText={errors[name]?.message}
          sx={FIELD_SX}
          {...rest}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
};

FormSelectField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, value: PropTypes.string }))
    .isRequired,
  rules: PropTypes.object,
  disabled: PropTypes.bool,
};

FormSelectField.defaultProps = { rules: undefined, disabled: false };

/**
 * Controller-wrapped Yes/No radio group. Shows its required error inline
 * (FormHelperText under the group) rather than only in a toast.
 */
export const FormRadioField = ({ name, label, rules, onChangeExtra, disabled }) => {
  const {
    control,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <>
          <Typography variant="body1" color={errors[name] ? 'error' : 'secondary'}>
            {label}
          </Typography>
          <FormControl error={!!errors[name]} disabled={disabled}>
            <RadioGroup
              row
              value={field.value ?? ''}
              onChange={(e) => {
                clearErrors(name);
                field.onChange(e.target.value);
                onChangeExtra?.(e.target.value);
              }}
            >
              <FormControlLabel value="1" control={<Radio />} label="Yes" disabled={disabled} />
              <FormControlLabel value="0" control={<Radio />} label="No" disabled={disabled} />
            </RadioGroup>
            {errors[name] && <FormHelperText>{errors[name].message}</FormHelperText>}
          </FormControl>
        </>
      )}
    />
  );
};

FormRadioField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  rules: PropTypes.object,
  onChangeExtra: PropTypes.func,
  disabled: PropTypes.bool,
};

FormRadioField.defaultProps = { rules: undefined, onChangeExtra: undefined, disabled: false };

/**
 * Controller-wrapped MUI X DatePicker with the same inline-error treatment
 * as the other fields here (error/helperText via slotProps.textField).
 */
export const FormDateField = ({ name, label, rules, maxDate, disabled }) => {
  const {
    control,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value, ...field } }) => (
        <DatePicker
          {...field}
          label={label}
          value={value ?? null}
          maxDate={maxDate}
          disabled={disabled}
          onChange={(newValue) => {
            clearErrors(name);
            onChange(newValue);
          }}
          slotProps={{
            textField: {
              fullWidth: true,
              size: 'small',
              sx: FIELD_SX,
              error: !!errors[name],
              helperText: errors[name]?.message,
            },
          }}
        />
      )}
    />
  );
};

FormDateField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  rules: PropTypes.object,
  maxDate: PropTypes.object,
  disabled: PropTypes.bool,
};

FormDateField.defaultProps = { rules: undefined, maxDate: undefined, disabled: false };

/**
 * Controller-wrapped Autocomplete for a {label, value} option list (e.g.
 * County of Occurrence) -- a searchable dropdown, unlike FormSelectField's
 * plain `<TextField select>`.
 */
export const FormAutocompleteField = ({ name, label, options, rules, loading, disabled }) => {
  const {
    control,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value, ...field } }) => (
        <Autocomplete
          {...field}
          options={options}
          value={value ?? null}
          loading={loading}
          disabled={disabled}
          getOptionLabel={(option) => option?.label || ''}
          isOptionEqualToValue={(option, val) => option?.value === val?.value}
          onChange={(_, newValue) => {
            clearErrors(name);
            onChange(newValue);
          }}
          size="small"
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              error={!!errors[name]}
              helperText={errors[name]?.message}
              sx={FIELD_SX}
            />
          )}
        />
      )}
    />
  );
};

FormAutocompleteField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  rules: PropTypes.object,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
};

FormAutocompleteField.defaultProps = { rules: undefined, loading: false, disabled: false };
