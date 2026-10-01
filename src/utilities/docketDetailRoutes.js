/**
 * The four docket-detail tab routes (General Information/Form 1205/History/Notes -- see
 * DocketTabBar.jsx's own TAB_ROUTES) all share the shell that shows the site-wide
 * DocketSearch header (Docket Number box + Additional Search Options). Kept as one shared
 * list, used by both Header.jsx (whether to render DocketSearch) and AppLayout.jsx (whether
 * to skip the header's own top padding) -- previously each file re-derived this with its own
 * `isFormDetail = pathname.startsWith('/form1/reqdt')` check, which only ever matched the
 * General Information route (the other three insert a segment between `/form1/` and
 * `reqdt/`), silently hiding the header on Form 1205/History/Notes.
 *
 * `/docket/reqdt/` is dds_superuser's docket click (same Form1.jsx as the routes above,
 * reached from a Docket Search result row that has no form1Id -- see Form1.jsx/
 * useForm1New.js) -- included here so the same header shell (and Header.jsx's force-open
 * Additional Search Options for that usertype) shows on it too.
 */
const DOCKET_DETAIL_PATH_PREFIXES = [
  '/form1/reqdt/',
  '/form1/1205form/reqdt/',
  '/form1/history/reqdt/',
  '/form1/notes/reqdt/',
  '/docket/reqdt/',
];

export const isDocketDetailRoute = (pathname) =>
  DOCKET_DETAIL_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
