import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { Autocomplete, Checkbox, Chip, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

/**
 * Checkbox multi-select with chip tags, matching the Ecourt Reports filter
 * pattern (see ReportMultiSelectFilter) trimmed down for the DDS home page's
 * Additional Search Options panel.
 */
const MultiSelectFilter = ({ label, value, onChange, options, loading = false }) => {
  const icon = useMemo(() => <CheckBoxOutlineBlankIcon fontSize="small" />, []);
  const checkedIcon = useMemo(() => <CheckBoxIcon fontSize="small" />, []);

  return (
    <Autocomplete
      limitTags={1}
      multiple
      options={options}
      getOptionLabel={(option) => option.label || ''}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      renderInput={(params) => <TextField {...params} label={label} size="small" />}
      renderOption={(props, option, { selected }) => {
        const { key, ...otherProps } = props;
        return (
          <li key={key} {...otherProps}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              checked={selected}
              size="small"
              sx={{ padding: '2px', marginRight: '4px' }}
            />
            {option.label}
          </li>
        );
      }}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => {
          const { key, ...tagProps } = getTagProps({ index });
          return <Chip key={key} label={option.label} size="small" {...tagProps} />;
        })
      }
      size="small"
      isOptionEqualToValue={(opt, val) => opt.value === val.value}
      loading={loading}
      disableCloseOnSelect
    />
  );
};

MultiSelectFilter.propTypes = {
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

export default React.memo(MultiSelectFilter);
