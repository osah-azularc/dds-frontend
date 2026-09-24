/**
 * Option lists and initial state for the "Enter New Form 1" page.
 *
 * TODO: replace the static lists below with real lookup data once the DDS
 * backend exposes master-data endpoints for case types, counties and hearing
 * types (mirrors the same TODO already left on the Home search filters —
 * see screens/Main/Home/constants/searchConstants.js).
 */

export const AGENCY_CODE_OPTIONS = [{ label: 'DDS', value: 'DDS' }];

export const CASE_TYPE_OPTIONS = [
  { label: 'ALS', value: 'ALS' },
  { label: 'Medical', value: 'MEDICAL' },
  { label: 'Point Count', value: 'POINT_COUNT' },
];

export const COUNTY_OPTIONS = [{ label: 'No County', value: '' }];

export const HEARING_TYPE_OPTIONS = [
  { label: 'In Person', value: 'IN_PERSON' },
  { label: 'Telephone', value: 'TELEPHONE' },
  { label: 'Video', value: 'VIDEO' },
];

export const PERMIT_ELIGIBLE_OPTIONS = [
  { label: 'No', value: 'NO' },
  { label: 'Yes', value: 'YES' },
];

export const CONTACT_TYPE_OPTIONS = [
  { label: 'Petitioner', value: 'Petitioner' },
  { label: 'Petitioner Attorney', value: 'Petitioner Attorney' },
  { label: 'Respondent', value: 'Respondent' },
  { label: 'Respondent Attorney', value: 'Respondent Attorney' },
  { label: 'Investigator', value: 'Investigator' },
  { label: 'Witness', value: 'Witness' },
];

export const US_STATE_OPTIONS = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL',
  'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME',
  'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH',
  'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI',
  'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
].map((code) => ({ label: code, value: code }));

export const DOCUMENT_TYPE_OPTIONS = [
  { label: 'Notice of Hearing', value: 'Notice of Hearing' },
  { label: 'Order', value: 'Order' },
  { label: 'Motion', value: 'Motion' },
  { label: 'Correspondence', value: 'Correspondence' },
  { label: 'Other', value: 'Other' },
];

export const GENDER_OPTIONS = [
  { label: 'Male', value: 'MALE' },
  { label: 'Female', value: 'FEMALE' },
];

export const HEIGHT_FEET_OPTIONS = [3, 4, 5, 6, 7].map((ft) => ({
  label: `${ft}`,
  value: `${ft}`,
}));

export const HEIGHT_INCHES_OPTIONS = Array.from({ length: 12 }, (_, inch) => ({
  label: `${inch}`,
  value: `${inch}`,
}));

export const OFFICER_CONTACT_TYPE_OPTIONS = [{ label: 'Officer', value: 'Officer' }];

export const CHEMICAL_TEST_OPTIONS = [
  { label: 'Driver refused to submit to chemical testing', value: 'REFUSED' },
  { label: 'Test results >=0.08 grams', value: 'RESULTS_08' },
  { label: 'Under 21 and test results >=0.02', value: 'UNDER_21_RESULTS_02' },
  { label: 'Commercial vehicle and test results >=0.04', value: 'COMMERCIAL_RESULTS_04' },
];

export const DOCUMENT_TEMPLATE_OPTIONS = [
  { label: 'Notice of Hearing', value: 'NOTICE_OF_HEARING' },
  { label: 'Continuance Order', value: 'CONTINUANCE_ORDER' },
  { label: 'Final Decision', value: 'FINAL_DECISION' },
  { label: 'Dismissal Order', value: 'DISMISSAL_ORDER' },
];

export const INITIAL_FORM1_STATE = {
  agencyCode: 'DDS',
  caseType: 'ALS',
  county: '',
  dateRequested: null,
  agencyRefNumber: '',
  hearingType: 'IN_PERSON',
  eligibleForPermit: 'NO',
};
