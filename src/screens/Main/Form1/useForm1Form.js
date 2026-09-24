import { useCallback, useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { SnackbarContext } from '../../../context/snackbarContext';
import { INITIAL_FORM1_STATE } from './constants/form1Constants';

const REQUIRED_FIELDS = {
  agencyCode: 'Agency Code is required',
  caseType: 'Case Type is required',
  dateRequested: 'Date Requested is required',
  agencyRefNumber: 'Agency Ref Number is required',
};

const validateForm = (form) => {
  const errors = {};
  Object.entries(REQUIRED_FIELDS).forEach(([field, message]) => {
    if (!form[field]) {
      errors[field] = message;
    }
  });
  return errors;
};

/**
 * Owns the "Enter New Form 1" form state, validation and save flow.
 *
 * TODO: wire handleSave to the real DDS create-Form1 endpoint once it exists
 * on the backend - mirrors the same TODO already left on the Home page's
 * Additional Search Options ("General search is not available yet.").
 */
export const useForm1Form = () => {
  const openSnackbar = useContext(SnackbarContext);
  const { firstName, lastName } = useSelector((state) => state.user);

  const [form, setForm] = useState(INITIAL_FORM1_STATE);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleFieldChange = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  }, []);

  const handleSave = useCallback(async () => {
    const errors = validateForm(form);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      openSnackbar?.('Please fill in all required fields.', 'error');
      return;
    }

    setSaving(true);
    try {
      // Backend endpoint for creating a Form 1 record doesn't exist yet.
      openSnackbar?.('Save is not available yet - the Form 1 create endpoint is pending.', 'info');
      setIsSaved(true);
    } finally {
      setSaving(false);
    }
  }, [form, openSnackbar]);

  const createdByName = isSaved ? [firstName, lastName].filter(Boolean).join(' ') : '';

  return {
    form,
    formErrors,
    saving,
    isSaved,
    createdByName,
    handleFieldChange,
    handleSave,
  };
};

export default useForm1Form;
