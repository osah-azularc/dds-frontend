/**
 * Form 1 Party Service
 *
 * Calls the Party Information section's API on the existing-docket review
 * screen (/form1/reqdt/:form1Id). Path names and request shapes match the
 * legacy DDS portal's own dds-form1/... routes (see dds-backend's
 * ddsForm1PartyValidators.js / ddsForm1PartyController.js). Party listing
 * is its own endpoint (get-party-details), not bundled into
 * form1Service.js's searchDocketInfo, matching legacy's own separate
 * getPartyDetailsAction().
 */
import axiosInstance from '../utilities/axiosConfig';

export const addForm1Party = async (form1Id, partydetails) => {
  const response = await axiosInstance.post('/dds-form1/addPartyDDSDetails', {
    form1Id,
    partydetails,
  });
  return response?.data;
};

export const editForm1Party = async (form1Id, partyId, partydetails) => {
  const response = await axiosInstance.post('/dds-form1/editpartydetails', {
    form1Id,
    partyId,
    partydetails,
  });
  return response?.data;
};

export const deleteForm1Party = async (form1Id, partyId, contactType) => {
  const response = await axiosInstance.post('/dds-form1/deleteparty', {
    form1Id,
    partyId,
    contactType,
  });
  return response?.data;
};

/**
 * Every party on a docket, for the Party Information section.
 */
export const getForm1Parties = async (form1Id) => {
  const response = await axiosInstance.post('/dds-form1/get-party-details', { form1Id });
  return response?.data?.data || [];
};

/**
 * Last Name autocomplete suggestions -- only returns results for
 * contactType 'Petitioner Attorney' (Petitioner has no autocomplete in
 * legacy, matching DdsForm1Controller::autopopulateddsAction()).
 */
export const autopopulateForm1Party = async (contactType) => {
  const response = await axiosInstance.post('/dds-form1/autopopulatedds', { contactType });
  return response?.data?.data || [];
};

/**
 * Full attorney record for a selected Last Name suggestion, keyed by the
 * suggestion's composite "<sno>-B" id (see autopopulateForm1Party).
 */
export const getForm1PartyAutofillDetails = async (partyId) => {
  const response = await axiosInstance.post('/dds-form1/getddsinformation', { partyId });
  return response?.data?.data || null;
};

export const getAllStates = async () => {
  const response = await axiosInstance.get('/dds-form1/getAllStates');
  return response?.data?.data || [];
};

export default {
  addForm1Party,
  editForm1Party,
  deleteForm1Party,
  getForm1Parties,
  autopopulateForm1Party,
  getForm1PartyAutofillDetails,
  getAllStates,
};
