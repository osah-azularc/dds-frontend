/**
 * Form 1 Disposition Service
 *
 * Read-only disposition lookup for the existing-docket review screen
 * (/form1/reqdt/:form1Id). Matches the legacy DDS portal's own
 * getDisposition() (form1-controller.js): DynamicFactory.getdynamicdata(
 * "docketdisposition", "caseid", <form1Id>, "1") -> Osahform/getdatadynamic,
 * confirmed against production as `SELECT * FROM docketdisposition WHERE
 * caseid = <form1Id>`. Ported to dds-backend's existing getDisposition
 * controller (docketDetailPageController.js), reached via
 * docketDetailPageRoutes.js.
 *
 * Only the read is wired up -- legacy's own DDS module has no working
 * "Add Decision" submit action (see docketDetailPageRoutes.js's docblock),
 * so there's no addDisposition/editDisposition call here.
 */
import axiosInstance from '../utilities/axiosConfig';

export const getForm1Disposition = async (form1Id) => {
  const normalizedCaseId = String(form1Id ?? '').trim();
  if (!normalizedCaseId) return [];

  const response = await axiosInstance.post('/docketDetail/getDisposition', {
    caseId: normalizedCaseId,
  });

  return response?.data?.data || [];
};

export default { getForm1Disposition };
