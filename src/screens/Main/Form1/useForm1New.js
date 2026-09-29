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
import { addDdsDocket, searchDocketInfo, updateDdsDocket } from '../../../services/form1Service';
import { getForm1Parties } from '../../../services/form1PartyService';
import useForm1DocumentsAndDisposition from './useForm1DocumentsAndDisposition';
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
 * Drives the "Enter New Form 1" screen — also reused, read-only, for
 * reviewing an existing docket at /form1/reqdt/:form1Id (reached by
 * clicking a row in Docket Search). Mirrors the legacy DDS portal's
 * form1-new-controller.js: County list is shared with the docket search
 * panel's dashboardFiltersSlice; Agency Code/Case Type/Hearing Type are
 * fixed (see constants.js); Permit Expiration Date auto-computes from
 * Permit Effective Date (+90 days).
 */
const useForm1New = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { form1Id } = useParams();
  const isExisting = Boolean(form1Id);
  const countyList = useSelector(selectCountyList);
  const countyListInitialized = useSelector(selectDashboardFilterInitialized);
  const countyListLoading = useSelector(selectDashboardFilterLoading);

  const [form, setForm] = useState(INITIAL_FORM1_FORM);
  const [saving, setSaving] = useState(false);
  const [existingDocket, setExistingDocket] = useState(null);
  const [parties, setParties] = useState([]);
  const [permitInfo, setPermitInfo] = useState(null);
  const [loadingExisting, setLoadingExisting] = useState(isExisting);
  const [updatingPermit, setUpdatingPermit] = useState(false);
  const { documents, disposition } = useForm1DocumentsAndDisposition(form1Id, isExisting);

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

  // Load an existing docket's data (Docket Search -> Form 1 review flow).
  // DOB/Incident Date/Eligibility/Effective/Expiry Date come from
  // form1_dds_1205_offence and form1_dds_permit_eligibility_effectivedate
  // (permitData). Re-run after a successful Temporary Permit save
  // (handleUpdatePermit below) so the form reflects what's actually
  // persisted, not just what was submitted. Party rows are fetched
  // separately via loadParties() below (dds-form1/get-party-details),
  // matching legacy's own separate getPartyDetailsAction() rather than
  // bundling them into this response.
  const loadExistingDocket = useCallback(async () => {
    const response = await searchDocketInfo(form1Id);

    if (response === '404' || !response?.docketData?.length) {
      showErrorSnackbar('Docket not found');
      navigate('/home', { replace: true });
      return;
    }

    setExistingDocket(response.docketData[0]);
    setPermitInfo(response.permitData?.[0] || null);
    setLoadingExisting(false);
  }, [form1Id, navigate]);

  const loadParties = useCallback(async () => {
    const data = await getForm1Parties(form1Id);
    setParties(data);
  }, [form1Id]);

  useEffect(() => {
    if (!isExisting) return;
    loadExistingDocket();
    loadParties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExisting, form1Id]);

  // Add Party writes a Petitioner's License Number to the docket's own Agency Reference
  // Number (see ddsForm1PartyService.js), so a party add/edit/delete refreshes both the
  // docket and the party list, not just the list.
  const refetchAfterPartyChange = useCallback(async () => {
    await Promise.all([loadExistingDocket(), loadParties()]);
  }, [loadExistingDocket, loadParties]);

  // Once the docket and county list have both loaded, populate the form.
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
      await loadExistingDocket();
    } catch (error) {
      showErrorSnackbar(
        error.response?.data?.error || 'Something went wrong! Please try again later.',
      );
    } finally {
      setUpdatingPermit(false);
    }
  }, [form, form1Id, loadExistingDocket]);

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
    existingDocket,
    parties,
    disposition,
    documents,
    loadingExisting,
    updatingPermit,
    handleUpdatePermit,
    refetchAfterPartyChange,
  };
};

export default useForm1New;
