import {
  CITATION_VALIDATION_REQUIRED,
  CITY_VALIDATION_REQUIRED,
  COUNTY_OCCUR_VALIDATION_REQUIRED,
  DOB_VALIDATION_REQUIRED,
  DRIVER_REQUEST_VALIDATION_REQUIRED,
  FIRST_NAME_VALIDATION_REQUIRED,
  GEORGIA_FLAG_VALIDATION_REQUIRED,
  INCIDENT_DATE_VALIDATION_REQUIRED,
  LAST_NAME_VALIDATION_REQUIRED,
  PRECINCT_VALIDATION_REQUIRED,
  STATE_VALIDATION_REQUIRED,
  ZIP_CODE_VALIDATION_REQUIRED,
} from './form1205ValidationRules';

/**
 * Submit-only required-field check for the Form 1205 screen, split out of useForm1205Form.js
 * (300-line file limit). Save For Later deliberately skips this entirely -- see
 * useForm1205Form.js's own docblock for why Save/Submit don't share the same validation -- so
 * these aren't react-hook-form `rules` props on the fields themselves (that would apply to
 * both buttons equally); useForm1205Form.js's onSubmit calls findMissingRequiredFields()
 * instead and surfaces each result via `setError`, reusing each rule's own `.required` message
 * so the text stays identical to what used to show while Save For Later still enforced this.
 */
const REQUIRED_ON_SUBMIT = {
  citation: CITATION_VALIDATION_REQUIRED.required,
  countyOccur: COUNTY_OCCUR_VALIDATION_REQUIRED.required,
  incidentDate: INCIDENT_DATE_VALIDATION_REQUIRED.required,
  dob: DOB_VALIDATION_REQUIRED.required,
  driverRequest: DRIVER_REQUEST_VALIDATION_REQUIRED.required,
};

// Officer Information's own required set -- applies whenever the docket itself isn't locked,
// independent of the "Is this a new party or new address?" toggle (see
// OfficerInformationSection.jsx's docblock: these carry an unconditional `add_1205 req` class
// in legacy, not gated by officeryesno).
const OFFICER_REQUIRED_ON_SUBMIT = {
  lastName: LAST_NAME_VALIDATION_REQUIRED.required,
  firstName: FIRST_NAME_VALIDATION_REQUIRED.required,
  precinct: PRECINCT_VALIDATION_REQUIRED.required,
  isGeorgiaState: GEORGIA_FLAG_VALIDATION_REQUIRED.required,
  city: CITY_VALIDATION_REQUIRED.required,
  state: STATE_VALIDATION_REQUIRED.required,
  zip: ZIP_CODE_VALIDATION_REQUIRED.required,
};

// `locked` matches OfficerInformationSection.jsx's own prop of that name (Form1205Form.jsx's
// fieldsDisabled) -- a truly locked/read-only docket never reaches Submit at all (the button
// itself is disabled), but Officer Information's own required set is dropped here too in case
// it ever does, consistent with that section's own rules being dropped while locked.
export const findMissingRequiredFields = (values, locked) => {
  const rules = locked ? REQUIRED_ON_SUBMIT : { ...REQUIRED_ON_SUBMIT, ...OFFICER_REQUIRED_ON_SUBMIT };
  const missing = {};
  Object.entries(rules).forEach(([field, message]) => {
    if (!values[field]) missing[field] = message;
  });
  return missing;
};
