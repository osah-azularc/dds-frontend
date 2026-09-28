/**
 * Form 1 Service
 *
 * Calls the "Enter New Form 1" creation endpoint. Field names in the
 * payload match dds-backend's ddsForm1Validators.js exactly (lowercase,
 * matching the legacy DDS portal's own dds-form1/adddocket contract).
 */
import axiosInstance from '../utilities/axiosConfig';

export const addDdsDocket = async (docketDetails) => {
  const response = await axiosInstance.post('/dds-form1/adddocket', {
    docketdetails: docketDetails,
  });
  return response?.data;
};

/**
 * Loads a Form 1 docket + its Temporary Permit eligibility row for the
 * review screen (/form1/reqdt/:form1Id). Response shape:
 * { docketData: [...], permitData: [...] }, or the literal string "404" if
 * the form1Id doesn't exist. Party rows are a separate call --
 * form1PartyService.js's getForm1Parties() (dds-form1/get-party-details).
 */
export const searchDocketInfo = async (form1Id) => {
  const response = await axiosInstance.post('/dds-form1/searchdocketinfo', {
    tableName: 'docketsearch',
    condition: form1Id,
  });
  return response?.data;
};

/**
 * Saves the Temporary Permit edits made on the existing-docket review
 * screen (/form1/reqdt/:form1Id). Field names match dds-backend's
 * ddsForm1Validators.js exactly — note `incidentDate` here, not
 * `incident_date` as addDdsDocket uses; that mismatch exists in the legacy
 * dds-form1/updatedocket contract itself.
 */
export const updateDdsDocket = async (form1Id, docketDetails) => {
  const response = await axiosInstance.post('/dds-form1/updatedocket', {
    form1Id,
    docketdetails: docketDetails,
  });
  return response?.data;
};

/**
 * Deletes a Form1 docket entirely -- "Delete Form1" on the existing-docket
 * review screen, only shown/enabled for a still-Draft docket
 * (actualStatus === 'pending', see DocketTabBar.jsx).
 */
export const deleteDdsDocket = async (form1Id) => {
  const response = await axiosInstance.post('/dds-form1/deletedocket', { form1Id });
  return response?.data;
};

export default { addDdsDocket, searchDocketInfo, updateDdsDocket, deleteDdsDocket };
