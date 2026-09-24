import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, IconButton, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import React, { lazy, useCallback, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import MainLogo from '../MainLogo/MainLogo';
import styles from './HeaderStyle';
import DocketSearch from '../../screens/Main/Home/DocketSearch';

const AccountPopover = lazy(() => import('../common/account-popover'));

const NAV_LINKS = [
  { label: 'HOME', path: '/home' },
  { label: 'FORM1', path: '/form1' },
  { label: 'TEMPORARY PERMITS', path: '/temporary-permits' },
  { label: "REJECTED FORM 1'S", path: '/rejected-form1s' },
];

const Header = () => {
  const theme = useTheme();
  const classes = styles(theme);
  const isDesktop = useMediaQuery('(min-width:1321px)');
  const location = useLocation();

  const isHome = location.pathname === '/home';

  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const handleNavLinkClick = useCallback(() => {
    if (!isDesktop) {
      setMenuOpen(false);
    }
  }, [isDesktop]);

  const isNavLinkActive = useCallback(
    (path) => location.pathname === path || location.pathname.startsWith(`${path}/`),
    [location.pathname],
  );

  const renderNavLinks = useCallback(
    () => (
      <Stack direction="row" sx={classes.HeaderLinks} component="nav" aria-label="Main navigation">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.label}
            to={link.path}
            className={isNavLinkActive(link.path) ? 'active-nav' : ''}
            onClick={handleNavLinkClick}
          >
            <Typography variant="body1">{link.label}</Typography>
            <Box className="nav-indicator" />
          </Link>
        ))}
      </Stack>
    ),
    [classes, isNavLinkActive, handleNavLinkClick],
  );

  React.useEffect(() => {
    if (isDesktop) {
      setMenuOpen(false);
    }
  }, [isDesktop]);

  return (
    <Box sx={classes.HeaderOuter} component="header">
      <AppBar sx={classes.HeaderPanel}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          width={1}
          height={1}
          sx={{
            '@media (max-width: 1319px)': {
              paddingTop: '8px',
              paddingBottom: '8px',
            },
          }}
        >
          <Box display="flex" alignItems="center" minWidth={0} flex="1 1 auto">
            {!isDesktop && (
              <IconButton
                onClick={handleMenuToggle}
                sx={{ color: theme.palette.text.primary, flexShrink: 0 }}
                aria-label="Toggle menu"
              >
                <MenuIcon />
              </IconButton>
            )}
            <Box flexShrink={0}>
              <MainLogo />
            </Box>
            {isDesktop && renderNavLinks()}
          </Box>

          <Box display="flex" alignItems="center" flexShrink={0}>
            <React.Suspense fallback={null}>
              <AccountPopover />
            </React.Suspense>
          </Box>
        </Box>

        {!isDesktop && menuOpen && renderNavLinks()}
      </AppBar>

      {isHome && <DocketSearch />}
    </Box>
  );
};

export default React.memo(Header);
