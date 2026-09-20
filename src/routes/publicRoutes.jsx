/* eslint-disable */
import { lazy } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const Auth = lazy(() => import('../screens/Auth/Auth'));
const Login = lazy(() => import('../screens/Auth/Login'));
const UnauthorizedAccess = lazy(() => import('../screens/UnauthorizedAccess'));

const PublicRoute = ({ as: Component, ...props }) => {
  const location = useLocation();
  const user = useSelector((state) => state.user);
  const isAuthenticated = Boolean(user?.isAuthenticated);

  // /unauthorized-access must stay reachable for an authenticated user redirected here by a
  // permission guard (e.g. RequirePermission) — otherwise this same check bounces them straight
  // to /home before they ever see the message, defeating the guard that sent them here.
  const isExempt =
    location.pathname.startsWith('/account-setup') || location.pathname === '/unauthorized-access';

  if (isAuthenticated && !isExempt) {
    return <Navigate to="/home" replace />;
  }

  return <Component {...props} />;
};
PublicRoute.propTypes = {
  as: PropTypes.elementType.isRequired,
  // Include other props here if needed
};
const authNav = [
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/unauthorized-access',
    element: <UnauthorizedAccess />,
  },
];

const publicRoutes = [
  {
    path: '/',
    element: <PublicRoute as={Auth} />,
    children: authNav,
  },
];

export default publicRoutes;
