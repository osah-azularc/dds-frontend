import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';

const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${month}-${day}-${date.getFullYear()}`;
};

/** A single "label / value" cell in the General Information grid. */
const FieldItem = ({ label, value }) => (
  <Grid item xs={12} sm={6} md={4}>
    <Typography
      variant="body2"
      sx={{ fontWeight: 500, fontSize: 13, color: 'text.secondary', mb: 0.25 }}
    >
      {label}
    </Typography>
    <Typography variant="body2" sx={{ fontSize: 16, fontWeight: 600 }}>
      {value || '-'}
    </Typography>
  </Grid>
);

FieldItem.propTypes = {
  label: PropTypes.node.isRequired,
  value: PropTypes.node,
};

FieldItem.defaultProps = {
  value: '',
};

/** Numbered circle + title heading above the General Information section. */
const SectionHeading = ({ step, title }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
    <Box
      sx={{
        width: 26,
        height: 26,
        borderRadius: '50%',
        bgcolor: 'primary.main',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mr: 1.5,
        flexShrink: 0,
      }}
    >
      <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600, fontSize: 13 }}>
        {step}
      </Typography>
    </Box>
    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
      {title}
    </Typography>
  </Box>
);

SectionHeading.propTypes = {
  step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
};

/**
 * Read-only detail modal for a Rejected Form 1 row: rejection reason banner + General
 * Information, opened from the grid's View/Review action. Layout mirrors the OSAH ecourt
 * app's ReviewForm1s detail panels (RejectionBanner / SectionHeading / FieldItem).
 */
const RejectedForm1DetailModal = ({ open, row, onClose, onView }) => {
  if (!row) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pr: 6 }}>
        <Typography variant="h2" component="h2">
          {row.caseName || 'Rejected Form 1'}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Agency Ref # {row.agencyRefNumber || '-'}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: 'grey.500' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {(row.rejectReason?.reasonType || row.rejectReason?.reason) && (
          <Paper sx={{ p: 2, mt: 3, mb: 3, bgcolor: '#f0f1f3' }} elevation={0}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
              Reason for Rejection
            </Typography>
            {row.rejectReason?.reasonType && (
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: 'text.secondary', mb: 0.5 }}
              >
                {row.rejectReason.reasonType}
              </Typography>
            )}
            {row.rejectReason?.reason && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {row.rejectReason.reason}
              </Typography>
            )}
          </Paper>
        )}

        <Box sx={{ mb: 1 }}>
          <SectionHeading step={1} title="General Information" />
          <Paper sx={{ p: 2 }} elevation={0}>
            <Grid container spacing={2}>
              <FieldItem label="Agency" value={row.refAgency} />
              <FieldItem label="Case Type" value={row.caseType} />
              <FieldItem label="Date of Request for Hearing" value={formatDate(row.dateEntered)} />
              <FieldItem label="Agency Reference Number" value={row.agencyRefNumber} />
              <FieldItem label="County" value={row.county} />
              <FieldItem label="Hearing Type" value={row.hearingMode} />
            </Grid>
          </Paper>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'center', gap: 2 }}>
        <Button variant="contained" color="secondary" onClick={onClose} sx={{ minWidth: 160 }}>
          Close
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onView?.(row)}
          sx={{ minWidth: 160 }}
        >
          {row.isResubmitted ? 'View' : 'Resubmit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

RejectedForm1DetailModal.propTypes = {
  open: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  row: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onView: PropTypes.func,
};

RejectedForm1DetailModal.defaultProps = {
  row: null,
  onView: undefined,
};

export default RejectedForm1DetailModal;
