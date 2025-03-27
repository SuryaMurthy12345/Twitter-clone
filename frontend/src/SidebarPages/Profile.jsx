import React from 'react';
import Sidebar from '../DashboardPages/Sidebar';

const Profile = () => {
  return (
    <div className="flex flex-row h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-5 bg-gray-100">
        <h1 className="text-2xl font-semibold">Profile</h1>
      </div>
    </div>
  );
};

export default Profile;
