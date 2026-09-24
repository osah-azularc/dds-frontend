import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { CONTACT_TYPE_OPTIONS, US_STATE_OPTIONS } from '../constants/form1Constants';
import Form1SelectField from './Form1SelectField';

const FIELD_SX = { '& .MuiOutlinedInput-root': { backgroundColor: '#fff' } };

const EMPTY_FORM = {
  contactType: '',
  lastName: '',
  firstName: '',
  middleName: '',
  title: '',
  companyName: '',
  isInternational: 'no',
  internationalAddress: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  zipCode: '',
  phone: '',
  email: '',
  fax: '',
};

const splitName = (name = '') => {
  const [firstName = '', ...rest] = name.trim().split(/\s+/);
  return { firstName, lastName: rest.join(' ') };
};

/**
 * Add/Edit Party dialog for a Form 1 docket - mirrors the ecourt OSAH app's
 * AddPartiesComponent field layout (Contact Type, name, title/company,
 * international-address toggle, address, phone/email/fax) trimmed to a flat
 * form, since there's no per-contact-type show/hide rules or address/state
 * lookup data here yet.
 */
const AddPartyModal = ({ open, party, onClose, onSave }) => {
  const isEditMode = Boolean(party);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (!open) return;
    if (party) {
      setForm({
        ...EMPTY_FORM,
        ...splitName(party.name),
        contactType: party.role ?? '',
        phone: party.phone ?? '',
        email: party.email ?? '',
        fax: party.fax ?? '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [open, party]);

  const handleFieldChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const isInternational = form.isInternational === 'yes';
  const canSave =
    Boolean(form.contactType) &&
    Boolean(form.lastName) &&
    (isInternational
      ? Boolean(form.internationalAddress)
      : Boolean(form.addressLine1) && Boolean(form.city) && Boolean(form.state) && Boolean(form.zipCode));

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      role: form.contactType,
      name: `${form.firstName} ${form.lastName}`.trim(),
      title: form.title,
      companyName: form.companyName,
      isInternational,
      internationalAddress: form.internationalAddress,
      addressLine1: form.addressLine1,
      addressLine2: form.addressLine2,
      city: form.city,
      state: form.state,
      zipCode: form.zipCode,
      phone: form.phone,
      email: form.email,
      fax: form.fax,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ pr: 6 }}>
        <Typography variant="h2">{isEditMode ? 'Edit Party' : 'Add New Party'}</Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: 'grey.500' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Form1SelectField
              label="Contact Type *"
              options={CONTACT_TYPE_OPTIONS}
              value={form.contactType}
              onChange={(value) => handleFieldChange('contactType', value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Last Name *"
              variant="outlined"
              fullWidth
              size="small"
              sx={FIELD_SX}
              value={form.lastName}
              onChange={(e) => handleFieldChange('lastName', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="First Name"
              variant="outlined"
              fullWidth
              size="small"
              sx={FIELD_SX}
              value={form.firstName}
              onChange={(e) => handleFieldChange('firstName', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Middle Name"
              variant="outlined"
              fullWidth
              size="small"
              sx={FIELD_SX}
              value={form.middleName}
              onChange={(e) => handleFieldChange('middleName', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              size="small"
              sx={FIELD_SX}
              value={form.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <TextField
              label="Company Name"
              variant="outlined"
              fullWidth
              size="small"
              sx={FIELD_SX}
              value={form.companyName}
              onChange={(e) => handleFieldChange('companyName', e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Is this an international address?
            </Typography>
            <RadioGroup
              row
              value={form.isInternational}
              onChange={(e) => handleFieldChange('isInternational', e.target.value)}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </Grid>

          {isInternational ? (
            <Grid item xs={12}>
              <TextField
                label="International Address *"
                variant="outlined"
                fullWidth
                minRows={4}
                multiline
                sx={FIELD_SX}
                value={form.internationalAddress}
                onChange={(e) => handleFieldChange('internationalAddress', e.target.value)}
              />
            </Grid>
          ) : (
            <>
              <Grid item xs={12}>
                <TextField
                  label="Address Line 1 *"
                  variant="outlined"
                  fullWidth
                  size="small"
                  sx={FIELD_SX}
                  value={form.addressLine1}
                  onChange={(e) => handleFieldChange('addressLine1', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Address Line 2"
                  variant="outlined"
                  fullWidth
                  size="small"
                  sx={FIELD_SX}
                  value={form.addressLine2}
                  onChange={(e) => handleFieldChange('addressLine2', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="City *"
                  variant="outlined"
                  fullWidth
                  size="small"
                  sx={FIELD_SX}
                  value={form.city}
                  onChange={(e) => handleFieldChange('city', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Form1SelectField
                  label="State *"
                  options={US_STATE_OPTIONS}
                  value={form.state}
                  onChange={(value) => handleFieldChange('state', value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Zip Code *"
                  variant="outlined"
                  fullWidth
                  size="small"
                  sx={FIELD_SX}
                  value={form.zipCode}
                  onChange={(e) => handleFieldChange('zipCode', e.target.value)}
                />
              </Grid>
            </>
          )}

          <Grid item xs={12} sm={4}>
            <TextField
              label="Phone"
              variant="outlined"
              fullWidth
              size="small"
              sx={FIELD_SX}
              value={form.phone}
              onChange={(e) => handleFieldChange('phone', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              size="small"
              sx={FIELD_SX}
              value={form.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Fax"
              variant="outlined"
              fullWidth
              size="small"
              sx={FIELD_SX}
              value={form.fax}
              onChange={(e) => handleFieldChange('fax', e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">
              * Required Fields
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={6} md={3}>
            <Button onClick={onClose} color="secondary" fullWidth>
              Cancel
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button onClick={handleSave} disabled={!canSave} fullWidth>
              {isEditMode ? 'Update' : 'Save'}
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

AddPartyModal.propTypes = {
  open: PropTypes.bool.isRequired,
  party: PropTypes.shape({
    role: PropTypes.string,
    name: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    fax: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

AddPartyModal.defaultProps = {
  party: null,
};

export default AddPartyModal;
