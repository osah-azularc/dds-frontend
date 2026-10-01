import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Button, CircularProgress, Tab, Tabs, Tooltip, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import HistoryIcon from '@mui/icons-material/History';
import EditNoteIcon from '@mui/icons-material/EditNote';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DeleteDialogue from '../../../../components/common/DeleteDialogue';
import { deleteDdsDocket } from '../../../../services/form1Service';
import { downloadCaseFilesZip } from '../../../../services/searchResultsService';
import { showErrorSnackbar, showSuccessSnackbar } from '../../../../utilities/ErrorSnackBar';
import { FORM1_CAPABILITIES, hasForm1Capability } from '../../../../utilities/form1Capabilities';
import { useConfirmDialog } from '../../../../hooks/useConfirmDialog';

const DOWNLOAD_BUTTON_SX = {
  backgroundColor: '#D4A500',
  color: '#fff',
  textTransform: 'none',
  fontWeight: 600,
  '&:hover': { backgroundColor: '#C49500' },
};

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
 *
 * Form 1205/History/Notes are hidden entirely (not just disabled) for
 * dds_superuser (OTHER_TABS_VIEW, utilities/form1Capabilities.js) -- that
 * usertype only ever gets General Information here, matching its narrower
 * oversight role in legacy rather than clerk/helpdesk's full per-docket
 * data-entry tab set.
 *
 * `isSuperuserView` replaces the "{status} by OSAH" text with a "Download File" button
 * instead -- legacy's own superuser docket screen (sudocketcontroller.js's
 * DocketFactory.singlefiledownload, sudocket.phtml) has this single-docket download in
 * that same slot, which the regular clerk existing-docket review (form1.phtml) doesn't
 * have at all. Reuses the same zip-download service and "Attention: Files over 250 MB
 * will not be downloaded" confirmation as the Docket Search results page's own Download
 * Case Files action (searchResultsService.js/useConfirmDialog.jsx) -- always downloads
 * 'case-files' for this one caseId, matching legacy's flag:1 (no case-files/decisions
 * choice for a single docket).
 */
const DocketTabBar = ({
  status,
  actualStatus,
  form1Id,
  activeTab,
  hasPetitioner,
  isSuperuserView,
  caseId,
}) => {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const userType = useSelector((state) => state.user.user_type);
  const canViewOtherTabs = hasForm1Capability(userType, FORM1_CAPABILITIES.OTHER_TABS_VIEW);
  const { showConfirmDialog, ConfirmDialog } = useConfirmDialog();

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

  const runDownload = async () => {
    try {
      setDownloading(true);
      await downloadCaseFilesZip([caseId], 'case-files');
      showSuccessSnackbar('Download completed successfully!');
    } catch (error) {
      showErrorSnackbar(error.message || 'Error downloading files. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadClick = () => {
    showConfirmDialog(
      'Download File',
      'Attention: Files over 250 MB will not be downloaded',
      runDownload,
    );
  };

  return (
    <Box sx={TAB_BAR_SX}>
      <Tabs value={TAB_INDEX[activeTab]} sx={{ minWidth: 0, flex: '1 1 auto', maxWidth: '100%' }}>
        <Tab
          icon={<InfoOutlinedIcon fontSize="small" />}
          iconPosition="start"
          label="General Information"
          // dds_superuser's docket-detail view (/docket/reqdt/:caseId) has no form1Id -- this
          // is already its own General Information-equivalent (and only) tab, so clicking it
          // is a no-op rather than navigating to /form1/reqdt/undefined.
          onClick={() => form1Id && navigate(TAB_ROUTES.general(form1Id))}
        />
        {canViewOtherTabs &&
          (hasPetitioner ? (
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
          ))}
        {canViewOtherTabs && (
          <Tab
            icon={<HistoryIcon fontSize="small" />}
            iconPosition="start"
            label="History"
            onClick={() => navigate(TAB_ROUTES.history(form1Id))}
          />
        )}
        {canViewOtherTabs && (
          <Tab
            icon={<EditNoteIcon fontSize="small" />}
            iconPosition="start"
            label="Notes"
            onClick={() => navigate(TAB_ROUTES.notes(form1Id))}
          />
        )}
      </Tabs>
      {activeTab === 'general' && actualStatus === 'pending' && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningAmberOutlinedIcon sx={{ color: '#fff', mt: '2px' }} fontSize="small" />
            <Typography variant="body2" sx={{ color: '#fff' }}>
              This case will not be received by OSAH
              <br />
              until the 91 day or 1205 has been submitted
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
      {!(activeTab === 'general' && actualStatus === 'pending') &&
        (isSuperuserView ? (
          <Button
            variant="contained"
            onClick={handleDownloadClick}
            disabled={downloading}
            startIcon={downloading ? <CircularProgress size={16} color="inherit" /> : null}
            sx={DOWNLOAD_BUTTON_SX}
          >
            {downloading ? 'Downloading…' : 'Download File'}
          </Button>
        ) : (
          status &&
          status !== 'Draft' && (
            <Typography
              variant="body1"
              sx={{ color: '#fff', fontWeight: 700, whiteSpace: 'nowrap' }}
            >
              {status} by OSAH
            </Typography>
          )
        ))}

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
      {isSuperuserView && <ConfirmDialog />}
    </Box>
  );
};

DocketTabBar.propTypes = {
  status: PropTypes.string,
  actualStatus: PropTypes.string,
  form1Id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  activeTab: PropTypes.oneOf(['general', 'form1205', 'history', 'notes']),
  hasPetitioner: PropTypes.bool,
  // dds_superuser's docket-detail view (/docket/reqdt/:caseId) -- see Form1.jsx. Swaps the
  // "{status} by OSAH" text for a "Download File" button, which downloads this `caseId`'s
  // case files (legacy: DocketFactory.singlefiledownload).
  isSuperuserView: PropTypes.bool,
  caseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

DocketTabBar.defaultProps = {
  hasPetitioner: false,
  status: '',
  actualStatus: '',
  activeTab: 'general',
  form1Id: undefined,
  isSuperuserView: false,
  caseId: undefined,
};

export default React.memo(DocketTabBar);
