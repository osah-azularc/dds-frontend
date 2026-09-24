import { useCallback, useContext, useState } from 'react';
import { SnackbarContext } from '../../../context/snackbarContext';

const INITIAL_FORM1205_STATE = {
  citationNumber: '',
  countyOfOccurrence: '',
  incidentDate: null,
  incidentTime: null,
  officerBadgeNumber: '',
  commercialVehicle: 'no',
  hazardousMaterials: 'no',
  stateOfIssue: '',
  licenseClass: '',
  dateOfBirth: null,
  restrictions: '',
  gender: '',
  heightFeet: '',
  heightInches: '',
  weight: '',
  testRequestResult: '',
  isNewPartyOrAddress: 'no',
  contactType: 'Officer',
  lastName: '',
  firstName: '',
  middleName: '',
  precinct: '',
  belongsToGspOrDps: '',
  address: '',
  city: '',
  state: 'GA',
  zipCode: '',
  phone: '',
  email: '',
  fax: '',
};

/**
 * Owns the Form 1205 tab's editable field state (see DocketDetailView's
 * Form 1205 tab). Mirrors useDocketDetailView's shape/conventions.
 *
 * TODO: wire handleSaveForLater/handleSubmit to real Form 1205 endpoints once
 * they exist on the DDS backend (same TODO already left on
 * useDocketDetailView's handleSave/handleDelete).
 */
export const useForm1205 = () => {
  const openSnackbar = useContext(SnackbarContext);
  const [form, setForm] = useState(INITIAL_FORM1205_STATE);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleFieldChange = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSaveForLater = useCallback(async () => {
    setSaving(true);
    try {
      openSnackbar?.('Save is not available yet - the Form 1205 save endpoint is pending.', 'info');
    } finally {
      setSaving(false);
    }
  }, [openSnackbar]);

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    try {
      openSnackbar?.(
        'Submit is not available yet - the Form 1205 submit endpoint is pending.',
        'info',
      );
    } finally {
      setSubmitting(false);
    }
  }, [openSnackbar]);

  const isExistingParty = form.isNewPartyOrAddress === 'no';

  return {
    form,
    handleFieldChange,
    saving,
    submitting,
    handleSaveForLater,
    handleSubmit,
    isExistingParty,
  };
};

export default useForm1205;
