import CalendarMonth from '@mui/icons-material/CalendarMonth';
import { Box, IconButton, InputAdornment, TextField } from '@mui/material';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * Paired From/To date range field. Ports Ecourt's ReportDateRangePicker
 * (screens/Main/Reports/components/ReportDateRangePicker.jsx) trimmed for
 * the DDS home page's Additional Search Options panel — same underlying
 * DateRangePicker + MultiInputDateRangeField so behavior matches Ecourt.
 */
const CALENDAR_ADORNMENT = (
  <InputAdornment position="end">
    <IconButton size="small">
      <CalendarMonth fontSize="small" />
    </IconButton>
  </InputAdornment>
);

const CalendarTextField = React.forwardRef(({ InputProps, InputLabelProps, ...rest }, ref) => (
  <TextField
    {...rest}
    ref={ref}
    InputProps={{
      ...InputProps,
      endAdornment: CALENDAR_ADORNMENT,
    }}
    InputLabelProps={{
      ...InputLabelProps,
      sx: {
        maxWidth: 'calc(100% - 50px)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        ...InputLabelProps?.sx,
      },
    }}
  />
));
CalendarTextField.displayName = 'CalendarTextField';

const SLOTS = { field: MultiInputDateRangeField, textField: CalendarTextField };

const FIELD_SX = {
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  alignItems: { xs: 'stretch', sm: 'center' },
  gap: { xs: 0, sm: 3 },
  width: '100%',
  '& .MuiTextField-root': {
    flex: 1,
    minWidth: '0 !important',
    margin: 0,
  },
  '& .MuiMultiInputDateRangeField-separator': {
    display: 'none',
  },
};

const DateRangePickerField = ({ startLabel, endLabel, value, onChange }) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Box sx={{ width: '100%', overflow: 'visible' }}>
      <DateRangePicker
        value={value}
        onChange={onChange}
        slots={SLOTS}
        slotProps={{
          textField: ({ position }) => ({
            label: position === 'start' ? startLabel : endLabel,
            size: 'small',
          }),
          field: { sx: FIELD_SX },
        }}
      />
    </Box>
  </LocalizationProvider>
);

DateRangePickerField.propTypes = {
  startLabel: PropTypes.string.isRequired,
  endLabel: PropTypes.string.isRequired,
  value: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default React.memo(DateRangePickerField);
