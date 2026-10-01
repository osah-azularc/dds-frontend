import React from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, IconButton, Typography } from '@mui/material';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import FaxIcon from '@mui/icons-material/Fax';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Matches ecourt-frontend's DocketInformationStyle.js PartiesCard/
// PartiesCardTop/PartiesCardBody, used as-is by its own PartyInformation.jsx.
const CARD_SX = {
  border: '1px solid #d5d7db',
  height: '200px',
  borderRadius: '4px',
  overflow: 'hidden',
};
const CARD_TOP_SX = {
  background: '#f1f1f1',
  borderBottom: '1px solid #d5d7db',
  padding: '4px 16px',
};
const CARD_BODY_SX = { padding: '16px' };

const DetailRow = ({ icon, label, value }) => (
  <Box display="flex" mt={1}>
    <Box display="flex" mr={1}>
      {icon}
      <Typography variant="body2">{label}:</Typography>
    </Box>
    <Typography variant="body2">{value || '-'}</Typography>
  </Box>
);

DetailRow.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
};

DetailRow.defaultProps = { value: '' };

/**
 * One party's card in the "Party Information" section — matches
 * ecourt-frontend's own Docket/PartyInformation.jsx card exactly (contact
 * type heading, name, Phone/Email/Fax rows with icons, Edit/Delete icon
 * buttons in the card header).
 *
 * `locked` (see DocumentPartyPanel.jsx) hides the Delete icon, matching
 * legacy's own `ng-if="disable_btn_flg=='0'"` on that same trash icon in
 * form1.phtml. `canDelete` additionally hides it by the viewer's DDS
 * usertype (see utilities/form1Capabilities.js) -- helpdesk never gets it.
 * Edit stays visible unconditionally, matching legacy's own icon (also
 * unconditional there) -- a viewer without edit capability can still open
 * the dialog to look at a party's data, AddPartyModal just renders every
 * field read-only for them instead (ports form1.phtml's "Add-Party modal's
 * fields always disabled for helpdesk" rule onto the dialog, not the icon).
 *
 * `viewOnly` (dds_superuser's docket-detail view -- see Form1.jsx/
 * DocumentPartyPanel.jsx) replaces the Edit/Delete icons with a single
 * "View More" link instead -- there's no party-edit capability on that raw
 * `docket`-table view at all (no form1Id to save against), so an icon that
 * looks editable would be misleading. Opens the exact same dialog
 * (AddPartyModal) via the same onEdit callback, just always forced
 * read-only by the caller.
 */
const PartyInfoCard = ({ party, onEdit, onDelete, locked, canDelete, viewOnly }) => (
  <Box sx={CARD_SX}>
    <Grid container sx={CARD_TOP_SX} alignItems="center">
      <Grid item xs={6}>
        <Typography variant="h4">{party.typeOfContact || 'Contact'}</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="flex-end">
        {viewOnly ? (
          <Box
            component="button"
            type="button"
            onClick={() => onEdit(party)}
            sx={{
              background: 'none',
              border: 'none',
              padding: 0,
              font: 'inherit',
              color: 'text.secondary',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            View More
          </Box>
        ) : (
          <>
            <IconButton onClick={() => onEdit(party)} aria-label="Edit party">
              <EditIcon color="secondary" fontSize="small" />
            </IconButton>
            {!locked && canDelete && (
              <IconButton onClick={() => onDelete(party)} aria-label="Delete party">
                <DeleteIcon color="secondary" fontSize="small" />
              </IconButton>
            )}
          </>
        )}
      </Grid>
    </Grid>
    <Grid container sx={CARD_BODY_SX}>
      <Grid item xs={12}>
        <Typography variant="body2">
          {[party.lastName, party.firstName].filter(Boolean).join(', ') || null}
        </Typography>
        <DetailRow
          icon={<LocalPhoneIcon color="action" sx={{ fontSize: '18px', mr: '4px' }} />}
          label="Phone"
          value={party.phone}
        />
        <DetailRow
          icon={<MailOutlineIcon color="action" sx={{ fontSize: '18px', mr: '4px' }} />}
          label="Email"
          value={party.email && party.email !== 'No Email' ? party.email : ''}
        />
        <DetailRow
          icon={<FaxIcon color="action" sx={{ fontSize: '18px', mr: '4px' }} />}
          label="Fax"
          value={party.fax}
        />
      </Grid>
    </Grid>
  </Box>
);

PartyInfoCard.propTypes = {
  party: PropTypes.shape({
    typeOfContact: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    fax: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  locked: PropTypes.bool,
  canDelete: PropTypes.bool,
  viewOnly: PropTypes.bool,
};

PartyInfoCard.defaultProps = {
  locked: false,
  canDelete: false,
  viewOnly: false,
};

export default React.memo(PartyInfoCard);
