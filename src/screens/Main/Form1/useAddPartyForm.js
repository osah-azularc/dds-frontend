import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import {
  addForm1Party,
  editForm1Party,
  autopopulateForm1Party,
  getAllStates,
  getForm1PartyAutofillDetails,
} from '../../../services/form1PartyService';
import { showErrorSnackbar, showSuccessSnackbar } from '../../../utilities/ErrorSnackBar';
import { formatPhoneOrFaxNumber, formatZipCode } from '../../../utilities/phoneAndFaxFormatter';
import { ADD_PARTY_DEFAULT_VALUES, ALT_ADDRESS_FIELDS, DEFAULT_STATE } from './addPartyConstants';

// Maps a Form1Parties row (as returned by getForm1Parties) onto the form's field shape for
// Edit mode. licenseNumberDefault always wins for `licenseNumber` since it's not a party
// column at all -- see AddPartyModal.jsx's docblock. Phone/Fax/Zip/Second Zip run back through
// the same formatters the fields apply on every keystroke -- a saved value that predates this
// formatting (legacy data, or a value set via handleSelectSuggestion below) would otherwise
// show up here raw (e.g. "4045551234" instead of "(404) 555-1234"), and immediately fail the
// field's own format rule (PHONE_VALIDATION/FAX_VALIDATION/ZIP_CODE_VALIDATION) on the next Save.
const buildEditFormValues = (party, licenseNumberDefault) => ({
  contactType: party.typeOfContact || 'Petitioner',
  lastName: party.lastName || '',
  firstName: party.firstName || '',
  middleName: party.middleName || '',
  licenseNumber: licenseNumberDefault || '',
  attorneyBar: party.attorneyBar || '',
  company: party.company || '',
  isNewContact: party.isNewContact || '',
  isInternationalAddr: party.isInternationalAddr || '0',
  internationalAddress: party.internationalAddress || '',
  address1: party.address1 || '',
  address2: party.address2 || '',
  city: party.city || '',
  state: party.state || DEFAULT_STATE,
  zip: formatZipCode(party.zip),
  phone: formatPhoneOrFaxNumber(party.phone),
  email: party.email || '',
  fax: formatPhoneOrFaxNumber(party.fax),
  altAddress1: party.altAddress1 || '',
  altAddress2: party.altAddress2 || '',
  altCity: party.altCity || '',
  altState: party.altState || DEFAULT_STATE,
  altZipCode: formatZipCode(party.altZipCode),
});

/**
 * Drives the Add/Edit Party modal on the existing-docket review screen. Ported
 * from ecourt-frontend's useAddPartiesForm.js (react-hook-form, per-field
 * inline errors via Controller, unregister-hidden-required-fields pattern,
 * reusing one dialog for both Add and Edit via isEditMode/editData) --
 * trimmed to DDS's two contact types (Petitioner/Petitioner Attorney) and
 * adapted to legacy's actual two-call autopopulate flow (a suggestion
 * list, then a separate detail lookup per selection -- see
 * ddsForm1PartyService.js), unlike ecourt's own single-step suggestions.
 * Selecting a suggestion only ever fills in initial values (via setValue);
 * it never locks the fields it fills -- same as ecourt, and unlike the
 * legacy PHP screen this replaces, which read-only'd them until "new
 * party?" was answered Yes.
 */
const useAddPartyForm = ({
  open,
  form1Id,
  licenseNumberDefault,
  editData,
  isEditMode,
  onSaved,
  onClose,
}) => {
  const [showAltAddress, setShowAltAddress] = useState(false);
  const [stateOptions, setStateOptions] = useState([]);
  const [nameSuggestions, setNameSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // reValidateMode 'onBlur': once a field shows a "required"/pattern error, don't
  // re-run that rule (and possibly re-show a different error, e.g. a format
  // error while a phone/zip is still mid-typing) on every keystroke -- each
  // field's own onChange (see addPartyFormFields.jsx) clears its error the
  // moment the user starts typing instead, and full validation resumes on blur
  // or the next Save attempt.
  const formMethods = useForm({
    defaultValues: ADD_PARTY_DEFAULT_VALUES,
    reValidateMode: 'onBlur',
  });
  const { control, handleSubmit, reset, setValue, unregister } = formMethods;

  const contactType = useWatch({ control, name: 'contactType' });
  const isInternationalAddr = useWatch({ control, name: 'isInternationalAddr' });
  const isPetitioner = contactType === 'Petitioner';
  const isAttorney = contactType === 'Petitioner Attorney';
  const isInternational = isInternationalAddr === '1';

  // Reset each time the modal opens -- fully blank for Add (including License Number, which
  // used to be seeded from the docket's own Agency Reference Number; dropped since a party's
  // License Number doesn't actually have to match it), or populated from the party being
  // edited for Edit.
  useEffect(() => {
    if (!open) return;
    if (isEditMode && editData) {
      reset(buildEditFormValues(editData, licenseNumberDefault));
      setShowAltAddress(Boolean(editData.altAddress1 || editData.altAddress2 || editData.altCity));
    } else {
      reset(ADD_PARTY_DEFAULT_VALUES);
      setShowAltAddress(false);
    }
    setNameSuggestions([]);
  }, [open, isEditMode, editData, licenseNumberDefault, reset]);

  useEffect(() => {
    if (!open || stateOptions.length > 0) return;
    (async () => {
      try {
        const states = await getAllStates();
        setStateOptions(states.map((s) => ({ label: s.state, value: s.state })));
      } catch (error) {
        showErrorSnackbar(error.response?.data?.error || 'Failed to load states list.');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Fields carrying required rules but hidden by the current contact type/
  // international-address choice get unregistered so their required rule
  // can't block submission of a field the user can't see, and any stale
  // value entered under a previously-selected contact type is dropped --
  // matches ecourt-frontend's own unregister effect.
  useEffect(() => {
    if (!isPetitioner) unregister('licenseNumber');
    if (!isAttorney) unregister(['attorneyBar', 'company', 'isNewContact']);
    if (isInternational) unregister(['address1', 'address2', 'city', 'state', 'zip']);
    if (!isInternational) unregister('internationalAddress');
    if (!isPetitioner || !showAltAddress) unregister(ALT_ADDRESS_FIELDS);
  }, [isPetitioner, isAttorney, isInternational, showAltAddress, unregister]);

  // Last Name autocomplete suggestions -- Petitioner Attorney only, matching
  // legacy's autopopulateddsAction() (Petitioner has no autocomplete).
  useEffect(() => {
    if (!open || !isAttorney) {
      setNameSuggestions([]);
      setSuggestionsLoading(false);
      return undefined;
    }
    let active = true;
    setSuggestionsLoading(true);
    (async () => {
      const list = await autopopulateForm1Party('Petitioner Attorney');
      if (active) {
        setNameSuggestions(list);
        setSuggestionsLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [open, isAttorney]);

  const handleSelectSuggestion = async (suggestion) => {
    if (!suggestion?.id) return;
    try {
      const details = await getForm1PartyAutofillDetails(suggestion.id);
      if (!details) return;
      const values = {
        firstName: details.firstName || '',
        middleName: details.middleName || '',
        attorneyBar: details.attorneyBar || '',
        company: details.company || '',
        address1: details.address1 || '',
        address2: details.address2 || '',
        city: details.city || '',
        state: details.state || DEFAULT_STATE,
        zip: formatZipCode(details.zip),
        phone: formatPhoneOrFaxNumber(details.phone),
        email: details.email || '',
        fax: formatPhoneOrFaxNumber(details.fax),
      };
      // shouldValidate/shouldDirty: without them a field left showing a "required"
      // error from an earlier failed Save keeps showing that stale error even
      // after autopopulate just filled it in. Phone/Fax/Zip run through the same
      // formatters the fields apply while typing -- the attorney-lookup source data isn't
      // guaranteed to already be in "(XXX) XXX-XXXX"/"XXXXX-XXXX" shape, and shouldValidate
      // would otherwise immediately flag a freshly-autofilled, unformatted value as invalid.
      Object.entries(values).forEach(([field, value]) =>
        setValue(field, value, { shouldValidate: true, shouldDirty: true }),
      );
    } catch (error) {
      showErrorSnackbar(
        error.response?.data?.error || 'Failed to load the selected attorney record.',
      );
    }
  };

  // Collapse and clear the alternate address once its button is hidden
  // (contact type changed away from Petitioner), so no stale second address resubmits.
  useEffect(() => {
    if (!isPetitioner && showAltAddress) setShowAltAddress(false);
  }, [isPetitioner, showAltAddress]);

  const toggleAltAddress = () => {
    setShowAltAddress((prev) => {
      const next = !prev;
      if (!next) {
        ALT_ADDRESS_FIELDS.forEach((field) =>
          setValue(field, field === 'altState' ? DEFAULT_STATE : ''),
        );
      }
      return next;
    });
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      if (isEditMode && editData) {
        await editForm1Party(form1Id, editData.partyId, data);
        showSuccessSnackbar('Party updated successfully!');
      } else {
        await addForm1Party(form1Id, data);
        showSuccessSnackbar('Party added successfully!');
      }
      onSaved?.();
      onClose?.();
    } catch (error) {
      showErrorSnackbar(
        error.response?.data?.error || 'Something went wrong! Please try again later.',
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSave = handleSubmit(onSubmit);

  return {
    formMethods,
    isPetitioner,
    isAttorney,
    isInternational,
    showAltAddress,
    toggleAltAddress,
    stateOptions,
    nameSuggestions,
    suggestionsLoading,
    saving,
    handleSelectSuggestion,
    handleSave,
  };
};

export default useAddPartyForm;
