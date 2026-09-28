/**
 * The four docket-detail tab routes (General Information/Form 1205/History/Notes -- see
 * DocketTabBar.jsx's own TAB_ROUTES) all share the shell that shows the site-wide
 * DocketSearch header (Docket Number box + Additional Search Options). Kept as one shared
 * list, used by both Header.jsx (whether to render DocketSearch) and AppLayout.jsx (whether
 * to skip the header's own top padding) -- previously each file re-derived this with its own
 * `isFormDetail = pathname.startsWith('/form1/reqdt')` check, which only ever matched the
 * General Information route (the other three insert a segment between `/form1/` and
 * `reqdt/`), silently hiding the header on Form 1205/History/Notes.
 */
const DOCKET_DETAIL_PATH_PREFIXES = [
  '/form1/reqdt/',
  '/form1/1205form/reqdt/',
  '/form1/history/reqdt/',
  '/form1/notes/reqdt/',
];

export const isDocketDetailRoute = (pathname) =>
  DOCKET_DETAIL_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
