/**
 * Form 1205 screen field messages/rules. Required-field set and message text
 * are ported verbatim from legacy's own submit-time check
 * (form1-1205form-controller.js's update1205() -- every element carrying the
 * `add_1205` class is required, using that element's own `msg` attribute as
 * the error text; the Driver Request radio and the Georgia State Patrol/DPS
 * radio are checked separately since a radio group's own "value" is never
 * blank).
 *
 * Unlike legacy (whose update1205() runs this same required check for both
 * Save For Later and Submit), these `*_VALIDATION_REQUIRED` objects are NOT
 * passed as a field's react-hook-form `rules` anymore -- that would apply
 * equally to both buttons. Instead useForm1205Form.js's handleSubmitForm
 * manually checks for these (reusing each object's own `.required` message)
 * and calls `setError` itself, only on Submit -- Save For Later only still
 * runs each field's own *format* rule (see ZIP_CODE_VALIDATION/
 * EMAIL_VALIDATION), so an incomplete-but-not-malformed draft can be saved.
 *
 * Deliberately NOT required (no `add_1205` class in legacy): Officer Badge
 * Number, Commercial Vehicle?/Hazardous Materials? (always have a value --
 * they default to "No"), State of Issue, License Class, Restrictions,
 * Gender, Height, Weight, Middle Name, "Is this a new party or new
 * address?", Address (2nd line), Phone, Email, Fax.
 */
export const CITATION_VALIDATION_REQUIRED = { required: 'Please Add a Citation Number.' };
export const COUNTY_OCCUR_VALIDATION_REQUIRED = { required: 'Please Select County of Occurence.' };
export const INCIDENT_DATE_VALIDATION_REQUIRED = { required: 'Please Enter Incident Date.' };
export const DOB_VALIDATION_REQUIRED = { required: 'Please Enter Date of Birth.' };
export const DRIVER_REQUEST_VALIDATION_REQUIRED = { required: 'Please Select Driver Request.' };
export const FIRST_NAME_VALIDATION_REQUIRED = { required: 'Please Enter First Name.' };
export const LAST_NAME_VALIDATION_REQUIRED = { required: 'Please Enter Last Name.' };
export const PRECINCT_VALIDATION_REQUIRED = { required: 'Please Enter Precinct.' };
export const CITY_VALIDATION_REQUIRED = { required: 'Please Enter City.' };
export const STATE_VALIDATION_REQUIRED = { required: 'Please select State.' };
export const ZIP_CODE_VALIDATION_REQUIRED = { required: 'Please Enter Zip Code.' };
export const GEORGIA_FLAG_VALIDATION_REQUIRED = {
  required:
    'Please select if the officer belongs to Georgia State Patrol or Georgia Department of Public Safety.',
};

// Format-only (no `required`) -- this one DOES stay a field-level react-hook-form `rules`
// prop active on both Save For Later and Submit, since a malformed zip would otherwise only
// get caught by the backend's own pattern check (ddsForm1205Validators.js's optionalZip),
// surfacing as a generic snackbar instead of inline under the field.
export const ZIP_CODE_VALIDATION = {
  pattern: { value: /^\d{5}(-\d{4})?$/, message: 'Zip code must be in 30309 or 30309-1234 format.' },
};
