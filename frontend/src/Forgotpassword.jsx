import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from './config';

const Forgotpassword = () => {
    const navigate = useNavigate()
    const [data, setData] = useState({
        email: "", newPassword: "", againnewPassword: ""
    });
    const [message, setMessage] = useState(""); // To display success or error messages

    const changeHandle = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };
    const { email, newPassword, againnewPassword } = data;
    const submitHandle = async (e) => {
        e.preventDefault(); // Prevents page reload
        setMessage(""); // Clear previous messages
        if (newPassword !== againnewPassword) {
            setMessage("❌ Passwords do not match!");
            return;
        }
        try {
            const response = await fetch(`${api}/api/auth/forgotpassword`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, newPassword })
            });

            const result = await response.json();

            if (response.ok) {
                setMessage("✅ Password changed successfully!");
                setData({ email: "", newPassword: "", againnewPassword: "" }); // Clear input fields
                navigate('/signin');
            } else {
                setMessage("❌ Error: " + (result.error || "Failed to change password."));
            }
        } catch (error) {
            setMessage("❌ Network error, please try again.");
            console.error("Error in forgotpassword controller: ", error.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <form onSubmit={submitHandle} className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Forgot Password</h2>

                <label className="font-semibold text-gray-700">Email:</label>
                <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={data.email}
                    onChange={changeHandle}
                    className="p-2 w-full border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <label className="font-semibold text-gray-700">New Password:</label>
                <input
                    type="password"
                    name="newPassword"
                    placeholder="Enter new password"
                    value={data.newPassword}
                    onChange={changeHandle}
                    className="p-2 w-full border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <label className="font-semibold text-gray-700">Again Enter New Password:</label>
                <input
                    type="password"
                    name="againnewPassword"
                    placeholder="Enter again new password"
                    value={data.againnewPassword}
                    onChange={changeHandle}
                    className="p-2 w-full border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <input
                    type="submit"
                    value="Change Password"
                    className="w-full p-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700"
                />

                {message && <p className="text-center mt-4 text-lg font-semibold">{message}</p>}
            </form>
        </div>
    );
};

export default Forgotpassword;
