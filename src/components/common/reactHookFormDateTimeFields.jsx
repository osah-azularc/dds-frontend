import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';
import { IconButton, InputAdornment } from '@mui/material';
import CalendarMonth from '@mui/icons-material/CalendarMonth';
import AccessTime from '@mui/icons-material/AccessTime';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';

/**
 * Date/Time react-hook-form fields -- split out of reactHookFormFields.jsx
 * (which was already at this project's 300-line cap) to keep both files
 * under it. Ports ecourt-frontend's DocketDatePicker pattern (click
 * anywhere on the field to open, typed-date parsing on blur, min/max
 * clamping) via the UI design team's Form1DatePicker.jsx/Form1TimePicker.jsx
 * (dds-frontend-feature-ui-design), wired to react-hook-form's Controller
 * the same way as every other field in reactHookFormFields.jsx -- `disabled`
 * stays visual-only (see that file's own header comment for why).
 */
const FIELD_SX = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#fff',
    '&.Mui-disabled': { backgroundColor: '#f5f5f5' },
  },
};

const DATE_FORMATS = ['M/D/YYYY', 'MM/DD/YYYY', 'M-D-YYYY', 'MM-DD-YYYY', 'YYYY-MM-DD'];

const parseTypedDate = (rawValue) => {
  if (!rawValue) return null;
  const explicitMatch = DATE_FORMATS.map((format) => dayjs(rawValue, format, true)).find((parsed) =>
    parsed.isValid(),
  );
  if (explicitMatch) return explicitMatch;
  const fallback = dayjs(rawValue);
  return fallback.isValid() ? fallback : null;
};

const clampDate = (value, minDate, maxDate) => {
  if (!value?.isValid?.()) return value;
  let nextValue = value;
  if (minDate && nextValue.isBefore(dayjs(minDate), 'day')) nextValue = dayjs(minDate);
  if (maxDate && nextValue.isAfter(dayjs(maxDate), 'day')) nextValue = dayjs(maxDate);
  return nextValue;
};

export const FormDateField = ({ name, label, rules, minDate, maxDate, disabled }) => {
  const {
    control,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  const [open, setOpen] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value, ...field } }) => {
        const commitDateChange = (nextValue) => {
          clearErrors(name);
          if (nextValue === null) {
            onChange(null);
            return;
          }
          if (!nextValue || !dayjs(nextValue).isValid()) return;
          onChange(clampDate(nextValue, minDate, maxDate));
        };

        return (
          <DatePicker
            {...field}
            label={label}
            value={value ?? null}
            minDate={minDate}
            maxDate={maxDate}
            disabled={disabled}
            open={open}
            onOpen={() => !disabled && setOpen(true)}
            onClose={() => setOpen(false)}
            onChange={commitDateChange}
            onAccept={commitDateChange}
            slotProps={{
              desktopTrapFocus: { disableRestoreFocus: true },
              textField: {
                fullWidth: true,
                size: 'small',
                sx: FIELD_SX,
                error: !!errors[name],
                helperText: errors[name]?.message,
                onClick: () => !disabled && setOpen(true),
                onBlur: (e) => {
                  const raw = e.target.value?.trim();
                  if (!raw) {
                    commitDateChange(null);
                    return;
                  }
                  const parsedDate = parseTypedDate(raw);
                  if (!parsedDate?.isValid()) return;
                  commitDateChange(parsedDate);
                },
                InputProps: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        disabled={disabled}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!disabled) setOpen(true);
                        }}
                      >
                        <CalendarMonth fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              },
            }}
          />
        );
      }}
    />
  );
};

FormDateField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  rules: PropTypes.object,
  minDate: PropTypes.object,
  maxDate: PropTypes.object,
  disabled: PropTypes.bool,
};

FormDateField.defaultProps = {
  rules: undefined,
  minDate: undefined,
  maxDate: undefined,
  disabled: false,
};

/**
 * Controller-wrapped MUI X TimePicker -- same click-anywhere-to-open
 * treatment as FormDateField above, no typed-value parsing (TimePicker's
 * own keyboard-section editing already covers that) and no `rules`, since
 * nothing on Form1205 requires Incident Time.
 */
export const FormTimeField = ({ name, label, disabled }) => {
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value, ...field } }) => (
        <TimePicker
          {...field}
          label={label}
          value={value ?? null}
          onChange={onChange}
          disabled={disabled}
          open={open}
          onOpen={() => !disabled && setOpen(true)}
          onClose={() => setOpen(false)}
          slotProps={{
            desktopTrapFocus: { disableRestoreFocus: true },
            textField: {
              fullWidth: true,
              size: 'small',
              sx: FIELD_SX,
              disabled,
              onClick: () => !disabled && setOpen(true),
              InputProps: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      disabled={disabled}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!disabled) setOpen(true);
                      }}
                    >
                      <AccessTime fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            },
          }}
        />
      )}
    />
  );
};

FormTimeField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

FormTimeField.defaultProps = { disabled: false };
