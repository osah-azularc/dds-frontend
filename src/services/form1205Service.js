/**
 * Form 1205 Service
 *
 * Calls the Form 1205 screen's submit endpoints (Officer Information + the
 * docket's DPS/Respondent Attorney finalization). Path names match the
 * legacy DDS portal's own dds-form1/... routes (see dds-backend's
 * ddsForm1205Validators.js / ddsForm1205Controller.js).
 */
import axiosInstance from '../utilities/axiosConfig';

/**
 * Loads the docket's most-recently-saved Officer Information + 1205 offence data, for
 * prefilling the screen when reopening an existing docket. Returns null if the docket has no
 * Officer party yet.
 */
export const search1205Info = async (form1Id) => {
  const response = await axiosInstance.post('/dds-form1/search1205info', { form1Id });
  return response?.data?.data ?? null;
};

export const addOfficerPartyDetails = async (form1Id, officerDetails) => {
  const response = await axiosInstance.post('/dds-form1/addPartyDetails', {
    form1Id,
    contactType: 'Officer',
    officerDetails,
  });
  return response?.data?.data;
};

/**
 * Saves the Incident Information section -- posts to the same /addPartyDetails URL as
 * addOfficerPartyDetails, matching legacy's own frontend, which calls that one endpoint twice
 * per Save/Submit (once per contactType) rather than using two separate endpoints.
 */
export const saveIncidentInformation = async (form1Id, incidentDetails) => {
  await axiosInstance.post('/dds-form1/addPartyDetails', {
    form1Id,
    contactType: 'form1205',
    incidentDetails,
  });
};

export const addAttorneyRespondent = async (form1Id) => {
  const response = await axiosInstance.post('/dds-form1/addattorneyrespondent', { form1Id });
  return response?.data?.data;
};

export const updateDdsToDps = async (form1Id) => {
  await axiosInstance.post('/dds-form1/updateddstodps', { form1Id });
};

export default {
  search1205Info,
  addOfficerPartyDetails,
  saveIncidentInformation,
  addAttorneyRespondent,
  updateDdsToDps,
};
