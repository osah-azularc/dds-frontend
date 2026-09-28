/**
 * Form 1 Notes Service
 *
 * Calls the Notes tab's API on the existing-docket review screen
 * (/form1/notes/reqdt/:form1Id). Path names/request shapes match
 * dds-backend's ddsForm1NotesValidators.js / ddsForm1NotesController.js.
 * Add and Edit are one consolidated call (saveForm1Note) rather than
 * legacy's two separate add-notes/updatenotes endpoints.
 */
import axiosInstance from '../utilities/axiosConfig';

export const getForm1Notes = async (form1Id, { page, limit, sortBy, sortOrder }) => {
  const response = await axiosInstance.post('/dds-form1/get-notes', {
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

export const saveForm1Note = async (form1Id, noteId, summaryNotes) => {
  const response = await axiosInstance.post('/dds-form1/savenotes', {
    form1Id,
    ...(noteId ? { noteId } : {}),
    summaryNotes,
  });
  return response?.data;
};

export const deleteForm1Note = async (noteId) => {
  const response = await axiosInstance.post('/dds-form1/deletenotes', { noteId });
  return response?.data;
};

export default { getForm1Notes, saveForm1Note, deleteForm1Note };
