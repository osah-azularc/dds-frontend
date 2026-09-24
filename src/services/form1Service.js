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

export default { addDdsDocket };
