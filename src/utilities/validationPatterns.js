/**
 * react-hook-form validation rules for the Add Party modal. Ported from
 * ecourt-frontend's validationPatterns.js, trimmed to the rules DDS's own
 * Add Party fields use (see addPartyFormFields.jsx / AddPartyModal.jsx).
 */

export const VALIDATION_PATTERNS = {
  PHONE: /^\(\d{3}\) \d{3}-\d{4}$/,
  FAX: /^\(\d{3}\) \d{3}-\d{4}$/,
  EMAIL: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  ZIP_CODE: /^\d{5}(-\d{4})?$/,
};

export const PHONE_VALIDATION = {
  pattern: { value: VALIDATION_PATTERNS.PHONE, message: 'Phone must be in format (XXX) XXX-XXXX' },
};

export const FAX_VALIDATION = {
  pattern: { value: VALIDATION_PATTERNS.FAX, message: 'Fax must be in format (XXX) XXX-XXXX' },
};

export const EMAIL_VALIDATION = {
  pattern: { value: VALIDATION_PATTERNS.EMAIL, message: 'Invalid email format' },
};

export const ZIP_CODE_VALIDATION_REQUIRED = {
  required: 'Zip Code is required',
  pattern: { value: VALIDATION_PATTERNS.ZIP_CODE, message: 'Invalid zip code format' },
};

export const CONTACT_TYPE_VALIDATION_REQUIRED = { required: 'Contact Type is required' };
export const LAST_NAME_VALIDATION_REQUIRED = { required: 'Last Name is required' };
export const FIRST_NAME_VALIDATION_REQUIRED = { required: 'First Name is required' };
export const LICENSE_NUMBER_VALIDATION_REQUIRED = { required: 'License Number is required' };
export const NEW_CONTACT_VALIDATION_REQUIRED = {
  required: 'Please select whether this is a new party or new address',
};
export const ADDRESS_LINE_1_VALIDATION_REQUIRED = { required: 'Address Line 1 is required' };
export const CITY_VALIDATION_REQUIRED = { required: 'City is required' };
export const STATE_VALIDATION_REQUIRED = { required: 'State is required' };
export const INTERNATIONAL_ADDRESS_VALIDATION_REQUIRED = {
  required: 'Please enter International Address',
};
