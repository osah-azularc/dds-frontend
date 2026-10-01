import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import {
  selectCountyList,
  selectDashboardFilterInitialized,
  selectDashboardFilterLoading,
  loadDashboardFilters,
} from '../../../store/slices/dashboardFiltersSlice';
import {
  showErrorSnackbar,
  showSuccessSnackbar,
  showWarningSnackbar,
} from '../../../utilities/ErrorSnackBar';
import { addDdsDocket, updateDdsDocket } from '../../../services/form1Service';
import useForm1DocumentsAndDisposition from './useForm1DocumentsAndDisposition';
import useClerkDocketData from './useClerkDocketData';
import useSuperuserDocketData from './useSuperuserDocketData';
import {
  AGENCY_CODE,
  CASE_TYPE,
  HEARING_TYPE,
  DEFAULT_COUNTY_LABEL,
  PERMIT_EXPIRY_DAYS,
  INITIAL_FORM1_FORM,
} from './constants';

const toDateString = (value) => (value ? dayjs(value).format('YYYY-MM-DD') : '');
const toDayjsOrNull = (value) => (value ? dayjs(value) : null);

/**
 * Drives the "Enter New Form 1" screen (create flow) -- also reused, read-only, for both
 * existing-docket review entry points (appRoutes.jsx):
 *   - /form1/reqdt/:form1Id -- regular DDS clerk/helpdesk flow (useClerkDocketData.js)
 *   - /docket/reqdt/:caseId -- dds_superuser's docket click, which has no form1Id to look
 *     up through that flow (useSuperuserDocketData.js) -- see useSearchResultsState.js's
 *     handleRowClick
 * Only one of form1Id/caseId is ever set, matching whichever route rendered this screen;
 * `isSuperuserView` picks which of the two data hooks below is "live" for this render.
 * Mirrors the legacy DDS portal's form1-new-controller.js: County list is shared with the
 * docket search panel's dashboardFiltersSlice; Agency Code/Case Type/Hearing Type are fixed
 * (see constants.js); Permit Expiration Date auto-computes from Permit Effective Date
 * (+90 days).
 */
const useForm1New = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { form1Id, caseId } = useParams();
  const isSuperuserView = Boolean(caseId);
  const isExisting = Boolean(form1Id) || isSuperuserView;
  const countyList = useSelector(selectCountyList);
  const countyListInitialized = useSelector(selectDashboardFilterInitialized);
  const countyListLoading = useSelector(selectDashboardFilterLoading);

  const [form, setForm] = useState(INITIAL_FORM1_FORM);
  const [saving, setSaving] = useState(false);
  const [updatingPermit, setUpdatingPermit] = useState(false);

  const clerkData = useClerkDocketData(form1Id);
  const superuserData = useSuperuserDocketData(caseId, isSuperuserView);
  const { documents: clerkDocuments, disposition: clerkDisposition } =
    useForm1DocumentsAndDisposition(form1Id, isExisting && !isSuperuserView);

  // Whichever source matches this route.
  const existingDocket = isSuperuserView ? superuserData.existingDocket : clerkData.existingDocket;
  const parties = isSuperuserView ? superuserData.parties : clerkData.parties;
  const disposition = isSuperuserView ? superuserData.disposition : clerkDisposition;
  const documents = isSuperuserView ? superuserData.documents : clerkDocuments;
  const loadingExisting = isSuperuserView ? superuserData.loading : clerkData.loadingExisting;
  const permitInfo = isSuperuserView ? null : clerkData.permitInfo;

  // `attemptedFilterLoad` gates this to one dispatch per mount. Without it,
  // a failed loadDashboardFilters() (e.g. an expired session) flips
  // countyListLoading back to false without ever setting initialized, which
  // re-satisfies this effect's own condition and re-dispatches immediately
  // -- a tight infinite retry loop with no backoff, hammering the backend.
  const attemptedFilterLoad = useRef(false);
  useEffect(() => {
    if (countyListInitialized || countyListLoading || attemptedFilterLoad.current) return;
    attemptedFilterLoad.current = true;
    dispatch(loadDashboardFilters());
  }, [dispatch, countyListInitialized, countyListLoading]);

  // Default County to "No County" once the list has loaded, matching legacy's
  // $scope.countyselect = "No County" initial value. Only applies to the
  // "create new" flow — the existing-docket effect below sets county itself.
  useEffect(() => {
    if (isExisting || form.county || countyList.length === 0) return;
    const defaultCounty = countyList.find((option) => option.label === DEFAULT_COUNTY_LABEL);
    if (defaultCounty) {
      setForm((prev) => ({ ...prev, county: defaultCounty }));
    }
  }, [isExisting, countyList, form.county]);

  // Once the docket and county list have both loaded, populate the form. permitInfo
  // (Temporary Permit eligibility) has no equivalent for a superuser's raw `docket`-table
  // view, so it just stays unanswered there (showPermitSave is also false for that view —
  // see Form1.jsx).
  useEffect(() => {
    if (!existingDocket || countyList.length === 0) return;
    const matchedCounty =
      countyList.find((option) => option.value === existingDocket.county) || null;
    const isEligible = String(permitInfo?.eligibility ?? '0') === '1';

    setForm((prev) => ({
      ...prev,
      county: matchedCounty,
      dateRequested: toDayjsOrNull(existingDocket.dateRequested),
      agencyRefNumber: existingDocket.agencyRefNumber || '',
      status: existingDocket.status || '',
      hearingSite: existingDocket.hearingSite || '',
      hearingDate: toDayjsOrNull(existingDocket.hearingDate),
      hearingTime: existingDocket.hearingTime || '',
      judge: existingDocket.judge || '',
      judgeAssistant: existingDocket.judgeAssistant || '',
      hearingMode: existingDocket.hearingMode || '',
      dateReceivedByOSAH: toDayjsOrNull(existingDocket.dateReceivedByOSAH),
      dateEntered: toDayjsOrNull(existingDocket.docketCreatedDate),
      eligiblePermit: isEligible ? '1' : '0',
      permitEffectiveDate: toDayjsOrNull(permitInfo?.effectiveDate),
      permitExpiryDate: toDayjsOrNull(permitInfo?.expiryDate),
      dob: toDayjsOrNull(permitInfo?.dob),
      incidentDate: toDayjsOrNull(permitInfo?.incidentDate),
    }));
  }, [existingDocket, countyList, permitInfo]);

  const handleFieldChange = useCallback((updates) => {
    setForm((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleEligiblePermitChange = useCallback((value) => {
    setForm((prev) => ({
      ...prev,
      eligiblePermit: value,
      ...(value === '0'
        ? { permitEffectiveDate: null, permitExpiryDate: null, dob: null, incidentDate: null }
        : {}),
    }));
  }, []);

  const handleEffectiveDateChange = useCallback((value) => {
    setForm((prev) => ({
      ...prev,
      permitEffectiveDate: value,
      permitExpiryDate: value ? dayjs(value).add(PERMIT_EXPIRY_DAYS, 'day') : null,
    }));
  }, []);

  // Saves the Temporary Permit section on the existing-docket review
  // screen (dds-form1/updatedocket) — separate from handleSave, which
  // posts the "Enter New Form 1" creation flow to dds-form1/adddocket.
  // Only reachable from the clerk flow -- GeneralInformationForm's showPermitSave is
  // false for the superuser view (Form1.jsx), which has no update endpoint for this at all.
  const handleUpdatePermit = useCallback(async () => {
    if (form.eligiblePermit === '1') {
      if (!form.permitEffectiveDate) {
        showWarningSnackbar('Please Select Permit Effective Date.');
        return;
      }
      if (!form.dob) {
        showWarningSnackbar('Please Select Date of Birth.');
        return;
      }
      if (!form.incidentDate) {
        showWarningSnackbar('Please Select Incident Date.');
        return;
      }
    }

    setUpdatingPermit(true);
    try {
      await updateDdsDocket(form1Id, {
        agencyrefnumber: form.agencyRefNumber,
        eligiblepermit: form.eligiblePermit,
        permiteffectivedate: toDateString(form.permitEffectiveDate),
        expiryDate: toDateString(form.permitExpiryDate),
        DOB: toDateString(form.dob),
        incidentDate: toDateString(form.incidentDate),
      });

      showSuccessSnackbar('Temporary Permit updated successfully!');
      await clerkData.loadExistingDocket();
    } catch (error) {
      showErrorSnackbar(
        error.response?.data?.error || 'Something went wrong! Please try again later.',
      );
    } finally {
      setUpdatingPermit(false);
    }
  }, [form, form1Id, clerkData]);

  const resetForm = useCallback(() => {
    setForm({
      ...INITIAL_FORM1_FORM,
      county: countyList.find((option) => option.label === DEFAULT_COUNTY_LABEL) || null,
    });
  }, [countyList]);

  const handleSave = useCallback(async () => {
    if (!form.dateRequested) {
      showWarningSnackbar('Please select requested date!');
      return;
    }
    if (!form.agencyRefNumber) {
      showWarningSnackbar('Please enter the agency reference number!');
      return;
    }
    if (form.eligiblePermit === '1') {
      if (!form.permitEffectiveDate) {
        showWarningSnackbar('Please Select Permit Effective Date.');
        return;
      }
      if (!form.dob) {
        showWarningSnackbar('Please Select Date of Birth.');
        return;
      }
      if (!form.incidentDate) {
        showWarningSnackbar('Please Select Incident Date.');
        return;
      }
    }

    setSaving(true);
    try {
      await addDdsDocket({
        refagency: AGENCY_CODE,
        casetype: CASE_TYPE,
        county: form.county?.value || DEFAULT_COUNTY_LABEL,
        contyId: form.county?.id ? String(form.county.id) : '',
        daterequested: toDateString(form.dateRequested),
        agencyrefnumber: form.agencyRefNumber,
        hearingmode: HEARING_TYPE,
        eligiblepermit: form.eligiblePermit,
        permiteffectivedate: toDateString(form.permitEffectiveDate),
        expiryDate: toDateString(form.permitExpiryDate),
        DOB: toDateString(form.dob),
        incident_date: toDateString(form.incidentDate),
      });

      showSuccessSnackbar('Form1 added successfully!');
      resetForm();
      navigate('/home');
    } catch (error) {
      showErrorSnackbar(
        error.response?.data?.error || 'Something went wrong! Please try again later.',
      );
    } finally {
      setSaving(false);
    }
  }, [form, navigate, resetForm]);

  return {
    form,
    countyList,
    countyListLoading,
    saving,
    handleFieldChange,
    handleEligiblePermitChange,
    handleEffectiveDateChange,
    handleSave,
    isExisting,
    isSuperuserView,
    caseId,
    existingDocket,
    parties,
    disposition,
    documents,
    loadingExisting,
    updatingPermit,
    handleUpdatePermit,
    refetchAfterPartyChange: clerkData.refetchAfterPartyChange,
  };
};

export default useForm1New;
