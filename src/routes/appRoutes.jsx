import Cookies from 'js-cookie';
import { lazy } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const Main = lazy(() => import('../screens/Main/Main'));
const Home = lazy(() => import('../screens/Main/Home/Home'));

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
];

const appRoutes = [
  {
    path: '/',
    element: <PrivateRoutes as={Main} />,
    children: appNav,
  },
];

export default appRoutes;
