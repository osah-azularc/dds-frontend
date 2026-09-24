'use client';

import { LicenseInfo } from '@mui/x-license';
LicenseInfo.setLicenseKey(import.meta.env.VITE_MUI_PRO);

import { Box, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import React from 'react';
import { useLocation } from 'react-router-dom'; // Use React Router's useLocation instead
import DrawerNav from '../DrawerNav/DrawerNav';
import FooterStrip from '../FooterStrip/FooterStrip';
import style from './AppLayoutStyle';

const AppLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  // Mirrors the Header's own desktop threshold (min-width: 1321px)
  const isDesktop = useMediaQuery('(min-width:1321px)');
  // xs = < 600 px (logo gets extra 10 px top/bottom padding → header ≈ 116 px)
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const [openNav, setOpenNav] = React.useState(!isMobile);
  const location = useLocation(); // Get current location
  const isHome = location.pathname === '/home'; // Check if it's the home page
  const isSearchResults = location.pathname.startsWith('/search-results'); // Check if it's the search results page
  // /form1/:docketId (the detail view) - but not /form1 itself (the "new" form).
  const isFormDetail = /^\/form1\/.+/.test(location.pathname);

  // Pages with DocketSearch component don't need extra padding
  const hasDocketSearch = isHome || isSearchResults || isFormDetail;

  // Exact header heights based on logo (253×80 px) + measured padding:
  //   ≥1321px (desktop)  : nav links row, no outer padding      → ~92 px
  //    600–1320px (tablet): hamburger + logo (no img padding)   → ~96 px
  //   < 600px (mobile)   : hamburger + logo WITH 10px img pad   → ~116 px
  const headerHeight = isDesktop ? '92px' : isXs ? '120px' : '100px';

  return (
    <Box className="FullHeight" sx={style.AppLayoutWrapper}>
      <DrawerNav open={openNav} setOpen={setOpenNav} />
      <Box
        className={openNav ? 'AppLayoutNavOpen' : 'AppLayoutNavClose'}
        component="main"
        sx={{
          ...style.AppLayoutContent,
          ...(!hasDocketSearch && { paddingTop: headerHeight }),
        }}
        aria-label="Content"
      >
        <Box className="ChildrenBox">{children}</Box>
      </Box>
      <FooterStrip />
    </Box>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
