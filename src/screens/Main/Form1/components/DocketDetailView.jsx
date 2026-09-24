import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import InfoIcon from '@mui/icons-material/Info';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box, Button, CircularProgress, Grid, Tab, TextField, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGridPro } from '@mui/x-data-grid-pro';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import DeleteDialogue from '../../../../components/dialogue/DeleteDialogue';
import RejectedForm1sLoadingOverlay from '../../RejectedForm1s/components/RejectedForm1sLoadingOverlay';
import { PERMIT_ELIGIBLE_OPTIONS } from '../constants/form1Constants';
import { useDocketDetailView } from '../useDocketDetailView';
import styles from '../Form1Style';
import AddPartyModal from './AddPartyModal';
import AttachFilesModal from './AttachFilesModal';
import DocumentTemplateModal from './DocumentTemplateModal';
import Form1205Panel from './Form1205Panel';
import Form1DatePicker from './Form1DatePicker';
import Form1SelectField from './Form1SelectField';
import HistoryTab from './HistoryTab';
import NotesTab from './NotesTab';
import PartyCard from './PartyCard';

const DOCUMENTS_LOADING_DELAY_MS = 800;

const FIELD_SX = { '& .MuiOutlinedInput-root': { backgroundColor: '#fff' } };

// DataGrid only sets a native `title` tooltip on cells that don't define a custom renderCell
// (see GridCell.js) - use this for plain text columns so that default hover tooltip never shows.
const renderPlainCell = (params) => params.formattedValue ?? params.value;

const DOCUMENT_COLUMNS = [
  {
    field: 'documentType',
    headerName: 'Document',
    flex: 1,
    minWidth: 140,
    renderCell: renderPlainCell,
  },
  { field: 'name', headerName: 'Name', flex: 1, minWidth: 140, renderCell: renderPlainCell },
  { field: 'date', headerName: 'Date', flex: 1, minWidth: 120, renderCell: renderPlainCell },
  {
    field: 'description',
    headerName: 'Description',
    flex: 1,
    minWidth: 160,
    renderCell: renderPlainCell,
  },
];

const SummaryField = ({ label, value }) => (
  <Grid item xs={6}>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body1" fontWeight={600}>
      {value || '...'}
    </Typography>
  </Grid>
);

SummaryField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node,
};

/**
 * Full docket detail/edit view, opened from a search results row (see
 * SearchResultsPage's onRowClick). There's no fetch-by-docket-id endpoint
 * yet, so every field is seeded from that row's own data - see
 * useDocketDetailView and DUMMY_SEARCH_RESULTS.
 *
 * TODO: once real DDS endpoints exist, fetch the docket by id here instead.
 * Form 1205 is built out - see Form1205Panel/useForm1205. History and Notes
 * are wired to the real /docketDetail endpoints - see HistoryTab/NotesTab.
 */
const DocketDetailView = ({ docketId, docket = null }) => {
  const theme = useTheme();
  const classes = styles(theme);
  const {
    tab,
    setTab,
    form,
    handleFieldChange,
    fieldOptions,
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
  } = useDocketDetailView(docket);

  const documentRows = useMemo(
    () =>
      documents.map((document, index) => ({
        id: document.id ?? index,
        ...document,
      })),
    [documents],
  );

  // No documents endpoint yet (see the TODO above) - documentRows is seeded
  // straight from the docket, so simulate a brief fetch delay here purely to
  // show the loading skeleton instead of the table popping in instantly.
  const [documentsLoading, setDocumentsLoading] = useState(true);
  useEffect(() => {
    setDocumentsLoading(true);
    const timeoutId = setTimeout(() => setDocumentsLoading(false), DOCUMENTS_LOADING_DELAY_MS);
    return () => clearTimeout(timeoutId);
  }, [docket]);

  // No fetch-by-id endpoint yet (see the TODO above), so a direct visit to
  // this URL - rather than a click from search results, which passes the
  // row via router state - has nothing to render.
  if (!docket) {
    return (
      <Box p={3}>
        <Typography variant="body1" color="text.secondary">
          Docket #{docketId} isn&apos;t available - open it from search results instead.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container direction="column">
      <Grid item xs={12}>
        <TabContext value={tab}>
          <Box sx={classes.DetailTabBar}>
            <TabList onChange={(_, newValue) => setTab(newValue)} aria-label="docket detail tabs">
              <Tab
                icon={<InfoIcon fontSize="small" />}
                iconPosition="start"
                label="General Information"
                value="1"
              />
              <Tab
                icon={<DescriptionOutlinedIcon fontSize="small" />}
                iconPosition="start"
                label="Form 1205"
                value="2"
              />
              <Tab
                icon={<HistoryOutlinedIcon fontSize="small" />}
                iconPosition="start"
                label="History"
                value="3"
              />
              <Tab
                icon={<EditNoteOutlinedIcon fontSize="small" />}
                iconPosition="start"
                label="Notes"
                value="4"
              />
            </TabList>

            <Box sx={classes.DetailTabBarActions}>
              <Box sx={classes.DetailTabBarMessage}>
                <WarningAmberOutlinedIcon sx={{ color: '#fff', mt: '2px' }} fontSize="small" />
                <Typography variant="body2" sx={classes.DetailTabBarMessageText}>
                  This case will not be received by OSAH
                  <br />
                  until the 91 day or 1205 has been submitted
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<DeleteOutlineIcon />}
                onClick={handleDeleteClick}
                sx={{ flexShrink: 0 }}
              >
                Delete Form1
              </Button>
            </Box>
          </Box>

          <TabPanel value="1" className="CustomTabPanel">
            <Grid container sx={classes.ContentContainer}>
              <Grid item xs={12} md={4} sx={classes.LeftPanel}>
                <Typography variant="h2" color="secondary" sx={classes.SectionTitle}>
                  Form1 Information
                </Typography>
                <Grid container spacing={2}>
                  <SummaryField label="Agency Code" value="DDS" />
                  <SummaryField label="Case Type" value={docket?.caseType} />
                  <SummaryField label="County" value={docket?.county || 'No County'} />
                  <SummaryField label="Status" value={docket?.status} />
                </Grid>

                <Box sx={classes.SectionSpacing}>
                  <Typography variant="h2" color="secondary" sx={classes.SectionTitle}>
                    Hearing Information
                  </Typography>
                  <Grid container spacing={2.5}>
                    <Grid item xs={12}>
                      <Form1SelectField
                        label="Location"
                        options={fieldOptions.hearingLocation}
                        value={form.hearingLocation}
                        onChange={(value) => handleFieldChange('hearingLocation', value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Form1DatePicker
                        label="Hearing Date"
                        value={form.hearingDate}
                        onChange={(value) => handleFieldChange('hearingDate', value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Form1SelectField
                        label="Hearing Time"
                        options={fieldOptions.hearingTime}
                        value={form.hearingTime}
                        onChange={(value) => handleFieldChange('hearingTime', value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Form1SelectField
                        label="Judge"
                        options={fieldOptions.judge}
                        value={form.judge}
                        onChange={(value) => handleFieldChange('judge', value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Form1SelectField
                        label="Judge Assistant"
                        options={fieldOptions.judgeAssistant}
                        value={form.judgeAssistant}
                        onChange={(value) => handleFieldChange('judgeAssistant', value)}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Box sx={classes.SectionSpacing}>
                  <Typography variant="h2" color="secondary" sx={classes.SectionTitle}>
                    Additional Information
                  </Typography>
                  <Grid container spacing={2.5}>
                    <Grid item xs={12} sm={6}>
                      <Form1DatePicker
                        label="Date Requested"
                        value={form.dateRequested}
                        onChange={(value) => handleFieldChange('dateRequested', value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Form1DatePicker
                        label="Date Received"
                        value={form.dateReceived}
                        onChange={(value) => handleFieldChange('dateReceived', value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Agency Reference Number"
                        variant="outlined"
                        fullWidth
                        size="small"
                        sx={FIELD_SX}
                        value={form.agencyRefNumber}
                        onChange={(e) => handleFieldChange('agencyRefNumber', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Form1SelectField
                        label="Hearing Type"
                        options={fieldOptions.hearingType}
                        value={form.hearingType}
                        onChange={(value) => handleFieldChange('hearingType', value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Form1DatePicker
                        label="Date Entered"
                        value={form.dateEntered}
                        onChange={(value) => handleFieldChange('dateEntered', value)}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Box sx={classes.SectionSpacing}>
                  <Typography variant="h2" color="secondary" sx={classes.SectionTitle}>
                    Temporary Permit
                  </Typography>
                  <Grid container spacing={2.5}>
                    <Grid item xs={12} sm={6}>
                      <Form1SelectField
                        label="Eligible for a Permit?"
                        options={PERMIT_ELIGIBLE_OPTIONS}
                        value={form.eligibleForPermit}
                        onChange={(value) => handleFieldChange('eligibleForPermit', value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Form1DatePicker
                        label="Permit Effective Date"
                        value={form.permitEffectiveDate}
                        onChange={(value) => handleFieldChange('permitEffectiveDate', value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Form1DatePicker
                        label="Permit Expiration Date"
                        value={form.permitExpirationDate}
                        onChange={(value) => handleFieldChange('permitExpirationDate', value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Form1DatePicker
                        label="Date of Birth"
                        value={form.dateOfBirth}
                        onChange={(value) => handleFieldChange('dateOfBirth', value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Form1DatePicker
                        label="Incident Date"
                        value={form.incidentDate}
                        onChange={(value) => handleFieldChange('incidentDate', value)}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Grid container spacing={2.5} sx={classes.SectionSpacing}>
                  <Grid item xs={12} sm={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={handleSave}
                      disabled={saving}
                      startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
                    >
                      {saving ? 'Saving…' : 'Save'}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} md={8} sx={classes.RightPanel}>
                <Box sx={classes.RightPanelContent}>
                  <Typography variant="h2" color="secondary" sx={classes.SectionTitle}>
                    Document &amp; File Management
                  </Typography>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Button
                        fullWidth
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleDocumentTemplateOpen}
                      >
                        Document Templates
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Button
                        fullWidth
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleAttachFilesOpen}
                      >
                        Files
                      </Button>
                    </Grid>
                  </Grid>

                  <Box sx={classes.DocumentDataGrid}>
                    <DataGridPro
                      autoHeight
                      rows={documentsLoading ? [] : documentRows}
                      columns={DOCUMENT_COLUMNS}
                      disableRowSelectionOnClick
                      disableColumnMenu
                      loading={documentsLoading}
                      pagination
                      initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
                      pageSizeOptions={[10, 25, 50, 100]}
                      hideFooter={!documentsLoading && documentRows.length === 0}
                      localeText={{ noRowsLabel: 'No records found.' }}
                      slots={{ loadingOverlay: RejectedForm1sLoadingOverlay }}
                      slotProps={{ loadingOverlay: { columns: DOCUMENT_COLUMNS, rowCount: 3 } }}
                    />
                  </Box>

                  <Box sx={classes.SectionSpacing}>
                    <Typography variant="h2" color="secondary" sx={classes.SectionTitle}>
                      Party Information
                    </Typography>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Button
                          fullWidth
                          color="primary"
                          startIcon={<AddIcon />}
                          onClick={handleAddPartyOpen}
                        >
                          Add Party
                        </Button>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      {parties.map((party) => (
                        <Grid item xs={12} sm={6} key={party.id ?? `${party.role}-${party.name}`}>
                          <PartyCard
                            role={party.role}
                            name={party.name}
                            phone={party.phone}
                            email={party.email}
                            fax={party.fax}
                            onEdit={() => handleEditPartyOpen(party)}
                            onDelete={() => handleDeletePartyClick(party)}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value="2" className="CustomTabPanel" sx={{ p: 0 }}>
            <Form1205Panel classes={classes} />
          </TabPanel>
          <TabPanel value="3" className="CustomTabPanel" sx={{ p: 0 }}>
            <HistoryTab caseId={docketId} />
          </TabPanel>
          <TabPanel value="4" className="CustomTabPanel" sx={{ p: 0 }}>
            <NotesTab caseId={docketId} />
          </TabPanel>
        </TabContext>
      </Grid>

      <DeleteDialogue
        open={deleteDocketOpen}
        onClose={handleDeleteDialogClose}
        onConfirm={handleDelete}
        title="Delete"
        message="Are you sure you would like to delete this docket?"
      />

      <DeleteDialogue
        open={Boolean(partyToDelete)}
        onClose={handleDeletePartyDialogClose}
        onConfirm={handleDeleteParty}
        title="Delete Party"
        message="Do you want to delete the party?"
      />

      <AddPartyModal
        open={partyModalOpen}
        party={editingParty}
        onClose={handlePartyModalClose}
        onSave={handleSaveParty}
      />

      <DocumentTemplateModal
        open={documentTemplateOpen}
        parties={parties}
        onClose={handleDocumentTemplateClose}
        onAction={handleDocumentTemplateAction}
      />

      <AttachFilesModal
        open={attachFilesOpen}
        onClose={handleAttachFilesClose}
        onAttach={handleAttachFile}
      />
    </Grid>
  );
};

DocketDetailView.propTypes = {
  docketId: PropTypes.string.isRequired,
  docket: PropTypes.shape({
    caseType: PropTypes.string,
    county: PropTypes.string,
    status: PropTypes.string,
    parties: PropTypes.arrayOf(
      PropTypes.shape({
        role: PropTypes.string,
        name: PropTypes.string,
        phone: PropTypes.string,
        email: PropTypes.string,
        fax: PropTypes.string,
      }),
    ),
    documents: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        documentType: PropTypes.string,
        name: PropTypes.string,
        date: PropTypes.string,
        description: PropTypes.string,
      }),
    ),
  }),
};

export default DocketDetailView;
