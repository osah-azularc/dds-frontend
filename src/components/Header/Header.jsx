import { AppBar, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { lazy, Suspense } from 'react';
import MainLogo from '../MainLogo/MainLogo';
import styles from './HeaderStyle';

const AccountPopover = lazy(() => import('../common/account-popover'));

/**
 * Minimal starting header: logo + account menu (logout).
 * Configure nav links, branding, and layout for DDS here.
 */
const Header = () => {
  const theme = useTheme();
  const classes = styles(theme);

  return (
    <Box sx={classes.HeaderOuter} component="header">
      <AppBar sx={classes.HeaderPanel}>
        <Box display="flex" alignItems="center" justifyContent="space-between" width={1} height={1}>
          <Box display="flex" alignItems="center" minWidth={0} flex="1 1 auto">
            <MainLogo clickable={false} />
          </Box>

          <Box display="flex" alignItems="center" flexShrink={0}>
            <Suspense fallback={null}>
              <AccountPopover />
            </Suspense>
          </Box>
        </Box>
      </AppBar>
    </Box>
  );
};

export default React.memo(Header);
