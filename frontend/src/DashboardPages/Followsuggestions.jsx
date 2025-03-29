import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../config';

const Followsuggestions = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate()

    const [showbutton, setShowbutton] = useState(false)

    const suggestHandle = async () => {
        try {
            const response = await fetch(`${api}/api/user/suggested`, {
                method: "GET",
                credentials: "include"
            });
            const result = await response.json();
            if (response.ok) {
                setUsers(result);
                setShowbutton(true)
            } else {
                console.log("Error:", result.error);
            }
        } catch (error) {
            console.log("Error", error);
        }
    };

    const followHandle = async (userid) => {
        try {
            const response = await fetch(`${api}/api/user/follow/${userid}`, {
                method: "POST",
                credentials: "include"
            })
            const result = await response.json()
            if (response.ok) {
                alert("followed successfully")
                suggestHandle()
                console.log("Followed/unfollowed Successfully")
            }
            else {
                console.log(result.error)
            }

        } catch (error) {
            console.log("Error", error)
        }
    }

    return (
        <div className="w-full max-w-sm bg-white shadow-lg rounded-xl p-4">
            <div className='flex flex-row justify-between items-center m-2 p-2 '>
                <h2 className="text-lg font-bold text-gray-900 mb-3">Who to Follow</h2>
                {
                    showbutton && <div className='bg-red-400 text-white p-2 border rounded-sm hover:rounded-lg cursor-pointer' onClick={() => { setUsers([]); setShowbutton(false) }}>Cancel</div>
                }
            </div>
            <div className="space-y-3">
                {users.length > 0 && users.map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-300 ">
                        <div className="flex items-center w-15 h-10 justify-between px-2 cursor-pointer" onClick={() => navigate(`/userprofile/${user.username}/Follow`)}>
                            <img
                                className="w-10 h-10 rounded-full object-cover border border-gray-300"
                                src={user.profileImg || "https://s3.amazonaws.com/37assets/svn/765-default-avatar.png"}
                                alt="Profile"
                            />
                            <h2 className="text-md font-semibold text-gray-900 mx-2">{user.username}</h2>
                        </div>
                        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-300" onClick={() => followHandle(user._id)}>
                            Follow
                        </button>
                    </div>
                ))}
            </div>

            <button
                onClick={suggestHandle}
                className="mt-4 w-full py-2 text-blue-500 font-semibold border border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition duration-300"
            >
                Show More
            </button>
        </div>
    );
};

export default Followsuggestions;
