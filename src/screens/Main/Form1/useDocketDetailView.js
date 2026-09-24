import dayjs from 'dayjs';
import { useCallback, useContext, useMemo, useState } from 'react';
import { SnackbarContext } from '../../../context/snackbarContext';
import { formatTime } from '../Home/utils/searchResultsUtils';
import { PERMIT_ELIGIBLE_OPTIONS } from './constants/form1Constants';

const toDayjs = (value) => (value ? dayjs(value) : null);

const DETAIL_FIELDS = [
  'hearingLocation',
  'hearingTime',
  'judge',
  'judgeAssistant',
  'hearingType',
  'agencyRefNumber',
];
const DETAIL_DATE_FIELDS = [
  'hearingDate',
  'dateRequested',
  'dateReceived',
  'dateEntered',
  'permitEffectiveDate',
  'permitExpirationDate',
  'dateOfBirth',
  'incidentDate',
];

const buildInitialForm = (docket) => {
  const form = {};
  DETAIL_FIELDS.forEach((field) => {
    form[field] = docket?.[field] ?? '';
  });
  DETAIL_DATE_FIELDS.forEach((field) => {
    form[field] = toDayjs(docket?.[field]);
  });
  form.eligibleForPermit = docket?.eligibleForPermit === 'Yes' ? 'YES' : 'NO';
  return form;
};

// A single-option list built from the docket's own value - there's no
// lookup-data endpoint yet (see form1Constants.js), so this just lets the
// select display what the row already had instead of a full catalog.
const optionsFor = (value, formatLabel = (v) => v) =>
  value ? [{ label: formatLabel(value), value }] : [];

/**
 * Owns the docket detail view's editable field state, opened from a search
 * results row (see SearchResultsPage's onRowClick).
 *
 * TODO: wire handleSave/handleDelete to real DDS docket endpoints, and fetch
 * the full docket by id instead of relying on the search results row, once
 * those exist on the backend - mirrors the TODOs already left elsewhere in
 * this app (Home search, Form1 create, Temporary Permits).
 */
export const useDocketDetailView = (docket) => {
  const openSnackbar = useContext(SnackbarContext);
  const [tab, setTab] = useState('1');
  const [form, setForm] = useState(() => buildInitialForm(docket));
  const [saving, setSaving] = useState(false);
  const [deleteDocketOpen, setDeleteDocketOpen] = useState(false);
  const [parties, setParties] = useState(() => docket?.parties ?? []);
  const [partyToDelete, setPartyToDelete] = useState(null);
  const [partyModalOpen, setPartyModalOpen] = useState(false);
  const [editingParty, setEditingParty] = useState(null);
  const [documents, setDocuments] = useState(() => docket?.documents ?? []);
  const [documentTemplateOpen, setDocumentTemplateOpen] = useState(false);
  const [attachFilesOpen, setAttachFilesOpen] = useState(false);

  const handleFieldChange = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      openSnackbar?.('Save is not available yet - the update-docket endpoint is pending.', 'info');
    } finally {
      setSaving(false);
    }
  }, [openSnackbar]);

  const handleDeleteClick = useCallback(() => setDeleteDocketOpen(true), []);
  const handleDeleteDialogClose = useCallback(() => setDeleteDocketOpen(false), []);

  const handleDelete = useCallback(() => {
    openSnackbar?.('Delete is not available yet - the delete-Form1 endpoint is pending.', 'info');
  }, [openSnackbar]);

  const handleDeletePartyClick = useCallback((party) => setPartyToDelete(party), []);
  const handleDeletePartyDialogClose = useCallback(() => setPartyToDelete(null), []);

  const handleDeleteParty = useCallback(() => {
    if (!partyToDelete) return;
    setParties((prev) => prev.filter((party) => party !== partyToDelete));
    openSnackbar?.('Party deleted.', 'success');
  }, [partyToDelete, openSnackbar]);

  const handleAddPartyOpen = useCallback(() => {
    setEditingParty(null);
    setPartyModalOpen(true);
  }, []);

  const handleEditPartyOpen = useCallback((party) => {
    setEditingParty(party);
    setPartyModalOpen(true);
  }, []);

  const handlePartyModalClose = useCallback(() => {
    setPartyModalOpen(false);
    setEditingParty(null);
  }, []);

  const handleSaveParty = useCallback(
    (partyData) => {
      setParties((prev) => {
        if (editingParty) {
          return prev.map((party) => (party === editingParty ? { ...party, ...partyData } : party));
        }
        return [...prev, { ...partyData, id: Date.now() }];
      });
      openSnackbar?.(editingParty ? 'Party updated.' : 'Party added.', 'success');
      setPartyModalOpen(false);
      setEditingParty(null);
    },
    [editingParty, openSnackbar],
  );

  const handleDocumentTemplateOpen = useCallback(() => setDocumentTemplateOpen(true), []);
  const handleDocumentTemplateClose = useCallback(() => setDocumentTemplateOpen(false), []);

  const handleDocumentTemplateAction = useCallback(() => {
    openSnackbar?.(
      'Document templates are not available yet - the template endpoint is pending.',
      'info',
    );
  }, [openSnackbar]);

  const handleAttachFilesOpen = useCallback(() => setAttachFilesOpen(true), []);
  const handleAttachFilesClose = useCallback(() => setAttachFilesOpen(false), []);

  const handleAttachFile = useCallback(
    (fileData) => {
      setDocuments((prev) => [...prev, { id: Date.now(), ...fileData }]);
      openSnackbar?.('File attached.', 'success');
      setAttachFilesOpen(false);
    },
    [openSnackbar],
  );

  const fieldOptions = useMemo(
    () => ({
      hearingLocation: optionsFor(docket?.hearingLocation),
      hearingTime: optionsFor(docket?.hearingTime, formatTime),
      judge: optionsFor(docket?.judge),
      judgeAssistant: optionsFor(docket?.judgeAssistant),
      hearingType: optionsFor(docket?.hearingType),
    }),
    [docket],
  );

  return {
    tab,
    setTab,
    form,
    handleFieldChange,
    fieldOptions,
    permitEligibleOptions: PERMIT_ELIGIBLE_OPTIONS,
    saving,
    handleSave,
    deleteDocketOpen,
    handleDeleteClick,
    handleDeleteDialogClose,
    handleDelete,
    parties,
    partyToDelete,
    handleDeletePartyClick,
    handleDeletePartyDialogClose,
    handleDeleteParty,
    partyModalOpen,
    editingParty,
    handleAddPartyOpen,
    handleEditPartyOpen,
    handlePartyModalClose,
    handleSaveParty,
    documents,
    documentTemplateOpen,
    handleDocumentTemplateOpen,
    handleDocumentTemplateClose,
    handleDocumentTemplateAction,
    attachFilesOpen,
    handleAttachFilesOpen,
    handleAttachFilesClose,
    handleAttachFile,
  };
};

export default useDocketDetailView;
