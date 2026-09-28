import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { Autocomplete, Checkbox, Chip, TextField } from '@mui/material';

/**
 * Multi-select autocomplete with checkboxes, used for the County / Agency /
 * Case Type filters in the Docket Search "Additional Search Options" panel.
 * Adapted from ecourt-frontend's ReportMultiSelectFilter.jsx.
 */
const SearchMultiSelectFilter = ({ label, value, onChange, options, loading = false }) => {
  const icon = useMemo(() => <CheckBoxOutlineBlankIcon fontSize="small" />, []);
  const checkedIcon = useMemo(() => <CheckBoxIcon fontSize="small" />, []);

  return (
    <Autocomplete
      limitTags={1}
      multiple
      options={options}
      getOptionLabel={(option) => option.label || ''}
      value={value}
      onChange={(_, newValue, reason) => {
        if (reason === 'selectOption' || reason === 'removeOption' || reason === 'clear') {
          onChange(newValue);
        }
      }}
      filterOptions={(opts, state) => {
        const inputValue = state.inputValue.toLowerCase().trim();
        if (!inputValue) return opts;
        return opts.filter((opt) => (opt.label || '').toLowerCase().includes(inputValue));
      }}
      renderInput={(params) => <TextField {...params} label={label} size="small" />}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => {
          const { key, ...tagProps } = getTagProps({ index });
          return <Chip key={key} label={option.label} size="small" {...tagProps} />;
        })
      }
      renderOption={(props, option, { selected }) => {
        const { key, ...otherProps } = props;
        return (
          <li key={key} {...otherProps}>
            <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} size="small" />
            {option.label}
          </li>
        );
      }}
      size="small"
      isOptionEqualToValue={(opt, val) => opt.value === val.value}
      loading={loading}
      disableCloseOnSelect
    />
  );
};

SearchMultiSelectFilter.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.any,
    }),
  ).isRequired,
  loading: PropTypes.bool,
};

export default React.memo(SearchMultiSelectFilter);
