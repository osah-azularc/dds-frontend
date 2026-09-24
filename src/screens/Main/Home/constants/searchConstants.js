/**
 * Initial form state for the Additional Search Options panel on the DDS home page.
 */
export const INITIAL_GENERAL_SEARCH_FORM = {
  lastName: '',
  firstName: '',
  contactType: null,
  agencyRefNumber: '',
  county: [],
  status: null,
  agency: [],
  caseType: [],
  judge: null,
  judgeAssistant: null,
  hearingSite: null,
  hearingDateRange: [null, null],
  dateReceivedRange: [null, null],
};

// TODO: replace with real lookup data once the DDS backend exposes these
// master-data endpoints (contact types, counties, statuses, agencies, case
// types, judges, judge assistants, hearing sites). Empty for now so the
// fields render correctly but have nothing to select.
export const CONTACT_TYPE_LIST = [];
export const COUNTY_LIST = [];
export const STATUS_LIST = [];
export const AGENCY_LIST = [];
export const CASE_TYPE_LIST = [];
export const JUDGE_LIST = [];
export const JUDGE_ASSISTANT_LIST = [];
export const HEARING_SITE_LIST = [];
