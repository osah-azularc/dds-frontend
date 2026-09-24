import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const ActionSection = ({ title, children, titleSx }) => (
  <Box>
    <Typography variant="h2" color="secondary" sx={titleSx}>
      {title}
    </Typography>
    <Grid container spacing={2}>
      {children}
    </Grid>
  </Box>
);

ActionSection.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string.isRequired,
  titleSx: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

/**
 * Document/decision/party actions for the case. All actions stay disabled
 * until the Form 1 record itself has been saved (there is nothing yet to
 * attach a document, decision or party to) - same gating as Ecourt's
 * NewDocket right-hand panel.
 */
const Form1ActionsPanel = ({ disabled, sectionTitleSx, sectionSpacingSx }) => (
  <>
    <ActionSection title="Document & File Management" titleSx={sectionTitleSx}>
      <Grid item xs={12} sm={6} md={4}>
        <Button fullWidth color="primary" startIcon={<AddIcon />} disabled={disabled}>
          Document Templates
        </Button>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Button fullWidth color="primary" startIcon={<AddIcon />} disabled={disabled}>
          Files
        </Button>
      </Grid>
    </ActionSection>

    <Box sx={sectionSpacingSx}>
      <ActionSection title="Disposition" titleSx={sectionTitleSx}>
        <Grid item xs={12} sm={6} md={4}>
          <Button fullWidth startIcon={<AddIcon />} disabled={disabled}>
            Add Decision
          </Button>
        </Grid>
      </ActionSection>
    </Box>

    <Box sx={sectionSpacingSx}>
      <ActionSection title="Party Information" titleSx={sectionTitleSx}>
        <Grid item xs={12} sm={6} md={4}>
          <Button fullWidth color="primary" startIcon={<AddIcon />} disabled={disabled}>
            Add Party
          </Button>
        </Grid>
      </ActionSection>
    </Box>
  </>
);

Form1ActionsPanel.propTypes = {
  disabled: PropTypes.bool,
  sectionTitleSx: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  sectionSpacingSx: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

Form1ActionsPanel.defaultProps = {
  disabled: true,
};

export default Form1ActionsPanel;
