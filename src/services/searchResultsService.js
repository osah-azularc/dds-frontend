/**
 * Search Results Service
 *
 * Download Files (ZIP) and Export (CSV) actions on the Docket Search results
 * screen. Calls dds-backend's /search-results/download and
 * /search-results/export (searchResultsController.js), which mirror
 * legacy's dds/zipfilesdownload and Superuser/exportdata.
 */
import axiosInstance from '../utilities/axiosConfig';

/**
 * Creates a Blob from raw response data and triggers a browser file download.
 * @param {ArrayBuffer|Blob|string} data
 * @param {string} mimeType
 * @param {string} filename
 */
function triggerBlobDownload(data, mimeType, filename) {
  const blob = new Blob([data], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

// responseType:'blob' means error bodies are Blobs even for 4xx/5xx -- parse the blob to
// surface the backend's actual error message instead of a generic one.
async function resolveDownloadErrorMessage(axiosError, fallbackMessage) {
  if (!(axiosError.response?.data instanceof Blob)) {
    return (
      axiosError.response?.data?.error || axiosError.response?.data?.message || fallbackMessage
    );
  }
  try {
    const text = await axiosError.response.data.text();
    const json = JSON.parse(text);
    return json.error || json.message || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
}

/**
 * Downloads the selected dockets' case files or decisions as a ZIP.
 * @param {Array<string>} caseIds - eCourt case ids (the "Docket" column), not DDS form1Ids
 * @param {'case-files'|'decisions'} downloadType
 * @param {Object} [options] - Extra fields spread into the payload (e.g. { judgename })
 * @returns {Promise<string>} the downloaded filename
 */
export const downloadCaseFilesZip = async (caseIds, downloadType, options = {}) => {
  let response;
  try {
    response = await axiosInstance.post(
      '/search-results/download',
      { caseIds, downloadType, ...options },
      { responseType: 'blob' },
    );
  } catch (error) {
    throw new Error(await resolveDownloadErrorMessage(error, `Failed to download ${downloadType}`));
  }

  // When no decisions exist the server returns JSON (not a ZIP) with a 200 status.
  const contentType = response.headers['content-type'] || '';
  if (contentType.includes('application/json')) {
    const text = await response.data.text();
    const json = JSON.parse(text);
    if (json.result === false) {
      throw new Error(json.message || 'Respective documents do not exist');
    }
  }

  const contentDisposition = response.headers['content-disposition'];
  const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
  const filename = filenameMatch?.[1] || `${downloadType}.zip`;

  triggerBlobDownload(response.data, 'application/zip', filename);
  return filename;
};

/**
 * Exports the current search results as a CSV, matching legacy's excelsheet{date}.csv format.
 * @param {Object} condition - Search condition (the same filters object sent to /dashboard/searchResult)
 * @param {Object} additionalCondition - { orderby, order }
 * @returns {Promise<string>} the downloaded filename
 */
export const exportSearchResultsCsv = async (condition, additionalCondition) => {
  let response;
  try {
    response = await axiosInstance.post(
      '/search-results/export',
      { condition, additionalCondition, searchType: 'general' },
      { responseType: 'blob' },
    );
  } catch (error) {
    throw new Error(await resolveDownloadErrorMessage(error, 'Failed to export search results'));
  }

  const today = new Date().toISOString().slice(0, 10);
  const filename = `excelsheet${today}.csv`;
  triggerBlobDownload(response.data, 'text/csv', filename);
  return filename;
};
