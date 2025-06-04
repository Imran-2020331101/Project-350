import React from 'react';
import { Outlet } from 'react-router-dom';
import Profile from '../components/Dashboard/Profile';

const UsersDashboard = () => {
  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row">
      <Profile />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default UsersDashboard;
