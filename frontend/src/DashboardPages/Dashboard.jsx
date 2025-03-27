import React, { useState } from 'react';
import Following from '../Postpages/Following';
import Foryou from '../Postpages/Foryou';
import Sidebar from './Sidebar';

const Dashboard = () => {
    const [content, setContent] = useState("foryou");

    return (
        <div className="flex h-screen w-full">
            {/* Sidebar (Left) */}
            <Sidebar />

            {/* Main Content (Center Feed) */}
            <div className="flex-1 max-w-2xl mx-auto border-x border-gray-300 bg-white">
                {/* Top Navigation Bar for Switching */}
                <div className="sticky top-0 bg-white border-b border-gray-300 p-4 flex justify-around">
                    <button
                        onClick={() => setContent("foryou")}
                        className={`flex-1 text-lg font-semibold py-2 transition duration-300 ${content === "foryou" ? "border-b-4 border-blue-500 text-black" : "text-gray-500"
                            }`}
                    >
                        For You
                    </button>
                    <button
                        onClick={() => setContent("following")}
                        className={`flex-1 text-lg font-semibold py-2 transition duration-300 ${content === "following" ? "border-b-4 border-blue-500 text-black" : "text-gray-500"
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
        </div>
    );
};

export default Dashboard;
