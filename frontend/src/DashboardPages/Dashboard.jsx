import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../config';
import Following from '../Postpages/Following';
import Foryou from '../Postpages/Foryou';
import Followsuggestions from './Followsuggestions';
import Sidebar from './Sidebar';

const Dashboard = () => {
    const [content, setContent] = useState("foryou");
    const navigate = useNavigate()

    const [names, setNames] = useState([])
    const [users, setUsers] = useState([])

    const getUsersHandle = async () => {

        try {
            const response = await fetch(`${api}/api/user/`, {
                method: "GET",
                credentials: "include"
            })
            const result = await response.json()
            if (response.ok) {
                setUsers(result)
            }
        } catch (error) {
            console.log("ERROR:", error)
        }
    }

    const navigateHandle = async (username, id) => {
        try {
            const response = await fetch(`${api}/api/user/check/${id}`, {
                method: "GET",
                credentials: "include"
            })
            const result = await response.json()

            if (response.ok) {

                navigate(`/userprofile/${username}/${result.text}`)
            }
        } catch (error) {
            console.log("Error:", error)
        }

    }

    const searchHandle = (e) => {
        const query = e.target.value.toLowerCase();
        if (query == "") {
            setNames([])
            return
        }
        const result = users.filter((user) => user.username.toLowerCase().includes(query));
        setNames(result)
    }

    useEffect(() => {
        getUsersHandle()
    }, [])


    return (
        <div className="flex h-screen w-full bg-gray-100">
            {/* Sidebar (Left) */}
            <div className="lg:w-1/4 w-0 hidden lg:flex">
                <Sidebar />
            </div>

            {/* Main Content (Center Feed) */}
            <div className="flex-1 lg:w-2/4 w-full mx-auto border border-gray-300 bg-white h-screen overflow-y-auto">
                {/* Navigation for Switching Feeds */}
                <div className="sticky top-0 bg-white border-b border-gray-300 p-4 flex justify-around z-10">
                    <button
                        onClick={() => setContent("foryou")}
                        className={`flex-1 text-lg font-semibold py-2 rounded-md transition duration-300 ${content === "foryou" ? "border-b-4 border-blue-500 text-black" : "text-gray-500 hover:text-black hover:bg-gray-200"
                            }`}
                    >
                        For You
                    </button>
                    <button
                        onClick={() => setContent("following")}
                        className={`flex-1 text-lg font-semibold py-2 rounded-md transition duration-300 ${content === "following" ? "border-b-4 border-blue-500 text-black" : "text-gray-500 hover:text-black hover:bg-gray-200"
                            }`}
                    >
                        Following
                    </button>
                </div>

                {/* Feed Content */}
                <div className="p-5">
                    {content === "foryou" ? <Foryou /> : <Following />}
                </div>
            </div>

            {/* Follow Suggestions (Right Sidebar) */}
            <div className="hidden lg:block w-1/3 p-4 overflow-hidden">
                {/* Search Section */}
                <div className="flex flex-col items-center gap-4">
                    <form className="w-full max-w-sm">
                        <input
                            type="text"
                            onChange={searchHandle}
                            placeholder="Search Users by names🔍..."
                            className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-full outline-none transition duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 shadow-md"
                        />
                    </form>

                    {/* Search Results */}
                    <div className="flex flex-col items-center gap-2 max-h-60 overflow-y-auto w-full">
                        {names.length > 0 ? (
                            names.map((user, index) => (
                                <h3
                                    key={index}
                                    className="px-5 py-2 bg-gray-100 text-gray-800 text-lg rounded-full shadow-sm hover:bg-gray-200 transition duration-200 cursor-pointer"
                                    onClick={() => navigateHandle(user.username, user._id)}
                                >
                                    @{user.username}
                                </h3>
                            ))
                        ) : (
                            <p className="text-gray-500">Not Found..</p>
                        )}
                    </div>
                </div>

                {/* Follow Suggestions Section */}
                <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 mt-4 max-h-72 overflow-y-auto">
                    <Followsuggestions />
                </div>
            </div>




        </div>
    );
};

export default Dashboard;
