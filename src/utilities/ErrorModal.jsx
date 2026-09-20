import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuthAPI } from '../HOCs/AuthProvider';

const ErrorModal = () => {
  const navigate = useNavigate();
  const { errorModalTrigger, errorTitle, errorMessage, setErrorModalTrigger } = useAuthAPI();

  const handleError = () => {
    setErrorModalTrigger(false);
    navigate('/');
  };

  return (
    <Dialog open={errorModalTrigger} aria-labelledby="reject-case-dialog" maxWidth="sm">
      <DialogTitle className="DialogTitleBox">
        <Typography aria-label="reject-case" variant="h2" component="h2" className="DialogHeading">
          {errorTitle}
        </Typography>
      </DialogTitle>
      <Divider className="DialogDivider" />
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="caption" component="div" className="DialogSubHeading">
              {errorMessage}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          type="submit"
          onClick={handleError}
          size="medium"
          aria-label="Close Case"
          autoFocus
          color="primary"
          variant="contained"
        >
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ErrorModal;
