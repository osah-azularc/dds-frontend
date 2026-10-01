import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { isDocketDetailRoute } from '../utilities/docketDetailRoutes';

/**
 * Whether the site-wide DocketSearch bar (Docket Number box + Additional Search Options)
 * renders on the current route. Shared by Header.jsx (which renders it) and AppLayout.jsx
 * (which skips its own top padding when it's present -- MUI's AppBar defaults to
 * `position="fixed"`, so something has to occupy normal flow to push page content below it
 * otherwise; DocketSearch's own hero-banner height is that something on these routes, see
 * AppLayout.jsx's headerHeight comment). Previously each file recomputed this
 * independently -- when dds_superuser's docket-detail view (/docket/reqdt/:caseId) was
 * made to skip DocketSearch in Header.jsx only, AppLayout.jsx's own stale copy still
 * assumed it was there and withheld the compensating padding, leaving page content
 * rendered underneath the fixed header. One shared hook instead of two copies.
 */
export function useShowDocketSearch() {
  const location = useLocation();
  const userType = useSelector((state) => state.user.user_type);
  const isSuperuser = userType === 'dds_superuser';

  const isHome = location.pathname === '/home';
  const isSearchResults = location.pathname.startsWith('/search-results');
  const isFormDetail = isDocketDetailRoute(location.pathname);

  return {
    isHome,
    isSearchResults,
    isFormDetail,
    isSuperuser,
    showDocketSearch: isHome || isSearchResults || (isFormDetail && !isSuperuser),
  };
}
