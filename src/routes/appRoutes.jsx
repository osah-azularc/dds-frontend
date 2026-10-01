import Cookies from 'js-cookie';
import { lazy } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const Main = lazy(() => import('../screens/Main/Main'));
const Home = lazy(() => import('../screens/Main/Home/Home'));
const Form1 = lazy(() => import('../screens/Main/Form1/Form1'));
const Form1Notes = lazy(() => import('../screens/Main/Form1/Form1Notes'));
const Form1History = lazy(() => import('../screens/Main/Form1/Form1History'));
const Form1205Form = lazy(() => import('../screens/Main/Form1/Form1205Form'));
const TemporaryPermits = lazy(() => import('../screens/Main/TemporaryPermits/TemporaryPermits'));
const RejectedForm1s = lazy(() => import('../screens/Main/RejectedForm1s/RejectedForm1s'));
const SearchResultsPage = lazy(() => import('../screens/Main/Home/SearchResultsPage'));

const PrivateRoutes = ({ as: Component, ...props }) => {
  const location = useLocation();
  const user = Cookies.get('user');
  const token = Cookies.get('token');
  const isVerified = Cookies.get('verified');

  if (!user && !token && !isVerified) {
    localStorage.setItem('redirectURL', location.pathname);
    return <Navigate to="/" replace />;
  }

  return <Component {...props} />;
};

PrivateRoutes.propTypes = {
  as: PropTypes.elementType.isRequired,
};

const appNav = [
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/form1',
    element: <Form1 />,
  },
  {
    path: '/form1/reqdt/:form1Id',
    element: <Form1 />,
  },
  {
    path: '/form1/notes/reqdt/:form1Id',
    element: <Form1Notes />,
  },
  {
    path: '/form1/history/reqdt/:form1Id',
    element: <Form1History />,
  },
  {
    path: '/form1/1205form/reqdt/:form1Id',
    element: <Form1205Form />,
  },
  {
    path: '/temporary-permits',
    element: <TemporaryPermits />,
  },
  {
    path: '/rejected-form1s',
    element: <RejectedForm1s />,
  },
  {
    path: '/search-results',
    element: <SearchResultsPage />,
  },
  {
    // dds_superuser's docket click (a Docket Search result row with no form1Id -- see
    // useSearchResultsState.js's handleRowClick) -- same Form1 component as
    // /form1/reqdt/:form1Id, which detects the caseId param and loads the raw `docket`
    // row instead (useForm1New.js/useSuperuserDocketData.js).
    path: '/docket/reqdt/:caseId',
    element: <Form1 />,
  },
];

const appRoutes = [
  {
    path: '/',
    element: <PrivateRoutes as={Main} />,
    children: appNav,
  },
];

export default appRoutes;
