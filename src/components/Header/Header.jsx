import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, Collapse, IconButton, Stack, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import React, { lazy, useCallback, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AdditionalSearchOptions from '../../screens/Main/Home/AdditionalSearchOptions';
import DocketSearch from '../../screens/Main/Home/DocketSearch';
import MainLogo from '../MainLogo/MainLogo';
import styles from './HeaderStyle';

const AccountPopover = lazy(() => import('../common/account-popover'));

// The app's fixed-height ".FullHeight" flex column (App.css) makes plain
// MUI Collapse's default overflow:hidden let flexbox treat this panel as
// shrinkable to 0 (automatic minimum size = 0 for non-visible overflow),
// so it gets squeezed out instead of growing the page. minHeight:auto
// forces flexbox back to its content-based minimum, but only works paired
// with the FULL overflow:visible shorthand on the root — splitting IT into
// overflowX/overflowY makes the browser silently coerce the visible axis
// back to 'auto' (per spec, when one axis isn't visible) which defeats
// minHeight:auto again. PanelOuter's own overflow:hidden only clips the
// Grid's negative-margin overflow within itself; it can't stop
// .MuiCollapse-wrapper (an ancestor, needed as overflow:visible for the
// root's height fix) from growing wider than the page if the Grid resists
// shrinking, so the horizontal clip has to happen on wrapper itself instead
// — that's a different element from the root, so it doesn't touch the
// minHeight/overflow pairing the toggle depends on.
const SmoothCollapse = styled(Collapse)(({ theme }) => ({
  transition: theme.transitions.create(['height', 'opacity'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.standard,
  }),
  '&.MuiCollapse-entered': {
    minHeight: 'auto !important',
    overflow: 'visible',
  },
  '&.MuiCollapse-hidden': {
    visibility: 'hidden',
  },
  '&.MuiCollapse-wrapper': {
    display: 'flex !important',
    overflowX: 'hidden',
  },
  '&.MuiCollapse-wrapperInner': {
    width: '100%',
  },
}));

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
  const isSearchResults = location.pathname.startsWith('/search-results');
  // /form1/:docketId (the detail view) - but not /form1 itself (the "new" form).
  const isFormDetail = /^\/form1\/.+/.test(location.pathname);
  const showDocketSearch = isHome || isSearchResults || isFormDetail;
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearchOptions, setShowSearchOptions] = useState(false);

  // Close search options by default on arrival at the results/detail page
  // instead of leaving whatever state it was left in on the Home page.
  React.useLayoutEffect(() => {
    if (isSearchResults || isFormDetail) {
      setShowSearchOptions(false);
    }
  }, [isSearchResults, isFormDetail]);

  const handleMenuToggle = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const isNavLinkActive = useCallback(
    (path) => {
      if (path === '/home') {
        return location.pathname === path;
      }
      return location.pathname === path || location.pathname.startsWith(`${path}/`);
    },
    [location.pathname],
  );

  const handleNavLinkClick = useCallback(() => {
    if (!isDesktop) {
      setMenuOpen(false);
    }
  }, [isDesktop]);

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

  const navLinksMemo = useMemo(() => renderNavLinks(), [renderNavLinks]);

  return (
    <>
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
              {isDesktop && navLinksMemo}
            </Box>

            <Box display="flex" alignItems="center" flexShrink={0}>
              <React.Suspense fallback={null}>
                <AccountPopover />
              </React.Suspense>
            </Box>
          </Box>

          {!isDesktop && menuOpen && navLinksMemo}
        </AppBar>

        {showDocketSearch && (
          <DocketSearch
            showSearchOptions={showSearchOptions}
            setShowSearchOptions={setShowSearchOptions}
          />
        )}
      </Box>

      {showDocketSearch && (
        <SmoothCollapse in={showSearchOptions}>
          <AdditionalSearchOptions />
        </SmoothCollapse>
      )}
    </>
  );
};

export default React.memo(Header);
