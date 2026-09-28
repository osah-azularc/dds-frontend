import { Box, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import styles from './HomeStyles';

// Keeps <Link>-rendered buttons (real <a> tags -- right-click/open-in-new-tab, keyboard nav)
// rather than the UI design team's onClick-navigate() version of this page
// (dds-frontend-feature-ui-design); only the hero background/button sizing is adopted from it.
const Home = () => {
  const theme = useTheme();
  const classes = styles(theme);

  return (
    <Box sx={classes.HeroActionsSection}>
      <Button
        component={Link}
        to="/form1"
        variant="contained"
        color="primary"
        size="large"
        sx={classes.HeroActionButton}
      >
        Enter New Form 1
      </Button>
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
    </Box>
  );
};

export default Home;
