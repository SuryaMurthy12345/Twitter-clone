import React, { useState } from 'react';
import Following from '../Postpages/Following';
import Foryou from '../Postpages/Foryou';
import Followsuggestions from './Followsuggestions';
import Sidebar from './Sidebar';

const Dashboard = () => {
    const [content, setContent] = useState("foryou");

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
            <div className="w-0 lg:w-1/3 hidden lg:flex flex-col p-4 ">
                <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 h-1/2 overflow-y-auto">
                    <Followsuggestions />
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
