/**
 * Dashboard Filter Service
 *
 * Fetches the dropdown data shown in the Docket Search "Additional Search
 * Options" panel (county, status, judge, judge assistant, hearing site,
 * contact type). Adapted from ecourt-frontend's globalDataService.js and
 * cross-checked against the legacy DDS portal's commancontroller.js
 * (osah.repos/public/js/angular/dds/controllers/commancontroller.js).
 *
 * Agency and Case Type are NOT dynamic lists for DDS — the legacy markup
 * (osah.repos/module/Osahform/view/layout/dds-header.phtml) hardcodes Agency
 * to "DDS"/"DPS" and Case Type to "ALS" only, so those live as constants in
 * screens/Main/Home/constants/searchConstants.js instead of being fetched
 * here.
 */
import axiosInstance from '../utilities/axiosConfig';

const getDynamicData = async (
  tableName,
  fieldName,
  fieldValue,
  conditionType,
  activeOnly = false,
) => {
  const response = await axiosInstance.post('/dashboard/getDataDynamic', {
    tblNm: tableName,
    field_nm: fieldName,
    field_val: fieldValue,
    cond_type: conditionType,
    ...(activeOnly ? { activeOnly: true } : {}),
  });
  return response?.data?.data ?? [];
};

// DDS-specific status list (distinct from the generic OSAH statuslist table) —
// mirrors legacy's DynamicFactory.getdocketddsstauslist() -> Osahform/getdocketddslist.
const getDdsDocketStatusList = async () => {
  const response = await axiosInstance.post('/dashboard/getDdsDocketStatusList');
  return response?.data?.data ?? [];
};

const searchDataByWhere = async (tableName, condition) => {
  const response = await axiosInstance.post('/dashboard/searchDataByWhere', {
    tableName,
    condition,
  });
  return response?.data?.data ?? [];
};

const sortByLabel = (list) =>
  [...list].sort((a, b) =>
    (a.label || '').toLowerCase().localeCompare((b.label || '').toLowerCase()),
  );

const removeDuplicates = (data, uniqueKey) => {
  const uniqueItems = [];
  const seenKeys = new Set();
  data.forEach((item) => {
    const key = item[uniqueKey];
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      uniqueItems.push(item);
    }
  });
  return uniqueItems;
};

const formatUsersByType = (userType, data = []) =>
  sortByLabel(
    removeDuplicates(
      data.filter((item) => item.userType === userType),
      'userId',
    ).map((item) => ({
      label: `${item.lastName || ''}, ${item.firstName || ''}`
        .replace(/^, /, '')
        .replace(/, $/, ''),
      value: item.userId,
      id: item.userId,
    })),
  );

// Counties are returned pre-sorted by the backend (CountyID) so that
// special entries (No County, Out of State, ...) stay at the end.
const formatCounties = (data = []) =>
  data.map((item) => ({
    label: item.countyDescription,
    value: item.countyDescription,
    id: item.countyId,
  }));

// display_name is the label shown to the user; statusList (the raw `status`
// column) is the value sent back on search, matching dds-header.phtml's
// `value="{{st.statuslist}}"` / `{{st.display_name}}` binding.
const formatDdsStatuses = (data = []) =>
  sortByLabel(
    data.map((item) => ({
      label: item.display_name,
      value: item.statusList,
      id: item.id,
    })),
  );

const formatContactTypes = (data = []) =>
  sortByLabel(
    data.map((item) => ({
      label: item.partyContact,
      value: item.partyContact,
      id: item.id,
    })),
  );

const formatHearingSites = (data = []) =>
  sortByLabel(
    data.map((item) => ({
      label: item.locationName,
      value: item.locationName,
      id: item.courtLocationId,
    })),
  );

/**
 * Loads all dropdown lists used by the Additional Search Options panel in
 * a single batch of parallel requests.
 */
export const loadDashboardFilterData = async () => {
  const [allUsers, statuses, counties, contactTypes, hearingSites] = await Promise.all([
    getDynamicData('judge_assistant_clerk', 'userId', '0', '2'),
    getDdsDocketStatusList(),
    getDynamicData('county', 'CountyId', '0', '2'),
    searchDataByWhere('typeofcontact', 'id!=0'),
    getDynamicData('courtlocations', 'courtLocationId', '0', '2'),
  ]);

  return {
    judgeList: formatUsersByType('judge', allUsers),
    judgeAssistantList: formatUsersByType('cma', allUsers),
    countyList: formatCounties(counties),
    statusList: formatDdsStatuses(statuses),
    contactTypeList: formatContactTypes(contactTypes),
    hearingSiteList: formatHearingSites(hearingSites),
  };
};

export default { loadDashboardFilterData };
