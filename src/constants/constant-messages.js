/*
 * Note: Keep sync with backend/api/constants/constant-messages.js
 */

export const MESSAGES = {
  SHIFT_OVERLAP: 'Please review the board as it may contain overlapping shifts.',
  USER_NOT_ACTIVE: 'user_not_active',
  USER_NOT_FOUND: 'user_not_found',
  INVALID_PASSWORD: 'invalid_password',
  ACCOUNT_LOCKED: 'account_locked',
};

export const STANDARD_PRICE = { MONTHLY: 8, ANNUALLY: 6 };

export const BILLING_PERIOD_STATUS = {
  SCHEDULED: 'scheduled',
  OPEN: 'open',
  IN_REVIEW: 'in review',
  CLOSED: 'closed',
};

export const FAILED_LOGIN_ATTEMPT_MAX_LIMIT = 5;

export const CASE_STATUS = {
  OPEN: 'open',
  CLOSED: 'closed',
  REOPEN: 'reopen',
};

// Task: https://app.clickup.com/t/86du33vbq start
export const AUDIT_LOG_MODULE_NAME = {
  CASES: 'cases',
  USERS: 'users',
  PARTY_TYPES: 'party_types',
  CASE_TYPES: 'case_types',
  DOCUMENT_TYPES: 'document_types',
  LOCATIONS: 'locations',
  AGENCIES: 'agencies',
  TEMPLATES: 'templates',
  INVOICES: 'invoices',
  PARTIES: 'parties',
  TIME_ENTRIES: 'time_entries',
  EXPENSES: 'expenses',
  BILLING_PERIODS: 'billing_periods',
  AGENCY_CONTACTS: 'agency_contacts',
  ROLES: 'roles',
  PUBLIC_EFILE_DOCUMENT: 'public_efile_documents',
};
// Task: https://app.clickup.com/t/86du33vbq end

export const AUDIT_LOG_ACTIONS = {
  CREATED: 'created',
  ADDED: 'added',
  EDITED: 'edited',
  DELETED: 'deleted',
  CLOSED: 'closed',
  RESCHEDULED: 'rescheduled',
  CANCELED: 'canceled',
  REMOVED: 'removed',
  INVITED: 'invited',
  RESENT_INVITATION: 'resent_invitation',
  CANCELED_INVITATION: 'canceled_invitation',
  CHANGED_STATUS: 'changed_status',
  CLONED: 'cloned',
  SUBMITTED: 'submitted',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const CASE_FILE_PATH = 'case-files/';
// Task: https://app.clickup.com/t/86ducgj7c?comment=90170056202833&threadedComment=90170057529974 start
// Time will be stored as UTC and displayed as the user's time.
export const CLIENT_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone; // Automatically detect client's time zone
// Task: https://app.clickup.com/t/86ducgj7c?comment=90170056202833&threadedComment=90170057529974 end

export const COURT_EVENT_STATUS = {
  SCHEDULED: 'Scheduled',
  RESCHEDULED: 'Rescheduled',
  CANCELED: 'Canceled',
  COMPLETED: 'Completed',
};

export const TEMPLATES_STATUS = {
  ACTIVE: 'Active',
  ARCHIVE: 'Archive',
  DRAFT: 'Draft',
};

export const PORTAL_NAMES = {
  OSAH_INTERNAL: 'osah_internal',
  PUBLIC_PORTAL: 'public_portal',
  AGENCY_PORTAL: 'agency_portal',
};

export const AUDIT_LOG_CASES_MODULE = {
  CASES: 'cases',
  COURT_EVENTS: 'court_events',
  DOCUMENTS: 'documents',
  PARTY_DETAILS: 'party_details_case',
  MINOR_CHILDREN_PARTY_DETAILS: 'minor_children_details_case',
  PUBLIC_EFILE_DOCUMENTS: 'public_efile_documents',
};

// Platform options for general reports (used in ReportFiltersRow)
export const PLATFORM_OPTIONS = [
  { label: 'All', value: 'select-all' },
  { label: 'Ecourt', value: 'ecourt' },
  { label: 'Public Access', value: 'public-access' },
  { label: 'Agency', value: 'agency' },
];

// Platform options for rejected documents reports (Agency)
// Reference: 1 => SRTA, 2 => DFCS-Medicaid, 3 => DFCS-Non-Medicaid
// Maps to agency_platform.id (INTEGER) - uses numbers
export const AGENCY_PLATFORM_OPTIONS = [
  { label: 'All', value: 'select-all' },
  { label: 'DFCS-Medicaid', value: 2 },
  { label: 'DFCS-Non-Medicaid', value: 3 },
  { label: 'SRTA', value: 1 },
];

// Platform options for ecourt-public-access report
// Reference: 1 => Ecourt, 2 => Public access (NO Agency option)
// Maps to ecourt_external_documents.file_added_from (VARCHAR) - uses strings
export const ECOURT_PUBLIC_ACCESS_PLATFORM_OPTIONS = [
  { label: 'All', value: 'select-all' },
  { label: 'eCourt', value: '1' },
  { label: 'Public Access', value: '2' },
];

export const SEARCH_DEBOUNCE_MS = 500;
