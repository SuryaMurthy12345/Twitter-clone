import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signin = () => {
    const [data, setData] = useState({
        username: "",
        password: "",
    });
    const navigate = useNavigate();
    const [message, setMessage] = useState(""); // State for messages

    const changeHandle = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const submitHandle = async (e) => {
        e.preventDefault(); // Prevent page reload

        try {
            const response = await fetch("http://localhost:8000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // Required for cookies
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (response.ok) {
                setMessage("User Signed successfully.");
                setTimeout(() => navigate('/dashboard'), 2000)
            } else {
                setMessage(result.error || "Signin failed. Try again.");
            }

        } catch (err) {
            console.error("Signin Error:", err);
            setMessage("Something went wrong. Please try again.");
        }
    };

    return (
        <div>
            <h1 className="text-center m-4 text-xl font-bold">Sign In Page</h1>
            <form onSubmit={submitHandle} className="flex flex-col justify-center items-center p-4 m-4 h-screen">
                {["username", "password"].map((field, index) => (
                    <div key={index} className="flex flex-row gap-10 m-4 font-bold text-gray-700 items-center">
                        <label className="capitalize">{field}:</label>
                        <input
                            type={field === "password" ? "password" : "text"}
                            name={field}
                            placeholder={`Enter ${field}`}
                            value={data[field]}
                            onChange={changeHandle}
                            className="hover:p-2 p-1 hover:border-b-2 border-gray-400 focus:outline-none"
                        />
                    </div>
                ))}

                <input
                    type="submit"
                    value="Sign In"
                    className="border border-blue-500 text-center hover:bg-black hover:text-white p-2 m-2 w-80 transition-all duration-200"
                />

                {message && <div className="text-red-500 mt-2">{message}</div>}

                <div>
                    Dont have an account? &nbsp;
                    <a href="/signup" className="text-blue-500 hover:underline">
                        Sign up
                    </a>
                </div>
            </form>
        </div>
    );
};

export default Signin;
