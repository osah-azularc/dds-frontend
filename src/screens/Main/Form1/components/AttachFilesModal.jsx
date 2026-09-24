import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import {
  Box,
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
import { useDropzone } from 'react-dropzone';
import { DOCUMENT_TYPE_OPTIONS } from '../constants/form1Constants';
import Form1DatePicker from './Form1DatePicker';
import Form1SelectField from './Form1SelectField';

const MAX_FILE_SIZE_BYTES = 250 * 1024 * 1024;

const formatFileSize = (bytes) => {
  if (!bytes) return '0 KB';
  const kb = bytes / 1024;
  return kb < 1024 ? `${kb.toFixed(0)} KB` : `${(kb / 1024).toFixed(1)} MB`;
};

const DROPZONE_SX = {
  textAlign: 'center',
  py: 4,
  border: '1px dashed',
  borderColor: 'divider',
  borderRadius: 1,
  cursor: 'pointer',
  '&:hover': { borderColor: 'primary.main', backgroundColor: 'primary.hover' },
};

const UPLOADED_FILE_SX = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: 1,
  py: 2,
  px: 2,
};

/**
 * "+ Files" dialog for a Form 1 docket - mirrors the ecourt OSAH app's
 * AttachFilesModal (document type + date filed + description + a single-file
 * dropzone, Cancel/Attach actions). There's no upload endpoint here yet, so
 * onAttach just adds the picked file's metadata to the docket's document list
 * locally instead of performing a real upload.
 */
const AttachFilesModal = ({ open, onClose, onAttach }) => {
  const [documentType, setDocumentType] = useState('');
  const [dateFiled, setDateFiled] = useState(null);
  const [description, setDescription] = useState('');
  const [isSealed, setIsSealed] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!open) return;
    setDocumentType('');
    setDateFiled(null);
    setDescription('');
    setIsSealed(false);
    setSelectedFile(null);
    setErrorMessage('');
  }, [open]);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage('File exceeds the 250 MB limit.');
      return;
    }
    setErrorMessage('');
    setSelectedFile(file);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, maxFiles: 1, multiple: false });

  const canAttach = Boolean(selectedFile) && Boolean(documentType) && Boolean(dateFiled);

  const handleAttach = () => {
    if (!canAttach) return;
    onAttach({
      documentType,
      name: selectedFile.name,
      date: dateFiled.format('MM-DD-YYYY'),
      description,
      isSealed,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ pr: 6 }}>
        <Typography variant="h2">Attach Files</Typography>
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
          <Grid item xs={12} sm={4}>
            <Form1SelectField
              label="Document Type"
              options={DOCUMENT_TYPE_OPTIONS}
              value={documentType}
              onChange={setDocumentType}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Form1DatePicker label="Date Filed" value={dateFiled} onChange={setDateFiled} />
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
              Add File*
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Note: You can only upload one file at a time (up to 250 MB).
            </Typography>
            {selectedFile ? (
              <Box sx={UPLOADED_FILE_SX}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <UploadFileOutlinedIcon color="primary" />
                  <Box>
                    <Typography variant="body1">{selectedFile.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatFileSize(selectedFile.size)}
                    </Typography>
                  </Box>
                </Box>
                <IconButton aria-label="remove-file" onClick={() => setSelectedFile(null)}>
                  <DeleteOutlineOutlinedIcon />
                </IconButton>
              </Box>
            ) : (
              <Box {...getRootProps()} sx={DROPZONE_SX}>
                <input {...getInputProps()} />
                <UploadFileOutlinedIcon sx={{ fontSize: 40 }} color="primary" />
                <Typography variant="h5" color="primary" sx={{ mt: 1 }}>
                  Click to upload
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  or drag and drop
                </Typography>
              </Box>
            )}
            {errorMessage && (
              <Typography variant="caption" color="error.main" sx={{ mt: 1, display: 'block' }}>
                {errorMessage}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox checked={isSealed} onChange={(e) => setIsSealed(e.target.checked)} />}
              label="Sealed Document"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={6} md={3}>
            <Button onClick={onClose} color="secondary" fullWidth>
              Cancel
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button onClick={handleAttach} disabled={!canAttach} fullWidth>
              Attach
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

AttachFilesModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAttach: PropTypes.func.isRequired,
};

export default AttachFilesModal;
