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

export default { getForm1Documents };
