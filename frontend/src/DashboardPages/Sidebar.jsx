import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../config';

const Sidebar = () => { 
    const navigate = useNavigate();

    const logout = async () => {
        try {
            const response = await fetch(`${api}/api/auth/logout`, {
                method: "POST",
                credentials: "include"
            });
            if (response.ok) {
                console.log("Logged out successfully");
                navigate("/signin");
            }
        } catch (error) {
            console.log("Error", error);
        }
    };

    return (
        <div className="h-screen w-64 bg-gray-900 text-white p-5 flex flex-col justify-between">
            {/* Navigation Links */}
            <div className="flex flex-col space-y-4">
                <Link to="/dashboard" className="sidebar-link">Posts</Link>
                <Link to="/notification" className="sidebar-link">Notifications</Link>
                <Link to="/profile" className="sidebar-link">Profile</Link>
            </div>

            {/* Logout Button */}
            <button 
                onClick={logout} 
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition duration-300"
            >
                Logout
            </button>
        </div>
    );
};

export default Sidebar;
