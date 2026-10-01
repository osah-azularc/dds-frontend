import React from 'react';
import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';
import { Autocomplete, TextField } from '@mui/material';
import { stripLeadingWhitespace } from '../../../../utilities/formFieldHelpers';

const FIELD_SX = { '& .MuiOutlinedInput-root': { backgroundColor: '#fff' } };

// Builds the suggestion label shown in the Last Name dropdown, e.g.
// "Smith John 123 Main St" -- matches ecourt-frontend's own label builder.
const buildSuggestionLabel = (option) =>
  (typeof option === 'string' ? option : option?.name || '').trim();

/**
 * Free-text Last Name field with Petitioner-Attorney-only suggestions.
 * Typing keeps the raw text as the field's value; picking a suggestion sets
 * the last name and hands the full suggestion to onSelectSuggestion, which
 * fetches and fills in the rest of the form -- fields stay fully editable
 * afterwards (autopopulate only fills initial values, it never locks
 * anything), matching ecourt-frontend's own LastNameSuggestField exactly.
 * Party-specific (the suggestion lookup), so it stays in this file rather
 * than the shared components/common/reactHookFormFields.jsx.
 */
export const LastNameSuggestField = ({ rules, suggestions, onSelectSuggestion, disabled }) => {
  const {
    control,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  return (
    <Controller
      name="lastName"
      control={control}
      rules={rules}
      render={({ field: { onChange, value } }) => (
        <Autocomplete
          freeSolo
          disabled={disabled}
          options={suggestions}
          value={value ?? ''}
          inputValue={value ?? ''}
          getOptionLabel={buildSuggestionLabel}
          onInputChange={(_, newInput, reason) => {
            // Ignore the 'reset' MUI fires after a selection (it would overwrite
            // the last name with the full suggestion label); keep user-driven edits only.
            if (reason === 'input' || reason === 'clear') {
              clearErrors('lastName');
              onChange(stripLeadingWhitespace(newInput));
            }
          }}
          onChange={(_, selected) => {
            if (selected && typeof selected === 'object') {
              onChange(selected.lastName ?? '');
              onSelectSuggestion?.(selected);
            } else if (typeof selected === 'string') {
              onChange(selected);
            }
          }}
          size="small"
          renderInput={(params) => (
            <TextField
              {...params}
              label="Last Name *"
              fullWidth
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
              sx={FIELD_SX}
            />
          )}
        />
      )}
    />
  );
};

LastNameSuggestField.propTypes = {
  rules: PropTypes.object,
  suggestions: PropTypes.array,
  onSelectSuggestion: PropTypes.func,
  disabled: PropTypes.bool,
};

LastNameSuggestField.defaultProps = {
  rules: undefined,
  suggestions: [],
  onSelectSuggestion: undefined,
  disabled: false,
};
