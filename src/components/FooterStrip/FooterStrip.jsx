/* eslint-disable */
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Grid, Typography } from '@mui/material'; // ✅ Added missing imports
import styles from './FooterStripStyle';

const FooterStrip = () => {
  const theme = useTheme();
  const classes = styles(theme);

  return (
    <footer>
      <Box sx={classes.FooterStrip}>
        <Grid container>
          <Grid item xs={12} sm={6}>
            <Box py={1} px={3} textAlign={{ xs: 'center', sm: 'left' }}>
              <Typography variant="caption" color="primary.contrastText">
                OSAH 2026 All Rights Reserved.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box py={1} px={3} textAlign={{ xs: 'center', sm: 'right' }}>
              <Typography variant="caption" color="primary.contrastText">
                Designed and Developed by Azul Arc
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </footer>
  );
};

export default FooterStrip;
