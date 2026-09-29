// Reusable date-picker field for the plain (non-react-hook-form) Form1
// screens -- General Information/Hearing Information/Temporary Permit all
// manage their own `form` state via onFieldChange rather than react-hook-form,
// so they can't use reactHookFormDateTimeFields.jsx's FormDateField directly.
// Ported from the UI design team's own Form1DatePicker.jsx
// (dds-frontend-feature-ui-design) so every date field in this screen shares
// the same calendar icon/typed-date-parsing/min-max-clamp behavior as Form
// 1205's FormDateField instead of MUI's own default DatePicker adornment.
import CalendarMonth from '@mui/icons-material/CalendarMonth';
import { IconButton, InputAdornment } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { useState } from 'react';

const FIELD_SX = { '& .MuiOutlinedInput-root': { backgroundColor: '#fff' } };

const LABEL_SX = {
  maxWidth: 'calc(100% - 50px)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  backgroundColor: '#fff',
  px: 1,
};

const clampDate = (value, minDate, maxDate) => {
  if (!value?.isValid?.()) return value;

  let nextValue = value;
  if (minDate && nextValue.isBefore(dayjs(minDate), 'day')) {
    nextValue = dayjs(minDate);
  }
  if (maxDate && nextValue.isAfter(dayjs(maxDate), 'day')) {
    nextValue = dayjs(maxDate);
  }
  return nextValue;
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

const Form1DatePicker = ({
  label,
  value,
  onChange,
  minDate,
  maxDate,
  disabled,
  error,
  helperText,
}) => {
  const [open, setOpen] = useState(false);

  const commitDateChange = (nextValue) => {
    if (nextValue === null) {
      onChange(null);
      return;
    }
    if (!nextValue || !dayjs(nextValue).isValid()) return;
    onChange(clampDate(nextValue, minDate, maxDate));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        value={value}
        onChange={commitDateChange}
        onAccept={commitDateChange}
        minDate={minDate}
        maxDate={maxDate}
        disabled={disabled}
        open={open}
        onOpen={() => !disabled && setOpen(true)}
        onClose={() => setOpen(false)}
        slotProps={{
          desktopTrapFocus: { disableRestoreFocus: true },
          textField: {
            fullWidth: true,
            size: 'small',
            disabled,
            error,
            helperText,
            onClick: () => !disabled && setOpen(true),
            onBlur: (e) => {
              const raw = e.target.value?.trim();
              if (!raw) {
                onChange(null);
                return;
              }
              const parsedDate = parseTypedDate(raw);
              if (!parsedDate?.isValid()) return;
              onChange(clampDate(parsedDate, minDate, maxDate));
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
            InputLabelProps: { sx: LABEL_SX },
            sx: FIELD_SX,
          },
        }}
      />
    </LocalizationProvider>
  );
};

Form1DatePicker.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.object,
  onChange: PropTypes.func,
  minDate: PropTypes.object,
  maxDate: PropTypes.object,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  helperText: PropTypes.string,
};

Form1DatePicker.defaultProps = {
  value: null,
  onChange: () => {},
  minDate: undefined,
  maxDate: undefined,
  disabled: false,
  error: false,
  helperText: '',
};

export default Form1DatePicker;
