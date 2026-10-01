import { Box, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FORM1_CAPABILITIES, hasForm1Capability } from '../../../utilities/form1Capabilities';
import styles from './HomeStyles';

// Keeps <Link>-rendered buttons (real <a> tags -- right-click/open-in-new-tab, keyboard nav)
// rather than the UI design team's onClick-navigate() version of this page
// (dds-frontend-feature-ui-design); only the hero background/button sizing is adopted from it.
const Home = () => {
  const theme = useTheme();
  const classes = styles(theme);
  const userType = useSelector((state) => state.user.user_type);

  const canViewForm1Entry = hasForm1Capability(userType, FORM1_CAPABILITIES.HOME_FORM1_ENTRY_VIEW);
  const canCreateForm1 = hasForm1Capability(userType, FORM1_CAPABILITIES.HOME_FORM1_CREATE);
  const canViewTempPermits = hasForm1Capability(
    userType,
    FORM1_CAPABILITIES.HOME_TEMP_PERMITS_VIEW,
  );

  return (
    <Box sx={classes.HeroActionsSection}>
      {canViewForm1Entry && (
        <Button
          component={canCreateForm1 ? Link : 'button'}
          to={canCreateForm1 ? '/form1' : undefined}
          variant="contained"
          color="primary"
          size="large"
          disabled={!canCreateForm1}
          sx={classes.HeroActionButton}
        >
          Enter New Form 1
        </Button>
      )}
      {canViewTempPermits && (
        <Button
          component={Link}
          to="/temporary-permits"
          variant="contained"
          color="primary"
          size="large"
          sx={classes.HeroActionButton}
        >
          Temporary Permits
        </Button>
      )}
    </Box>
  );
};

export default Home;
