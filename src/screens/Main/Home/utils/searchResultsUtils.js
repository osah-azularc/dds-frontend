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
 * Transform API data to DataGrid row format
 * @param {Array} searchResults - Raw API results
 * @param {Function} formatDateFn - Date formatting function
 * @param {Function} formatTimeFn - Time formatting function
 * @returns {Array} Transformed rows for DataGrid
 */
export const transformSearchResults = (searchResults, formatDateFn, formatTimeFn) =>
  searchResults.map((item, index) => ({
    id: item.docketId || item.caseId || index + 1,
    docket: item.docketNo || item.caseId || '...',
    caseName: item.caseName || 'No party Added',
    caseType: item.caseType || '...',
    dateReceived: formatDateFn(item.dateReceived),
    hearingDate: formatDateFn(item.hearingDate),
    hearingTime: formatTimeFn(item.hearingTime),
    hearingLocation: item.hearingLocation || '...',
    status: item.status || '...',
    judge: item.judge || '...',
  }));
