import React from 'react';
import PropTypes from 'prop-types';
import { FormProvider } from 'react-hook-form';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from '@mui/material';
import { CONTACT_TYPE_OPTIONS } from '../addPartyConstants';
import useAddPartyForm from '../useAddPartyForm';
import {
  CONTACT_TYPE_VALIDATION_REQUIRED,
  FIRST_NAME_VALIDATION_REQUIRED,
  LAST_NAME_VALIDATION_REQUIRED,
} from '../../../../utilities/validationPatterns';
import { FormSelectField, FormTextField } from '../../../../components/common/reactHookFormFields';
import { AddressFields } from './AddPartyAddressFields';
import { LastNameSuggestField } from './addPartyFormFields';
import { ContactMethodFields, TypeSpecificFields } from './AddPartyFormSections';

/**
 * "Add Party" modal for the existing-docket review screen's Party
 * Information section. Field set/visibility rules are ported from the
 * legacy DDS portal's Add Party modal
 * (osah.repos/module/Osahform/view/osahform/dds/form1.phtml, lines
 * 586-897, and its form1-controller.js) -- Contact Type only ever offers
 * Petitioner/Petitioner Attorney there (Officer belongs to the separate
 * 1205-offence sub-form). Petitioner Attorney's Last Name field offers
 * autocomplete suggestions from attorneybycase_master (ports
 * autopopulateddsAction()/getddsinformationAction()). Built directly on
 * ecourt-frontend's own AddPartiesComponent.jsx / useAddPartiesForm.js /
 * addPartiesFormFields.jsx (react-hook-form + Controller, inline per-field
 * errors, unregister-hidden-fields) rather than a bespoke pattern -- every
 * field stays fully editable even after autopopulating from a suggestion.
 * Also doubles as the Edit Party dialog (isEditMode/editData), matching
 * ecourt-frontend's own AddPartiesComponent.jsx reuse pattern -- one dialog
 * for both, since the field set is identical.
 */
const AddPartyModal = ({
  open,
  onClose,
  form1Id,
  licenseNumberDefault,
  editData,
  isEditMode,
  onSaved,
}) => {
  const {
    formMethods,
    isPetitioner,
    isAttorney,
    isInternational,
    showAltAddress,
    toggleAltAddress,
    stateOptions,
    nameSuggestions,
    suggestionsLoading,
    saving,
    handleSelectSuggestion,
    handleSave,
  } = useAddPartyForm({
    open,
    form1Id,
    licenseNumberDefault,
    editData,
    isEditMode,
    onSaved,
    onClose,
  });

  const saveLabel = isEditMode ? 'Update' : 'Save';

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Typography variant="h2">{isEditMode ? 'Edit Party' : 'Add Party'}</Typography>
      </DialogTitle>
      <DialogContent>
        <FormProvider {...formMethods}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormSelectField
                name="contactType"
                label="Contact Type *"
                options={CONTACT_TYPE_OPTIONS}
                rules={CONTACT_TYPE_VALIDATION_REQUIRED}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              {isAttorney ? (
                <>
                  <LastNameSuggestField
                    rules={LAST_NAME_VALIDATION_REQUIRED}
                    suggestions={nameSuggestions}
                    onSelectSuggestion={handleSelectSuggestion}
                  />
                  {suggestionsLoading && (
                    <Typography variant="caption" color="text.secondary">
                      Loading records…
                    </Typography>
                  )}
                </>
              ) : (
                <FormTextField
                  name="lastName"
                  label="Last Name *"
                  rules={LAST_NAME_VALIDATION_REQUIRED}
                />
              )}
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormTextField
                name="firstName"
                label="First Name *"
                rules={FIRST_NAME_VALIDATION_REQUIRED}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormTextField name="middleName" label="Middle Name" />
            </Grid>

            <TypeSpecificFields isPetitioner={isPetitioner} isAttorney={isAttorney} />

            <AddressFields
              isInternational={isInternational}
              stateOptions={stateOptions}
              showAltButton={isPetitioner}
              showAltAddress={showAltAddress}
              onToggleAlt={toggleAltAddress}
            />

            <ContactMethodFields />

            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary">
                * Required Fields
              </Typography>
            </Grid>
          </Grid>
        </FormProvider>
      </DialogContent>
      <DialogActions>
        <Grid container spacing={2} justifyContent="center" sx={{ pb: 2 }}>
          <Grid item xs={12} sm={4}>
            <Button fullWidth color="secondary" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              onClick={handleSave}
              disabled={saving}
              startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
            >
              {saving ? 'Saving…' : saveLabel}
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

AddPartyModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  form1Id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  licenseNumberDefault: PropTypes.string,
  editData: PropTypes.object,
  isEditMode: PropTypes.bool,
  onSaved: PropTypes.func,
};

AddPartyModal.defaultProps = {
  licenseNumberDefault: '',
  editData: null,
  isEditMode: false,
  onSaved: undefined,
};

export default React.memo(AddPartyModal);
