import React from 'react';
import Sidebar from '../DashboardPages/Sidebar';

const Notification = () => {
  return (
    <div className="flex flex-row h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-5 bg-gray-100">
        <h1 className="text-2xl font-semibold">Notifications</h1>
      </div>
    </div>
  );
};

export default Notification;
