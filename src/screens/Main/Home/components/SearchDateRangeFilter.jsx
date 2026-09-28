import React from 'react';
import PropTypes from 'prop-types';
import CalendarMonth from '@mui/icons-material/CalendarMonth';
import { Box, IconButton, InputAdornment, TextField } from '@mui/material';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// Stable reference so MUI never treats this as a new component across renders.
const CALENDAR_ADORNMENT = (
  <InputAdornment position="end">
    <IconButton size="small">
      <CalendarMonth fontSize="small" />
    </IconButton>
  </InputAdornment>
);

const CalendarTextField = React.forwardRef(({ InputProps, ...rest }, ref) => (
  <TextField {...rest} ref={ref} InputProps={{ ...InputProps, endAdornment: CALENDAR_ADORNMENT }} />
));
CalendarTextField.displayName = 'CalendarTextField';

const SLOTS = { field: MultiInputDateRangeField, textField: CalendarTextField };

const FIELD_SX = {
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  gap: 1,
  width: '100%',
  '& .MuiTextField-root': { flex: 1, minWidth: '0 !important', margin: 0 },
  '& .MuiMultiInputDateRangeField-separator': { display: 'none' },
};

/**
 * Renders a "From"/"To" date range as two labeled inputs, used for Hearing
 * Date and Date Received in the Docket Search "Additional Search Options"
 * panel. Adapted from ecourt-frontend's ReportDateRangePicker.jsx.
 */
const SearchDateRangeFilter = ({ startLabel, endLabel, value, onChange }) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Box sx={{ width: '100%' }}>
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

SearchDateRangeFilter.propTypes = {
  startLabel: PropTypes.string.isRequired,
  endLabel: PropTypes.string.isRequired,
  value: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default React.memo(SearchDateRangeFilter);
