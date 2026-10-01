/**
 * Docket Detail Service
 *
 * Powers the dds_superuser docket-detail screen (/docket/reqdt/:caseId,
 * reached by clicking a row in the Docket Search results -- see
 * useSearchResultsState.js's handleRowClick). Calls dds-backend's
 * /dashboard/superuserDocketInfo, which mirrors legacy's
 * Osahform/searchdocketinfo against the `docket` table directly (not
 * form1_docket -- a superuser search result has no form1Id to look up
 * through the Form1 flow).
 */
import axiosInstance from '../utilities/axiosConfig';

/**
 * @param {string} caseId - eCourt case id (the "Docket" column)
 * @returns {Promise<{docketData: object[], peopleData: object[], minorData: object[], custodialParent: object[], docketDisposition: object[], documents: object[]}|null>}
 */
export const getSuperuserDocketInfo = async (caseId) => {
  const response = await axiosInstance.post('/dashboard/superuserDocketInfo', {
    tableName: 'docketsearch',
    docketnumber: caseId,
  });
  return response?.data?.success ? response.data.data : null;
};

export default { getSuperuserDocketInfo };
