import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../DashboardPages/Sidebar';
import { api } from '../config';

const Notification = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  const getNotifications = async () => {
    try {
      const response = await fetch(`${api}/api/notification`, {
        method: 'GET',
        credentials: "include"
      });
      const result = await response.json();
      if (response.ok) {
        setNotifications(result);
        console.log(result);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getNotifications();
  }, []);

  const navigateHandle = async (username, id) => {
    try {
      const response = await fetch(`${api}/api/user/check/${id}`, {
        method: "GET",
        credentials: "include"
      });
      const result = await response.json();
      if (response.ok) {
        navigate(`/userprofile/${username}/${result.text}`);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const deleteHandle = async () => {
    try {
      const response = await fetch(`${api}/api/notification`, {
        method: 'DELETE',
        credentials: "include"
      });
      const result = await response.json();
      if (response.ok) {
        getNotifications();
        alert(result.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex flex-row h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-semibold text-gray-800">Notifications</h1>
          <button
            onClick={deleteHandle}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow transition-all duration-300"
          >
            Clear All
          </button>
        </div>

        {/* Notifications List */}
        <div className="bg-white p-4 rounded-lg shadow-md max-h-[70vh] overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notify, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b py-3 last:border-none hover:bg-gray-100 p-2 rounded-lg transition-all cursor-pointer"
                onClick={() =>
                  notify.type === "follow"
                    ? navigateHandle(notify.from.username, notify.from._id)
                    : navigate(`/post/${notify.toModel}`)
                }
              >
                <div className="flex items-center gap-4">
                  {/* Profile Picture */}
                  <img
                    src={notify.from.profileImg || "https://s3.amazonaws.com/37assets/svn/765-default-avatar.png"}
                    alt="Profile"
                    className="w-10 h-10 rounded-full border border-gray-300"
                  />
                  {/* Notification Text */}
                  <p className="text-gray-700 text-sm">
                    {notify.type === "follow" && (
                      <span>
                        <strong className="text-blue-600">{notify.from.username}</strong> followed you. Click to visit their profile.
                      </span>
                    )}
                    {notify.type === "like" && (
                      <span>
                        <strong className="text-blue-600">{notify.from.username}</strong> liked your post. Click to view it.
                      </span>
                    )}
                    {notify.type === "comment" && (
                      <span>
                        <strong className="text-blue-600">{notify.from.username}</strong> commented on your post. Click to see it.
                      </span>
                    )}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No notifications available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;
