/**
 * react-hook-form validation rules for the Form 1205 screen. Required-field
 * set and message text are ported verbatim from legacy's own submit-time
 * check (form1-1205form-controller.js's update1205() -- every element
 * carrying the `add_1205` class is required, using that element's own
 * `msg` attribute as the error text; the Driver Request radio and the
 * Georgia State Patrol/DPS radio are checked separately since a radio
 * group's own "value" is never blank). Runs identically for both Save For
 * Later and Submit, matching legacy (update1205() takes a buttonStatus but
 * validates the same fields either way).
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
