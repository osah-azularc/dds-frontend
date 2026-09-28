import React from 'react';
import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';
import { Box, MenuItem, TextField, Typography } from '@mui/material';
import { TIME_PERIOD_OPTIONS } from '../form1205Constants';

const FIELD_SX = { '& .MuiOutlinedInput-root': { backgroundColor: '#fff' } };

const clampTwoDigits = (value, max) => {
  const digits = value.replace(/\D/g, '').slice(0, 2);
  if (digits === '') return digits;
  return String(Math.min(Number.parseInt(digits, 10), max)).padStart(digits.length, '0');
};

/**
 * Three-part Incident Time input (HH : MM AM/PM), matching form1-1205form.
 * phtml's timepicker widget visually without pulling in a dedicated
 * time-picker library for just this one field. Not required (see
 * form1205ValidationRules.js), so these three fields are plain
 * Controllers with no `rules`.
 */
const IncidentTimeField = ({ disabled }) => {
  const { control } = useFormContext();

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
        Incident Time
      </Typography>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Controller
          name="incidentTimeHour"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              placeholder="HH"
              size="small"
              disabled={disabled}
              onChange={(e) => field.onChange(clampTwoDigits(e.target.value, 12))}
              inputProps={{ maxLength: 2, style: { textAlign: 'center' } }}
              sx={{ ...FIELD_SX, width: 64 }}
            />
          )}
        />
        <Controller
          name="incidentTimeMinute"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              placeholder="MM"
              size="small"
              disabled={disabled}
              onChange={(e) => field.onChange(clampTwoDigits(e.target.value, 59))}
              inputProps={{ maxLength: 2, style: { textAlign: 'center' } }}
              sx={{ ...FIELD_SX, width: 64 }}
            />
          )}
        />
        <Controller
          name="incidentTimePeriod"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              size="small"
              disabled={disabled}
              sx={{ ...FIELD_SX, width: 80 }}
            >
              {TIME_PERIOD_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      </Box>
    </Box>
  );
};

IncidentTimeField.propTypes = {
  disabled: PropTypes.bool,
};

IncidentTimeField.defaultProps = {
  disabled: false,
};

export default React.memo(IncidentTimeField);
