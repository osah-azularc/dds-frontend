import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { DOCUMENT_TEMPLATE_OPTIONS } from '../constants/form1Constants';
import Form1SelectField from './Form1SelectField';

/**
 * "+ Document Templates" dialog for a Form 1 docket - mirrors the ecourt OSAH
 * app's DocumentTemplateModal (template picker + description + mailer list,
 * Cancel/Download & Edit/Attach & Open actions). There's no template or
 * docx-generation endpoint here yet, so the action buttons report that via
 * onAction instead of producing a real file.
 */
const DocumentTemplateModal = ({ open, parties, onClose, onAction }) => {
  const [template, setTemplate] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMailerParties, setSelectedMailerParties] = useState([]);

  useEffect(() => {
    if (!open) return;
    setTemplate('');
    setDescription('');
    setSelectedMailerParties([]);
  }, [open]);

  const toggleMailerParty = (party) => {
    setSelectedMailerParties((prev) =>
      prev.includes(party) ? prev.filter((p) => p !== party) : [...prev, party],
    );
  };

  const canSubmit = Boolean(template) && selectedMailerParties.length > 0;

  const handleAction = () => {
    if (!canSubmit) return;
    onAction();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ pr: 6 }}>
        <Typography variant="h2">Document Template</Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: 'grey.500' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <Form1SelectField
              label="Template"
              options={DOCUMENT_TEMPLATE_OPTIONS}
              value={template}
              onChange={setTemplate}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              minRows={4}
              multiline
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h4" color="secondary">
              Mailer List <i style={{ fontWeight: 400 }}>(Select parties to be on the mailer list)</i>
            </Typography>
            {parties.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                No parties on this docket yet.
              </Typography>
            ) : (
              <Grid container>
                {parties.map((party) => (
                  <Grid item xs={12} sm={6} key={`${party.role}-${party.name}`}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedMailerParties.includes(party)}
                          onChange={() => toggleMailerParty(party)}
                        />
                      }
                      label={`${party.name} (${party.role})`}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={4}>
            <Button onClick={onClose} color="secondary" fullWidth>
              Cancel
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button onClick={handleAction} disabled={!canSubmit} fullWidth>
              Download &amp; Edit
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button onClick={handleAction} disabled={!canSubmit} fullWidth>
              Attach &amp; Open
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

DocumentTemplateModal.propTypes = {
  open: PropTypes.bool.isRequired,
  parties: PropTypes.arrayOf(
    PropTypes.shape({ role: PropTypes.string, name: PropTypes.string }),
  ),
  onClose: PropTypes.func.isRequired,
  onAction: PropTypes.func.isRequired,
};

DocumentTemplateModal.defaultProps = {
  parties: [],
};

export default DocumentTemplateModal;
