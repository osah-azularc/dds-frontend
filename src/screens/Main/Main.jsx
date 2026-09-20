import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AppLayout from '../../components/AppLayout/AppLayout';

const Main = () => {
  const [opacity] = useState(false);
  return (
    <div className={opacity ? 'hide' : 'show'}>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </div>
  );
};

Main.propTypes = {};

export default Main;
