import dayjs from 'dayjs';

/**
 * Format date to MM-DD-YYYY format
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date or '...' if invalid
 */
export const formatDate = (date) => {
  if (!date) return '...';
  const parsedDate = dayjs(date);
  return parsedDate.isValid() ? parsedDate.format('MM-DD-YYYY') : '...';
};

/**
 * Format time from 24-hour to 12-hour format with AM/PM
 * @param {string} time - Time in HH:mm:ss format
 * @returns {string} Formatted time or '...' if invalid
 */
export const formatTime = (time) => {
  if (!time) return '...';
  const [hours, minutes] = time.split(':');
  const hour = Number.parseInt(hours, 10);
  const minute = Number.parseInt(minutes, 10);

  if (Number.isNaN(hour) || Number.isNaN(minute)) return '...';

  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  const displayMinute = minute.toString().padStart(2, '0');

  return `${displayHour}:${displayMinute} ${period}`;
};

/**
 * Map DataGrid column field names to Docket model attribute names for sorting
 */
export const FIELD_MAPPING = {
  dateReceived: 'dateReceivedByOSAH',
  dateRequested: 'dateRequested',
  hearingDate: 'hearingDate',
  hearingTime: 'hearingTime',
  hearingLocation: 'hearingSite',
  docket: 'ecourtCaseid',
  caseName: 'caseName',
  caseType: 'caseType',
  judge: 'judge',
  status: 'status',
  county: 'county',
};

/**
 * Transform API data (Docket rows) to DataGrid row format
 * @param {Array} searchResults - Raw API results
 * @returns {Array} Transformed rows for DataGrid
 */
export const transformSearchResults = (searchResults) =>
  searchResults.map((item, index) => {
    // Handle case name: null, empty, "(NULL)", or ", " should show "No party Added"
    let { caseName } = item;
    if (!caseName || caseName.trim() === '' || caseName === '(NULL)' || caseName.trim() === ',') {
      caseName = 'No party Added';
    }

    return {
      id: item.form1Id || index + 1,
      form1Id: item.form1Id,
      // Displays the eCourt case id (legacy: `caseid`, '...' until the
      // docket is assigned one) -- form1Id is only used for the row's link,
      // never shown, matching legacy's searchresult.phtml.
      docket: item.ecourtCaseid || '...',
      caseName,
      caseType: item.caseType || '...',
      dateReceived: formatDate(item.dateReceivedByOSAH),
      dateRequested: formatDate(item.dateRequested),
      hearingDate: formatDate(item.hearingDate),
      hearingTime: formatTime(item.hearingTime),
      hearingLocation: item.hearingSite || '...',
      county: item.county || '...',
      status: item.status || '...',
      judge: item.judge || '...',
    };
  });

/**
 * Build the /dashboard/searchResult request payload
 * @param {Object} filters - Search filters (condition)
 * @param {number} page - Current page (0-indexed)
 * @param {number} pageSize - Page size
 * @param {Array} sortModel - DataGrid sort model
 * @returns {Object} Search payload
 */
export const buildSearchPayload = (filters, page, pageSize, sortModel) => {
  const sortField = sortModel[0]?.field || 'dateReceived';
  const sortOrder = sortModel[0]?.sort || 'asc';
  const backendSortField = FIELD_MAPPING[sortField] || 'dateReceivedByOSAH';

  return {
    condition: filters,
    additionalCondition: {
      start: page * pageSize,
      length: pageSize,
      orderby: backendSortField,
      order: sortOrder === 'desc' ? 1 : 0,
    },
  };
};
