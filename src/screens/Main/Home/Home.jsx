import { Box, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import styles from './HomeStyles';

const Home = () => {
  const theme = useTheme();
  const classes = styles(theme);
  const navigate = useNavigate();

  return (
    <Box sx={classes.HeroActionsSection}>
      <Button
        variant="contained"
        color="primary"
        size="large"
        sx={classes.HeroActionButton}
        onClick={() => navigate('/form1')}
      >
        Enter New Form 1
      </Button>
      <Button
        variant="contained"
        color="primary"
        size="large"
        sx={classes.HeroActionButton}
        onClick={() => navigate('/temporary-permits')}
      >
        Temporary Permits
      </Button>
    </Box>
  );
};

export default Home;
