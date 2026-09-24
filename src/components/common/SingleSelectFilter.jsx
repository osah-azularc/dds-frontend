import React from 'react';
import PropTypes from 'prop-types';
import { Autocomplete, TextField } from '@mui/material';

/**
 * Generic single-select autocomplete for { label, value } option lists.
 * Used by the Docket Search "Additional Search Options" panel (Contact
 * Type / Status / Judge / Judge Assistant / Hearing Site) and the "Enter
 * New Form 1" screen (County). Adapted from ecourt-frontend's
 * SearchFormFields.jsx.
 */
const SingleSelectFilter = ({
  label,
  options,
  includeAllOption = false,
  value = null,
  onChange,
  loading = false,
  sx = undefined,
}) => (
  <Autocomplete
    options={includeAllOption ? [{ label: 'All', value: 'All' }, ...options] : options}
    value={value}
    onChange={(_, newValue, reason) => {
      if (reason === 'selectOption' || reason === 'clear') {
        onChange(newValue);
      }
    }}
    loading={loading}
    getOptionLabel={(option) => option?.label || ''}
    isOptionEqualToValue={(opt, val) => opt?.value === val?.value}
    filterOptions={(opts, state) => {
      const inputValue = state.inputValue.toLowerCase().trim();
      if (!inputValue) return opts;
      return opts.filter((opt) => (opt.label || '').toLowerCase().includes(inputValue));
    }}
    renderInput={(params) => (
      <TextField {...params} label={label} variant="outlined" size="small" sx={sx} />
    )}
    size="small"
  />
);

SingleSelectFilter.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.any,
    }),
  ).isRequired,
  includeAllOption: PropTypes.bool,
  value: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  sx: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default React.memo(SingleSelectFilter);
