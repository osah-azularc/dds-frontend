/**
 * Constants for the Docket Search "Additional Search Options" panel.
 *
 * Field names in INITIAL_ADDITIONAL_SEARCH_FORM line up with dds-backend's
 * generalSearchConditionSchema (dashboardValidators.js) so the payload can be
 * sent to /dashboard/searchResult without renaming keys.
 *
 * AGENCY_OPTIONS / CASE_TYPE_OPTIONS are hardcoded, not fetched, because the
 * legacy DDS portal hardcodes them too — DDS only ever searches ALS hearings
 * for the DDS/DPS agencies (see
 * osah.repos/module/Osahform/view/layout/dds-header.phtml, the Agency and
 * Case Type <select> elements).
 */
export const AGENCY_OPTIONS = [
  { label: 'DDS', value: 'DDS' },
  { label: 'DPS', value: 'DPS' },
];

export const CASE_TYPE_OPTIONS = [{ label: 'ALS', value: 'ALS' }];

// dds_superuser's own Status dropdown is just Open/Closed (not the full DDS status list,
// and no "All" option) -- matches legacy's dds-header.phtml, which renders a completely
// different <select> for that usertype on this same field.
export const SUPERUSER_STATUS_OPTIONS = [
  { label: 'Open', value: 'open' },
  { label: 'Closed', value: 'closed' },
];

export const INITIAL_ADDITIONAL_SEARCH_FORM = {
  lastName: '',
  firstName: '',
  contactType: null,
  agencyRefNumber: '',
  county: [],
  status: null,
  agency: null,
  caseType: null,
  judge: null,
  judgeAssistant: null,
  hearingSite: null,
  hearingDateRange: [null, null],
  dateReceivedRange: [null, null],
};
