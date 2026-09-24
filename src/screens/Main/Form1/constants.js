/**
 * Constants for the "Enter New Form 1" screen.
 *
 * Field set and fixed values are cross-checked against the legacy DDS
 * portal (osah.repos/module/Osahform/view/osahform/dds/form1-new.phtml and
 * public/js/angular/dds/controllers/form1-new-controller.js). Agency Code
 * and Case Type are fixed to a single value there — DDS's own portal only
 * ever submits DDS/ALS dockets (unlike the search panel, which also filters
 * by DPS).
 */
export const AGENCY_CODE = 'DDS';
export const CASE_TYPE = 'ALS';
export const HEARING_TYPE = 'In Person';
export const DEFAULT_COUNTY_LABEL = 'No County';

export const ELIGIBLE_PERMIT_OPTIONS = [
  { label: 'No', value: '0' },
  { label: 'Yes', value: '1' },
];

// Permit expiration is auto-computed as effective date + this many days
// (form1-new-controller.js's getPermitExpiryDate()).
export const PERMIT_EXPIRY_DAYS = 90;

export const INITIAL_FORM1_FORM = {
  county: null,
  dateRequested: null,
  agencyRefNumber: '',
  eligiblePermit: '0',
  permitEffectiveDate: null,
  permitExpiryDate: null,
  dob: null,
  incidentDate: null,
};
