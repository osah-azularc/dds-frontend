import { Box, Button, Stack } from '@mui/material';
import { Link } from 'react-router-dom';

const ctaButtonSx = {
  width: 320,
  py: 1.75,
};

const Home = () => {
  return (
    <Box sx={{ py: 6, textAlign: 'center' }}>
      <Stack spacing={3} alignItems="center">
        <Button component={Link} to="/form1" variant="contained" color="primary" sx={ctaButtonSx}>
          Enter New Form 1
        </Button>
        <Button
          component={Link}
          to="/temporary-permits"
          variant="contained"
          color="primary"
          sx={ctaButtonSx}
        >
          Temporary Permits
        </Button>
      </Stack>
    </Box>
  );
};

export default Home;
