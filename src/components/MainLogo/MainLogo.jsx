import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/osah-logo.png';
import styles from './MainLogoStyle';

const MainLogo = ({ clickable = true }) => {
  const theme = useTheme();
  const classes = styles(theme);
  const navigate = useNavigate();
  const handleClick = clickable ? () => navigate('/home') : undefined;

  return (
    <Box
      display="flex"
      alignItems="center"
      onClick={handleClick}
      sx={{ ...classes.MainLogo, ...(clickable ? {} : { cursor: 'default' }) }}
    >
      <img src={logo} alt="OSAH Logo" />
    </Box>
  );
};

export default React.memo(MainLogo);
