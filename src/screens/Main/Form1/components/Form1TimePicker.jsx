// Reusable time-picker field for the Form 1205 form - sibling of Form1DatePicker,
// mirroring its endAdornment setup so the clock icon sits with the same inset
// as the calendar icon on the date fields.
import AccessTime from '@mui/icons-material/AccessTime';
import { IconButton, InputAdornment } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import PropTypes from 'prop-types';
import { useState } from 'react';

const FIELD_SX = { '& .MuiOutlinedInput-root': { backgroundColor: '#fff' } };

const Form1TimePicker = ({
  label,
  value,
  onChange,
  disabled = false,
  error = false,
  helperText = '',
}) => {
  const [open, setOpen] = useState(false);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
        label={label}
        value={value}
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
            disabled,
            error,
            helperText,
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
            sx: FIELD_SX,
          },
        }}
      />
    </LocalizationProvider>
  );
};

Form1TimePicker.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  helperText: PropTypes.string,
};

export default Form1TimePicker;
