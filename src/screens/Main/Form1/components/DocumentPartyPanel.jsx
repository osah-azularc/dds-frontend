import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Grid, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteDialogue from '../../../../components/common/DeleteDialogue';
import { deleteForm1Party } from '../../../../services/form1PartyService';
import { showErrorSnackbar, showSuccessSnackbar } from '../../../../utilities/ErrorSnackBar';
import AddPartyModal from './AddPartyModal';
import DocumentTable from './DocumentTable';
import PartyInfoCard from './PartyInfoCard';

/**
 * Right column of the "Enter New Form 1" screen — Document & File
 * Management, Disposition, and Party Information. All actions stay
 * disabled until the docket exists (matches legacy's form1-new.phtml,
 * where these are plain `class="disable"` links with no click handler
 * until the Form 1 has been saved) — including when reviewing an existing
 * docket (Docket Search -> /form1/reqdt/:form1Id), where Add/Edit/Delete
 * Party are all wired up. The document table (Document/Name/Date/
 * Description) mirrors legacy's form1.phtml but has no documents endpoint
 * to source rows from yet, so it always shows "No records found." — same
 * as Party Information below when empty.
 *
 * Edit/Delete wiring mirrors ecourt-frontend's own
 * Docket/PartyInformation.jsx exactly: one AddPartyModal instance reused
 * for both Add and Edit (isEditMode/editData), plus a shared
 * DeleteDialogue confirmation before calling deleteForm1Party (ports
 * DdsForm1Controller::deletepartyAction()).
 *
 * Section header/button styling mirrors ecourt-frontend's own docket detail
 * page (DocumentFileManagement.jsx / Disposition.jsx / PartyInformation.jsx):
 * `Typography variant="h2" color="secondary"` headers, and
 * `Button color="primary" startIcon={<AddIcon />} fullWidth` action buttons
 * in a `Grid item xs={12} sm={6} md={3}` — disabled here, which the theme's
 * MuiButton override already renders as the grayed-out state. Add Party is
 * only enabled once the docket exists (`form1Id` set), matching the rest of
 * this panel's create-flow-disabled convention.
 *
 * `locked` (true once an existing docket's status is anything but Draft --
 * see Form1.jsx) hides Add Party outright, ports form1.phtml's own
 * `ng-show="readonly_flag=='0'"` on that same button (legacy locks once
 * status is Approved/In Review/Rejected/Closed, matching DDS's own
 * actualStatus !== 'pending' convention already used elsewhere, e.g.
 * Form1205Form.jsx/DocketTabBar.jsx). Passed through to PartyInfoCard too,
 * which hides its own Delete icon the same way (form1.phtml's
 * `ng-if="disable_btn_flg=='0'"`).
 *
 * `documents` now sources the table from dds-backend's /docketDetail/documents
 * (see form1DocumentService.js) -- Document Templates/Files stay disabled
 * above since uploading/adding a document is a separate feature not wired
 * up yet.
 */
const DocumentPartyPanel = ({
  parties,
  documents,
  form1Id,
  licenseNumberDefault,
  onPartyChanged,
  locked,
}) => {
  const [addPartyOpen, setAddPartyOpen] = useState(false);
  const [editingParty, setEditingParty] = useState(null);
  const [partyToDelete, setPartyToDelete] = useState(null);

  const isEditMode = Boolean(editingParty);

  const handleModalClose = () => {
    setAddPartyOpen(false);
    setEditingParty(null);
  };

  const handleModalSaved = () => {
    handleModalClose();
    onPartyChanged?.();
  };

  const handleDeleteConfirm = async () => {
    if (!partyToDelete) return;
    try {
      await deleteForm1Party(form1Id, partyToDelete.partyId, partyToDelete.typeOfContact);
      showSuccessSnackbar('Party deleted successfully!');
      onPartyChanged?.();
    } catch (error) {
      showErrorSnackbar(error.response?.data?.error || 'Failed to delete party.');
    }
  };

  return (
    <Box sx={{ backgroundColor: '#fff', p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h2" color="secondary">
            Document &amp; File Management
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button color="primary" startIcon={<AddIcon />} fullWidth disabled>
            Document Templates
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button color="primary" startIcon={<AddIcon />} fullWidth disabled>
            Files
          </Button>
        </Grid>
        <Grid item xs={12}>
          <DocumentTable documents={documents} />
        </Grid>

        <Grid item xs={12} sx={{ mt: 2 }}>
          <Typography variant="h2" color="secondary">
            Disposition
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button color="primary" startIcon={<AddIcon />} fullWidth disabled>
            Add Decision
          </Button>
        </Grid>

        <Grid item xs={12} sx={{ mt: 2 }}>
          <Typography variant="h2" color="secondary">
            Party Information
          </Typography>
        </Grid>
        {!locked && (
          <Grid item xs={12} sm={6} md={3}>
            <Button
              color="primary"
              startIcon={<AddIcon />}
              fullWidth
              disabled={!form1Id}
              onClick={() => setAddPartyOpen(true)}
            >
              Add Party
            </Button>
          </Grid>
        )}
        {parties.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              No records found.
            </Typography>
          </Grid>
        ) : (
          parties.map((party) => (
            <Grid item xs={12} sm={6} key={party.partyId}>
              <PartyInfoCard
                party={party}
                onEdit={setEditingParty}
                onDelete={setPartyToDelete}
                locked={locked}
              />
            </Grid>
          ))
        )}
      </Grid>

      {form1Id && (
        <AddPartyModal
          open={addPartyOpen || isEditMode}
          onClose={handleModalClose}
          form1Id={form1Id}
          licenseNumberDefault={licenseNumberDefault}
          editData={editingParty}
          isEditMode={isEditMode}
          onSaved={handleModalSaved}
        />
      )}

      <DeleteDialogue
        open={Boolean(partyToDelete)}
        onClose={() => setPartyToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Party"
        message="Do you want to delete this party?"
      />
    </Box>
  );
};

DocumentPartyPanel.propTypes = {
  parties: PropTypes.arrayOf(
    PropTypes.shape({
      partyId: PropTypes.number,
      typeOfContact: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      phone: PropTypes.string,
      email: PropTypes.string,
      fax: PropTypes.string,
    }),
  ),
  documents: PropTypes.arrayOf(
    PropTypes.shape({
      documentId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      documentType: PropTypes.string,
      documentName: PropTypes.string,
      dateRequested: PropTypes.string,
      description: PropTypes.string,
    }),
  ),
  form1Id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  licenseNumberDefault: PropTypes.string,
  onPartyChanged: PropTypes.func,
  locked: PropTypes.bool,
};

DocumentPartyPanel.defaultProps = {
  parties: [],
  documents: [],
  form1Id: undefined,
  locked: false,
  licenseNumberDefault: '',
  onPartyChanged: undefined,
};

export default React.memo(DocumentPartyPanel);
