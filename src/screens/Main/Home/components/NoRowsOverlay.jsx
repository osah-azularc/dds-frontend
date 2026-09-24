import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const NoRowsOverlay = ({ isInitialLoad }) =>
  isInitialLoad ? null : (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 700, textAlign: 'center' }}>
        No Results Found
      </Typography>
    </Box>
  );

NoRowsOverlay.propTypes = {
  isInitialLoad: PropTypes.bool.isRequired,
};

export default NoRowsOverlay;
