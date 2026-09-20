import React from 'react';
import { useRoutes } from 'react-router-dom';
import PageNotFound from '../screens/PageNotFound';
import publicRoutes from './publicRoutes';
import appRoutes from './appRoutes';

const Route = () => {
  const routes = useRoutes([
    ...publicRoutes,
    ...appRoutes,
    { path: '*', element: <PageNotFound /> },
  ]);

  return routes;
};

Route.propTypes = {};

export default Route;
