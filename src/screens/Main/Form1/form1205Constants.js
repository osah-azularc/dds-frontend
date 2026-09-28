/**
 * Constants for the Form 1205 screen (/form1/1205form/reqdt/:form1Id).
 * Field set/options are cross-checked against the legacy DDS portal's
 * form1-1205form.phtml. Incident Information maps onto
 * form1_dds_1205_offence; Officer Information maps onto form1_parties
 * (typeofcontact='Officer') -- see dds-backend's Form1Dds1205Offence.js /
 * Form1Parties.js models. UI-only for now; field names are chosen to match
 * those models 1:1 so wiring the Save/Submit actions later is a plain
 * mapping, no renaming.
 */
export const OFFICER_CONTACT_TYPE = 'Officer';

// Matches legacy's $scope.statename = 'GA' default (same as the Add Party modal).
export const DEFAULT_STATE = 'GA';

export const GENDER_OPTIONS = [
  { label: 'Male', value: '0' },
  { label: 'Female', value: '1' },
];

export const FEET_OPTIONS = Array.from({ length: 10 }, (_, i) => String(i + 1));
export const INCHES_OPTIONS = Array.from({ length: 13 }, (_, i) => String(i));

// "Driver was requested to submit to test and:*" -- values '1'-'4' match legacy's
// ng-value on the same four radio options exactly.
export const DRIVER_REQUEST_OPTIONS = [
  { value: '1', label: 'Driver refused to submit to chemical testing' },
  { value: '2', label: 'Test results >=0.08 grams' },
  { value: '3', label: 'Under 21 and test results >=0/02' },
  { value: '4', label: 'Commercial vehicle and test results >=0/04' },
];

export const INITIAL_FORM1205_FORM = {
  // Incident Information (form1_dds_1205_offence)
  citation: '',
  countyOccur: null,
  incidentDate: null,
  incidentTime: null,
  officerBadgeNumber: '',
  commercialVehicle: '0',
  hazardousVehicle: '0',
  stateOfIssue: '',
  licenseClass: '',
  dob: null,
  restrictions: '',
  gender: '',
  feet: '',
  inches: '',
  weight: '',
  driverRequest: '',
  // Officer Information (form1_parties, typeofcontact='Officer') -- defaults to
  // No, matching legacy's ng-init="officeryesno=false" (form1-1205form.phtml:265).
  isNewOfficer: '0',
  lastName: '',
  firstName: '',
  middleName: '',
  precinct: '',
  isGeorgiaState: '',
  address: '',
  city: '',
  state: DEFAULT_STATE,
  zip: '',
  phone: '',
  email: '',
  fax: '',
};
