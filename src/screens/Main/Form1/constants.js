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

// Full agency names for the docket header's "Respondent" field. DDS's portal
// only ever submits dockets for these two agencies (see AGENCY_OPTIONS in
// Home/constants/searchConstants.js).
export const RESPONDENT_NAMES = {
  DDS: 'Department of Driver Services',
  DPS: 'Department of Public Safety',
};

/**
 * The `docketnumber` column is stored as `{agency}-ALS-{form1Id}-{countyId}-
 * {judgeLastname}` (see DdsForm1Controller.php's judge-assignment actions)
 * but displayed reordered as `{form1Id}-{agency}-ALS-{countyId}-
 * {judgeLastname}` — e.g. "DDS-ALS-1610167-33-Woodard" storage becomes
 * "1610167-DDS-ALS-33-Woodard" on screen. Matches form1-controller.js's
 * `$scope.docket_no` assignment exactly. It's only set once OSAH staff
 * assign a judge to the docket, so it's blank (and the header that shows
 * it stays hidden, per form1.phtml's `ng-show="docket_no"`) until then.
 */
export const formatDocketNumber = (raw) => {
  if (!raw) return '';
  const parts = raw.split('-');
  if (parts.length < 5) return raw;
  return `${parts[2]}-${parts[0]}-${parts[1]}-${parts[3]}-${parts[4]}`;
};

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
  // Read-only fields populated from an existing docket (see the
  // "review an existing docket" flow in useForm1New.js) — always blank on
  // the "create new" flow, since OSAH staff assign hearing info later.
  status: '',
  hearingSite: '',
  hearingDate: null,
  hearingTime: '',
  judge: '',
  judgeAssistant: '',
  hearingMode: '',
  dateReceivedByOSAH: null,
  dateEntered: null,
};
