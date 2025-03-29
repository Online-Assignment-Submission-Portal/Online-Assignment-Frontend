import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import useStore from "../lib/useStore";
import { FiMenu, FiX } from "react-icons/fi";

const Header = () => {
    const [user, setUser] = useState(null);
    const apiUrl = window.location.hostname === 'localhost'
        ? "http://localhost:8000" : import.meta.env.VITE_APP_BASE_URL;
    const navigate = useNavigate();
    const { disconnectSocket, setUserId, resetStore } = useStore();
    const userId = useStore((state) => state.userId);
    const [isOpen, setIsOpen] = useState(false);

    const handleDashboard = async () => {
        try {
            const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("token="))
                ?.split("=")[1];

            if (!token) {
                toast.error('Please sign in.');
                return navigate('/signin');
            }

            const response = await axios.get(
                `${apiUrl}/user/dashboard/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.data.success) {
                setUser(response.data.user);
                navigate(`/dashboard/${userId}`)
            } else {
                toast.error("Failed to fetch user data.");
            }
        } catch (err) {
            if (err.response && err.response.status === 500) {
                toast.error(err.response?.data?.message || "An error occurred.");
                navigate("/signin");
            } else {
                toast.error(err.response?.data?.message || "An error occurred.");
            }
        }
    };
    const handleProfile = async () => {
        try {
            const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("token="))
                ?.split("=")[1];

            if (!token) {
                toast.error('Please sign in.');
                return navigate('/signin');
            }
            const response = await axios.get(
                `${apiUrl}/user/profile/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            // console.log(response);
            if (response.data.success) {
                navigate(`/profile/${userId}`, { state: { profile: response.data, userID: userId, userRole: response.data.role } });
            } else {
                toast.error("Failed to fetch profile data.");
            }
        } catch (err) {
            // console.log(err);
            toast.error(err.response?.data?.message || "An error occurred during Profile view.");
        }
    };
    const handleLogout = async () => {
        try {
            const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("token="))
                ?.split("=")[1];

            if (!token) {
                toast.error('Please sign in.');
                return navigate('/signin');
            }

            const response = await axios.post(
                `${apiUrl}/user/logout`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
                localStorage.clear();
                resetStore(); // Reset entire Zustand store state (userId, socket, etc.)
                toast.success("Logout Successful");
                disconnectSocket();
                setTimeout(() => navigate(`/signin`), 1500);
            } else {
                toast.error(response.data.message || "Logout failed.");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "An error occurred during logout.");
        }
    };

    return (
        <header className="bg-gray-800 text-gray-200 py-4 shadow-lg relative z-50">
            <div className="container mx-auto flex justify-between items-center px-6">
                <h1 className="text-2xl font-bold">CollegeHub</h1>
                <nav className="hidden md:flex gap-6">
                    <span
                        onClick={handleDashboard}
                        className="cursor-pointer text-white font-semibold hover:text-blue-400 transition-all"
                    >
                        Dashboard
                    </span>
                    <span
                        onClick={handleProfile}
                        className="cursor-pointer text-white font-semibold hover:text-green-400 transition-all"
                    >
                        Profile
                    </span>
                    <span
                        onClick={handleLogout}
                        className="cursor-pointer text-white font-semibold hover:text-red-400 transition-all"
                    >
                        Logout
                    </span>
                </nav>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden text-white text-2xl focus:outline-none transition ease-in duration-200"
                >
                    {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
                </button>
            </div>
            {isOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-gray-800 shadow-lg text-center z-50">
                    <nav className="flex flex-col gap-4 p-4">
                        <span
                            onClick={handleDashboard}
                            className="cursor-pointer text-white font-semibold hover:text-blue-400 transition-all"
                        >
                            Dashboard
                        </span>
                        <span
                            onClick={handleProfile}
                            className="cursor-pointer text-white font-semibold hover:text-green-400 transition-all"
                        >
                            Profile
                        </span>
                        <span
                            onClick={handleLogout}
                            className="cursor-pointer text-white font-semibold hover:text-red-400 transition-all"
                        >
                            Logout
                        </span>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
