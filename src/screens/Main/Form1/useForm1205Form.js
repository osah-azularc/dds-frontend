import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCountyList,
  selectDashboardFilterInitialized,
  selectDashboardFilterLoading,
  loadDashboardFilters,
} from '../../../store/slices/dashboardFiltersSlice';
import { getAllStates } from '../../../services/form1PartyService';
import {
  search1205Info,
  addOfficerPartyDetails,
  saveIncidentInformation,
  addAttorneyRespondent,
  updateDdsToDps,
} from '../../../services/form1205Service';
import { showErrorSnackbar, showSuccessSnackbar } from '../../../utilities/ErrorSnackBar';
import { INITIAL_FORM1205_FORM } from './form1205Constants';
import {
  toDateString,
  formatIncidentTime,
  mapSearchResultToFormValues,
} from './form1205FieldMappers';
import { findMissingRequiredFields } from './form1205SubmitValidation';

const today = () => dayjs();

/**
 * Drives the Form 1205 screen. Saves Officer Information + Incident Information + attaches
 * the standard Respondent Attorney (see ddsForm1205Service.js); Submit additionally marks the
 * docket sent to DPS. Uses react-hook-form (matching AddPartyModal.jsx's pattern) rather than
 * this Form1 folder's older plain-useState screens, specifically so every field gets the same
 * inline-error treatment.
 *
 * Save For Later and Submit intentionally do NOT share the same validation, unlike legacy's own
 * update1205() (required-field check identical for both, differing only in the buttonStatus it
 * then sends) -- Save For Later only runs each field's own *format* rule (whatever `rules` is
 * still registered, e.g. Zip/Email's pattern), so an incomplete-but-not-malformed draft can
 * actually be saved. Submit additionally runs findMissingRequiredFields() and blocks (via
 * `setError`, same inline per-field message) until every legacy-required field has a value.
 * `onSubmitted` (Form1205Form.jsx's own refetchAfterPartyChange) re-fetches the docket once a
 * Submit succeeds, so Save For Later/Submit stop being clickable immediately instead of only
 * after the docket's new actualStatus got fetched some other way (e.g. leaving and returning).
 *
 * `prefill` binds whatever's already available on the General Information
 * section into the matching Incident Information fields the *first* time
 * this screen is opened for a docket -- Date of Birth/Incident Date are the
 * exact same form1_dds_1205_offence columns the Temporary Permit panel
 * already reads/writes, and County of Occurrence defaults from the
 * docket's own County. Deliberately waits for the search1205Info() check
 * to settle first (see `existingDataChecked` below) and only fills a field
 * that's still empty afterward, so a docket that already has its own saved
 * 1205 data never gets clobbered by this generic fallback.
 */
const useForm1205Form = ({ form1Id, prefill, locked, onSubmitted }) => {
  const dispatch = useDispatch();
  const countyList = useSelector(selectCountyList);
  const countyListInitialized = useSelector(selectDashboardFilterInitialized);
  const countyListLoading = useSelector(selectDashboardFilterLoading);
  const [stateOptions, setStateOptions] = useState([]);
  const [saving, setSaving] = useState(false);
  // Whether the search1205Info() check below has settled (found data or not) -- state, not a
  // ref, so the prefill effect further down re-runs once this flips and can then reliably
  // decide whether real saved data already claimed a field, instead of racing two independent
  // network calls against each other.
  const [existingDataChecked, setExistingDataChecked] = useState(false);
  const hasPrefilledRef = useRef(false);
  // The Officer party's own party_id (Form1Parties' real primary key), once one exists --
  // resent on every later save so the backend updates that same row instead of inserting a
  // duplicate party row (see ddsForm1205Service.js's addOfficerPartyDetails).
  const officerPartyIdRef = useRef(null);
  // The raw search1205Info() response -- state, not a ref, so the County of Occurrence/State
  // of Issue reconciliation effects below re-run when it arrives. A ref would only re-run
  // those effects when countyList/stateOptions themselves changed, which silently never
  // reconstructs either Autocomplete's value if this data resolves *after* its options list
  // has already finished loading (the common case, since dashboard filters/states load fast).
  const [fetchedData, setFetchedData] = useState(null);

  const formMethods = useForm({ defaultValues: INITIAL_FORM1205_FORM, reValidateMode: 'onBlur' });
  const { reset } = formMethods;

  useEffect(() => {
    if (!form1Id) return undefined;
    let cancelled = false;

    (async () => {
      try {
        const data = await search1205Info(form1Id);
        if (cancelled) return;
        if (!data) return;

        setFetchedData(data);
        officerPartyIdRef.current = data.partyId ?? null;
        const loadedValues = mapSearchResultToFormValues(data);
        reset((previous) => ({ ...previous, ...loadedValues }));
      } catch (error) {
        showErrorSnackbar(
          error.response?.data?.error || 'Failed to load existing officer information.',
        );
      } finally {
        if (!cancelled) setExistingDataChecked(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [form1Id, reset]);

  // County of Occurrence needs its full {label, value, id} Autocomplete option, not the plain
  // county value search1205Info() returns -- reconstructed here once *both* fetchedData and
  // countyList are available, whichever order they arrive in.
  useEffect(() => {
    if (!fetchedData?.countyOfOccurences || !countyList.length) return;
    const match = countyList.find((option) => option.value === fetchedData.countyOfOccurences);
    if (!match) return;
    reset((previous) => ({ ...previous, countyOccur: match }));
  }, [fetchedData, countyList, reset]);

  // State of Issue is the same kind of FormAutocompleteField as County of Occurrence -- same
  // reconstruction, once fetchedData and stateOptions are both available.
  useEffect(() => {
    if (!fetchedData?.stateOfIssue || !stateOptions.length) return;
    const match = stateOptions.find((option) => option.value === fetchedData.stateOfIssue);
    if (!match) return;
    reset((previous) => ({ ...previous, stateOfIssue: match }));
  }, [fetchedData, stateOptions, reset]);

  // See useForm1New.js's own copy of this guard for why attemptedFilterLoad
  // is needed: without it, a failed loadDashboardFilters() re-satisfies this
  // effect's condition and retries immediately with no backoff, looping.
  const attemptedFilterLoadRef = useRef(false);
  useEffect(() => {
    if (countyListInitialized || countyListLoading || attemptedFilterLoadRef.current) return;
    attemptedFilterLoadRef.current = true;
    dispatch(loadDashboardFilters());
  }, [dispatch, countyListInitialized, countyListLoading]);

  useEffect(() => {
    (async () => {
      try {
        const states = await getAllStates();
        setStateOptions(states.map((s) => ({ label: s.state, value: s.state })));
      } catch (error) {
        showErrorSnackbar(error.response?.data?.error || 'Failed to load states list.');
      }
    })();
  }, []);

  useEffect(() => {
    if (!form1Id) return;
    if (!existingDataChecked) return; // wait for search1205Info to settle -- see its own effect
    if (hasPrefilledRef.current) return;
    if (!prefill?.dob && !prefill?.incidentDate && !prefill?.county) return;

    // `previous` (or, for countyOccur, the raw fetched value) wins over `prefill` here
    // (reversed from the more common convention) so that whatever search1205Info() already
    // loaded for this docket is never clobbered by the General Information section's own
    // generic defaults. countyOccur itself checks fetchedData rather than the form's current
    // value because its own reconciliation effect (turning the raw county value into an
    // Autocomplete option) waits on countyList and may not have run yet.
    reset((previous) => ({
      ...previous,
      dob: previous.dob || prefill.dob,
      incidentDate: previous.incidentDate || prefill.incidentDate,
      countyOccur: fetchedData?.countyOfOccurences
        ? previous.countyOccur
        : previous.countyOccur || prefill.county,
    }));
    hasPrefilledRef.current = true;
  }, [form1Id, existingDataChecked, fetchedData, prefill, reset]);

  // Saves Officer Information + Incident Information + attaches the standard Respondent
  // Attorney -- the two /addPartyDetails calls (contactType 'Officer' then 'form1205') legacy's
  // own frontend makes on both Save For Later and Submit (Submit additionally calls
  // updateDdsToDps below). Officer Information is saved first so its party_id is available to
  // link the Incident Information row to it (officerId), matching legacy's own officerrid.
  // officerDetails carries its own `buttonStatus` too (not just incidentDetails) -- the backend
  // only ever enforces Officer Information's own required set (Last/First Name/Georgia State
  // Patrol/Precinct/City/State/Zip) when it's 'submit' (ddsForm1205Validators.js), since this
  // request is otherwise a completely separate round trip with no visibility into what the
  // Incident Information request is about to send.
  const saveForm1205 = useCallback(
    async (values, buttonStatus) => {
      const officerDetails = {
        lastName: values.lastName,
        firstName: values.firstName,
        middleName: values.middleName,
        precinct: values.precinct,
        isGeorgiaState: values.isGeorgiaState,
        address: values.address,
        city: values.city,
        state: values.state,
        zip: values.zip,
        phone: values.phone,
        email: values.email,
        fax: values.fax,
        badgeNo: values.officerBadgeNumber,
        buttonStatus,
        ...(officerPartyIdRef.current != null ? { partyId: officerPartyIdRef.current } : {}),
      };

      const officerResult = await addOfficerPartyDetails(form1Id, officerDetails);
      if (officerResult?.partyId != null) {
        officerPartyIdRef.current = officerResult.partyId;
      }

      const incidentDetails = {
        citation: values.citation,
        countyOccur: values.countyOccur?.value || '',
        incidentDate: toDateString(values.incidentDate),
        incidentTime: formatIncidentTime(values.incidentTime),
        officerBadgeNumber: values.officerBadgeNumber,
        commercialVehicle: values.commercialVehicle,
        hazardousVehicle: values.hazardousVehicle,
        stateOfIssue: values.stateOfIssue?.value || '',
        licenseClass: values.licenseClass,
        dob: toDateString(values.dob),
        restrictions: values.restrictions,
        gender: values.gender,
        feet: values.feet,
        inches: values.inches,
        weight: values.weight,
        driverRequest: values.driverRequest,
        isNewOfficer: values.isNewOfficer,
        ...(officerPartyIdRef.current != null ? { officerId: officerPartyIdRef.current } : {}),
        buttonStatus,
      };
      await saveIncidentInformation(form1Id, incidentDetails);

      await addAttorneyRespondent(form1Id);
    },
    [form1Id],
  );

  const onSave = useCallback(
    async (values) => {
      setSaving(true);
      try {
        await saveForm1205(values, 'save');
        showSuccessSnackbar('Form 1205 saved successfully!');
      } catch (error) {
        showErrorSnackbar(
          error.response?.data?.error || 'Something went wrong! Please try again later.',
        );
      } finally {
        setSaving(false);
      }
    },
    [saveForm1205],
  );

  const onSubmit = useCallback(
    async (values) => {
      const missing = findMissingRequiredFields(values, locked);
      if (Object.keys(missing).length > 0) {
        Object.entries(missing).forEach(([field, message]) =>
          formMethods.setError(field, { type: 'required', message }),
        );
        return;
      }

      setSaving(true);
      try {
        await saveForm1205(values, 'submit');
        await updateDdsToDps(form1Id);
        showSuccessSnackbar('Form 1205 submitted successfully!');
        await onSubmitted?.();
      } catch (error) {
        showErrorSnackbar(
          error.response?.data?.error || 'Something went wrong! Please try again later.',
        );
      } finally {
        setSaving(false);
      }
    },
    [form1Id, locked, saveForm1205, formMethods, onSubmitted],
  );

  const handleSave = formMethods.handleSubmit(onSave);
  const handleSubmitForm = formMethods.handleSubmit(onSubmit);

  return {
    formMethods,
    countyList,
    countyListLoading,
    stateOptions,
    saving,
    today,
    handleSave,
    handleSubmitForm,
  };
};

export default useForm1205Form;
