import React from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

/**
 * Right column of the "Enter New Form 1" screen — Document & File
 * Management, Disposition, and Party Information. All actions stay
 * disabled until the docket exists (matches legacy's form1-new.phtml,
 * where these are plain `class="disable"` links with no click handler
 * until the Form 1 has been saved).
 *
 * Section header/button styling mirrors ecourt-frontend's own docket detail
 * page (DocumentFileManagement.jsx / Disposition.jsx / PartyInformation.jsx):
 * `Typography variant="h2" color="secondary"` headers, and
 * `Button color="primary" startIcon={<AddIcon />} fullWidth` action buttons
 * in a `Grid item xs={12} sm={6} md={3}` — disabled here, which the theme's
 * MuiButton override already renders as the grayed-out state.
 */
const DocumentPartyPanel = () => (
  <Box sx={{ backgroundColor: '#fff', p: 3 }}>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h2" color="secondary">
          Document &amp; File Management
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Button color="primary" startIcon={<AddIcon />} fullWidth disabled>
          Document Templates
        </Button>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Button color="primary" startIcon={<AddIcon />} fullWidth disabled>
          Files
        </Button>
      </Grid>

      <Grid item xs={12} sx={{ mt: 2 }}>
        <Typography variant="h2" color="secondary">
          Disposition
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Button color="primary" startIcon={<AddIcon />} fullWidth disabled>
          Add Decision
        </Button>
      </Grid>

      <Grid item xs={12} sx={{ mt: 2 }}>
        <Typography variant="h2" color="secondary">
          Party Information
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Button color="primary" startIcon={<AddIcon />} fullWidth disabled>
          Add Party
        </Button>
      </Grid>
    </Grid>
  </Box>
);

export default React.memo(DocumentPartyPanel);
