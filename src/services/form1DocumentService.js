/**
 * Form 1 Document Service
 *
 * Document & File Management listing for the existing-docket review screen
 * (/form1/reqdt/:form1Id). Matches the legacy DDS portal's own
 * documentListing() (form1-controller.js): SearchFactory.searchbyvalue(
 * "documentstable", "Caseid='<form1Id>'") -- DDS writes both Caseid and
 * Docket_caseid on documentstable as the Form 1's own form1Id, so that's
 * what's queried here too. Ported to dds-backend's own Sequelize-based
 * getDocketDocuments (docketDetailPageDocumentController.js), reached via
 * docketDetailPageRoutes.js, mirroring ecourt-frontend's own
 * useDocketDetailOverviewApi.js::getDocuments.
 *
 * `downloadForm1Document` ports ecourt-frontend's own
 * useDocketDetailDocumentApi.js::downloadDocument -- dds-backend's
 * /docketDetail/downloadDocument (same controller, now routed) returns a
 * JSON path/signed-URL for a view (forceDownloadFlag false), but for an
 * actual download it streams a binary unless the document is in alternative
 * (>250MB) S3 storage, in which case it returns JSON there too despite the
 * blob responseType -- hence the content-type sniff below, mirroring
 * ecourt's own handling of that same backend quirk.
 */
import axiosInstance from '../utilities/axiosConfig';

export const getForm1Documents = async (form1Id) => {
  const normalizedCaseId = String(form1Id ?? '').trim();
  if (!normalizedCaseId) return [];

  const response = await axiosInstance.post('/docketDetail/documents', {
    tableName: 'documentstable',
    condition: `caseId ='${normalizedCaseId}'`,
    type: 'checkDocArchived',
  });

  return response?.data?.data || [];
};

const downloadFailure = (error) => ({ success: false, error, data: null });

const parseBlobJson = async (blob) => {
  if (!(blob instanceof Blob) || typeof blob.text !== 'function') return null;
  try {
    return JSON.parse(await blob.text());
  } catch {
    return null;
  }
};

const resolveJsonFromBlob = async (blobResponse) => {
  const json = await parseBlobJson(blobResponse.data);
  if (!json) return null;
  if (json.success === false) {
    return json.data === '0'
      ? downloadFailure('File Does Not Exist!')
      : downloadFailure(json.error || 'Download failed');
  }
  if (json.success === true && typeof json.data === 'string' && json.data) {
    window.open(json.data, '_blank', 'noopener');
    return { success: true, data: true, error: null };
  }
  return null;
};

const triggerFileSave = (response, docId) => {
  const blob = response.data instanceof Blob ? response.data : new Blob([response.data]);
  const disposition = response.headers['content-disposition'] || '';
  const fileNameMatch = disposition.match(/filename="?([^";]+)"?/i);
  const suggestedName = fileNameMatch ? fileNameMatch[1] : `document-${docId}`;
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.setAttribute('download', suggestedName);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(downloadUrl);
};

const responseDownloadFailure = (responseData) =>
  responseData?.data === '0'
    ? downloadFailure('File Does Not Exist!')
    : downloadFailure(responseData?.error || 'Error processing document');

const handleViewResponse = (response) =>
  response.data?.success === false
    ? responseDownloadFailure(response.data)
    : { success: true, data: response.data?.data, error: null };

const handleDownloadResponse = async (response, docId) => {
  const contentType = response.headers['content-type'] || '';
  if (contentType.includes('application/json')) {
    const jsonResult = await resolveJsonFromBlob(response);
    if (jsonResult) return jsonResult;
  }
  triggerFileSave(response, docId);
  return { success: true, data: true, error: null };
};

const handleDownloadError = async (errorResponse) => {
  if (errorResponse?.data?.success === false) {
    return responseDownloadFailure(errorResponse.data);
  }
  if (errorResponse?.data instanceof Blob) {
    const jsonResult = await resolveJsonFromBlob(errorResponse);
    if (jsonResult) return jsonResult;
  }
  return null;
};

export const downloadForm1Document = async (docId, forceDownloadFlag = false) => {
  try {
    const response = await axiosInstance.post(
      '/docketDetail/downloadDocument',
      { docId: String(docId), forceDownload: !!forceDownloadFlag },
      { responseType: forceDownloadFlag ? 'blob' : 'json' },
    );

    return forceDownloadFlag
      ? await handleDownloadResponse(response, docId)
      : handleViewResponse(response);
  } catch (error) {
    const handled = await handleDownloadError(error.response);
    return handled || downloadFailure(error.message || 'Error processing document');
  }
};

export default { getForm1Documents, downloadForm1Document };
