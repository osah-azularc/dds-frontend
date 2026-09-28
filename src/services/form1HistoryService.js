/**
 * Form 1 History Service
 *
 * Calls the History tab's API on the existing-docket review screen
 * (/form1/history/reqdt/:form1Id). Read-only -- history rows are written
 * as a side effect of the party/notes/permit actions themselves, not
 * created directly from this screen.
 */
import axiosInstance from '../utilities/axiosConfig';

export const getForm1History = async (form1Id, { page, limit, sortBy, sortOrder }) => {
  const response = await axiosInstance.post('/dds-form1/get-history', {
    form1Id,
    page,
    limit,
    sortBy,
    sortOrder,
  });
  return (
    response?.data?.data || { result: [], pagination: { total: 0, page: 0, limit, totalPages: 0 } }
  );
};

export default { getForm1History };
