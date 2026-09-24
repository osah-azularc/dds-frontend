import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
import { addDdsDocket } from '../../../services/form1Service';
import {
  AGENCY_CODE,
  CASE_TYPE,
  HEARING_TYPE,
  DEFAULT_COUNTY_LABEL,
  PERMIT_EXPIRY_DAYS,
  INITIAL_FORM1_FORM,
} from './constants';

const toDateString = (value) => (value ? dayjs(value).format('YYYY-MM-DD') : '');

/**
 * Drives the "Enter New Form 1" screen. Mirrors the legacy DDS portal's
 * form1-new-controller.js: County list is shared with the docket search
 * panel's dashboardFiltersSlice; Agency Code/Case Type/Hearing Type are
 * fixed (see constants.js); Permit Expiration Date auto-computes from
 * Permit Effective Date (+90 days).
 */
const useForm1New = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const countyList = useSelector(selectCountyList);
  const countyListInitialized = useSelector(selectDashboardFilterInitialized);
  const countyListLoading = useSelector(selectDashboardFilterLoading);

  const [form, setForm] = useState(INITIAL_FORM1_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!countyListInitialized && !countyListLoading) {
      dispatch(loadDashboardFilters());
    }
  }, [dispatch, countyListInitialized, countyListLoading]);

  // Default County to "No County" once the list has loaded, matching legacy's
  // $scope.countyselect = "No County" initial value.
  useEffect(() => {
    if (form.county || countyList.length === 0) return;
    const defaultCounty = countyList.find((option) => option.label === DEFAULT_COUNTY_LABEL);
    if (defaultCounty) {
      setForm((prev) => ({ ...prev, county: defaultCounty }));
    }
  }, [countyList, form.county]);

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
  };
};

export default useForm1New;
