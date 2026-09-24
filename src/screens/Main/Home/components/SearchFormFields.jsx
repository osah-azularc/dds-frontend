import { Autocomplete, TextField } from '@mui/material';

/**
 * Renders a single-select autocomplete field.
 * Mirrors Ecourt's renderSingleSelect (see SearchFormFields.jsx) trimmed for DDS.
 */
export const renderSingleSelect = ({
  label,
  options,
  value = null,
  onChange = () => {},
  loading = false,
}) => (
  <Autocomplete
    options={options}
    value={value}
    onChange={(_, newValue) => onChange(newValue)}
    getOptionLabel={(option) => option?.label || ''}
    isOptionEqualToValue={(opt, val) => opt?.value === val?.value}
    loading={loading}
    size="small"
    renderInput={(params) => (
      <TextField {...params} label={label} variant="outlined" size="small" />
    )}
  />
);
