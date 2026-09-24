import { MenuItem, TextField } from '@mui/material';
import PropTypes from 'prop-types';

const FIELD_SX = {
  '& .MuiOutlinedInput-root': { backgroundColor: '#fff' },
  // The select's content <div> otherwise gets a taller line box than a plain
  // <input> at the same padding/font-size, making Form1SelectField dropdowns
  // render a couple px taller than sibling TextFields in the same row.
  '& .MuiSelect-select': { lineHeight: '1.4375em' },
};

/**
 * Plain outlined dropdown (native-looking select, no search/autocomplete)
 * used across the Form1 information fields.
 */
const Form1SelectField = ({
  label,
  options,
  value,
  onChange,
  disabled = false,
  error = false,
  helperText = '',
}) => (
  <TextField
    select
    fullWidth
    size="small"
    variant="outlined"
    label={label}
    value={value ?? ''}
    onChange={(e) => onChange(e.target.value)}
    disabled={disabled}
    error={error}
    helperText={helperText}
    sx={FIELD_SX}
  >
    {options.map((option) => (
      <MenuItem key={option.value} value={option.value}>
        {option.label}
      </MenuItem>
    ))}
  </TextField>
);

Form1SelectField.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    }),
  ).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  helperText: PropTypes.string,
};

export default Form1SelectField;
