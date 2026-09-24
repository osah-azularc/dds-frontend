import Cookies from 'js-cookie';
import { lazy } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const Main = lazy(() => import('../screens/Main/Main'));
const Home = lazy(() => import('../screens/Main/Home/Home'));
const SearchResultsPage = lazy(() => import('../screens/Main/Home/SearchResultsPage'));
const Form1 = lazy(() => import('../screens/Main/Form1/Form1'));
const TemporaryPermits = lazy(() => import('../screens/Main/TemporaryPermits/TemporaryPermits'));
const RejectedForm1s = lazy(() => import('../screens/Main/RejectedForm1s/RejectedForm1s'));

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
    path: '/search-results',
    element: <SearchResultsPage />,
  },
  {
    path: '/form1',
    element: <Form1 />,
  },
  {
    path: '/form1/:docketId',
    element: <Form1 />,
  },
  {
    path: '/temporary-permits',
    element: <TemporaryPermits />,
  },
  {
    path: '/rejected-form1s',
    element: <RejectedForm1s />,
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
