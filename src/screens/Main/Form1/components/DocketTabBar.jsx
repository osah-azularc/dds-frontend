import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Tab, Tabs, Tooltip, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import HistoryIcon from '@mui/icons-material/History';
import EditNoteIcon from '@mui/icons-material/EditNote';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DeleteDialogue from '../../../../components/common/DeleteDialogue';
import { deleteDdsDocket } from '../../../../services/form1Service';
import { showErrorSnackbar, showSuccessSnackbar } from '../../../../utilities/ErrorSnackBar';

// Matches ecourt-frontend's DocketInformationStyle.js TabListContainer —
// the colored case-tab bar (background/white tab text/indicator) shared by
// every docket detail screen.
const TAB_BAR_SX = {
  maxWidth: '100%',
  borderBottom: '1px solid',
  borderColor: 'divider',
  position: 'relative',
  px: 3,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#8d96a8',
  flexWrap: 'wrap',
  overflowX: 'auto',
  gap: '8px',
  '& .MuiTab-root': { color: '#fff' },
  '& .MuiTab-root.Mui-selected': { color: '#fff' },
  '& .MuiTabs-indicator': { height: '6px', borderRadius: '25px' },
};

const TAB_ROUTES = {
  general: (form1Id) => `/form1/reqdt/${form1Id}`,
  form1205: (form1Id) => `/form1/1205form/reqdt/${form1Id}`,
  history: (form1Id) => `/form1/history/reqdt/${form1Id}`,
  notes: (form1Id) => `/form1/notes/reqdt/${form1Id}`,
};
const TAB_INDEX = { general: 0, form1205: 1, history: 2, notes: 3 };

// Matches legacy's petitioner_flg-gated tab: form1.phtml/form1-notes.phtml only enable
// "Form 1205" once the docket has a Petitioner, showing a "please add a petitioner"
// tooltip on the disabled tab otherwise.
const NO_PETITIONER_TOOLTIP = 'To access this page, please add a petitioner.';

/**
 * Case-tab bar for the existing-docket review screen's General
 * Information/Form 1205/History/Notes tabs, plus the docket status on the
 * right — mirrors the legacy DDS portal's form1.phtml tab-block (which has
 * the same four tabs, DDS-specific vs. ecourt-frontend's own tab set) styled
 * like ecourt-frontend's DocketInformationMain tab bar. `activeTab` selects
 * which screen this instance is rendered from (each has its own route, see
 * appRoutes.jsx); Form 1205 is only enabled once `hasPetitioner` is true
 * (matches legacy's petitioner_flg gate).
 *
 * The right-hand side matches legacy's own per-tab markup exactly:
 * `actualStatus === 'pending'` (raw enum, i.e. a Draft the agency hasn't
 * finished) shows the "won't be received by OSAH" warning + Delete Form1 --
 * but only on the General Information tab, since form1-notes.phtml/
 * form1-history.phtml/form1-1205form.phtml never include that block at all
 * (only form1.phtml does). Any other status but "Draft" (display name)
 * shows "{status} by OSAH" on every tab (all four views include that part).
 * Neither shows anything for a Draft that isn't 'pending' -- shouldn't
 * happen, but matches legacy's two independent ng-ifs.
 *
 * Delete Form1 ports DdsForm1Controller::deletedocketAction() (confirmation
 * text/title match form1.phtml's own #deleteDocket modal exactly: "Delete" /
 * "Are you sure you would like to delete this docket?") and, on success,
 * navigates back to Home the same way legacy's deleteDocket() does
 * ($state.go('home')).
 */
const DocketTabBar = ({ status, actualStatus, form1Id, activeTab, hasPetitioner }) => {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await deleteDdsDocket(form1Id);
      showSuccessSnackbar('Docket deleted successfully!');
      navigate('/home', { replace: true });
    } catch (error) {
      showErrorSnackbar(
        error.response?.data?.error || 'Something went wrong! Please try again later.',
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box sx={TAB_BAR_SX}>
      <Tabs value={TAB_INDEX[activeTab]} sx={{ minWidth: 0, flex: '1 1 auto', maxWidth: '100%' }}>
        <Tab
          icon={<InfoOutlinedIcon fontSize="small" />}
          iconPosition="start"
          label="General Information"
          onClick={() => navigate(TAB_ROUTES.general(form1Id))}
        />
        {hasPetitioner ? (
          <Tab
            icon={<DescriptionOutlinedIcon fontSize="small" />}
            iconPosition="start"
            label="Form 1205"
            onClick={() => navigate(TAB_ROUTES.form1205(form1Id))}
          />
        ) : (
          <Tooltip title={NO_PETITIONER_TOOLTIP}>
            <span>
              <Tab
                icon={<DescriptionOutlinedIcon fontSize="small" />}
                iconPosition="start"
                label="Form 1205"
                disabled
              />
            </span>
          </Tooltip>
        )}
        <Tab
          icon={<HistoryIcon fontSize="small" />}
          iconPosition="start"
          label="History"
          onClick={() => navigate(TAB_ROUTES.history(form1Id))}
        />
        <Tab
          icon={<EditNoteIcon fontSize="small" />}
          iconPosition="start"
          label="Notes"
          onClick={() => navigate(TAB_ROUTES.notes(form1Id))}
        />
      </Tabs>
      {activeTab === 'general' && actualStatus === 'pending' && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#fff' }}>
            <WarningAmberIcon fontSize="small" />
            <Typography variant="body2">
              This case will not be received by OSAH until
              <br />
              the 91 day or 1205 has been submitted
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<DeleteOutlineIcon />}
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete Form1
          </Button>
        </Box>
      )}
      {!(activeTab === 'general' && actualStatus === 'pending') && status && status !== 'Draft' && (
        <Typography variant="body1" sx={{ color: '#fff', fontWeight: 700, whiteSpace: 'nowrap' }}>
          {status} by OSAH
        </Typography>
      )}

      {activeTab === 'general' && (
        <DeleteDialogue
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDeleteConfirm}
          title="Delete"
          message="Are you sure you would like to delete this docket?"
          confirmText={deleting ? 'Deleting…' : 'Delete'}
        />
      )}
    </Box>
  );
};

DocketTabBar.propTypes = {
  status: PropTypes.string,
  actualStatus: PropTypes.string,
  form1Id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  activeTab: PropTypes.oneOf(['general', 'form1205', 'history', 'notes']),
  hasPetitioner: PropTypes.bool,
};

DocketTabBar.defaultProps = {
  hasPetitioner: false,
  status: '',
  actualStatus: '',
  activeTab: 'general',
  form1Id: undefined,
};

export default React.memo(DocketTabBar);
