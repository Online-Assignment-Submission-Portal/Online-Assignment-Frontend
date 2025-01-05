import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';

const UpdateProfile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const profile = location.state?.profile;
    const userId = location.state?.userId;
    const [error, setError] = useState("");
    const [profileInput, setProfileInput] = useState({...profile});
    // console.log(profile);
    // console.log(userId);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];
        console.log('hello', profileInput);
        try{
        const response = await axios.put(`http://localhost:8000/user/updateprofile/${userId}`, 
         {profileInput},
         {
            headers: {
              Authorization: `Bearer ${token}`,
            },
         });
         
         if(response.data.success) {
            console.log(response.data);
            console.log("Profile updated successfully");
            navigate(`/profile/${userId}`, { state: {profile: response.data, userID: userId } });
         }
        } catch(err) {
            setError(err.response?.data?.message || "An error occurred during updating profile.");
        }

    }

    return (
   <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
    <div className="bg-gray-800 mt-3 mb-3 p-6 rounded-lg shadow-lg w-full max-w-md">
            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="Name" className="block text-sm font-medium mb-1">
                Name:
                </label>
                <input
                    type="text"
                    name="Name"
                    value={profile.firstName + " " + profile.lastName  || ''}
                    disabled
                    className="w-full p-2 bg-gray-700 rounded-md text-white outline-none focus:ring-2 
                    focus:ring-green-500"
                />
            </div>
            <div>
                <label htmlFor="Email" className="block text-sm font-medium mb-1">
                Email:
                </label>
                <input
                    type="email"
                    name="Email"
                    value={profile.email || ''}
                    disabled
                    className="w-full p-2 bg-gray-700 rounded-md text-white outline-none focus:ring-2 
                    focus:ring-green-500" 
                />
            </div>
            {profile.role === 'student' ? (
                <>
                <div>
                <label htmlFor="Roll No" className="block text-sm font-medium mb-1">Roll No:</label>
                <input
                    type="text"
                    name="Roll No"
                    value={profileInput.rollNo || ''}
                    onChange={(e) => setProfileInput({ ...profileInput, rollNo: e.target.value })}
                    className="w-full p-2 bg-gray-700 rounded-md text-white outline-none focus:ring-2 
                    focus:ring-green-500"
                />
            </div>
            <div>
                <label htmlFor="Branch" className="block text-sm font-medium mb-1">
                Branch:
                </label>
                <input
                    type="text"
                    name="Branch"
                    value={profileInput.branch || ''}
                    onChange={(e) => setProfileInput({ ...profileInput, branch: e.target.value })}
                    className="w-full p-2 bg-gray-700 rounded-md text-white outline-none focus:ring-2 \
                    focus:ring-green-500"
                />
            </div>
            <div>
                <label htmlFor="Semester" className="block text-sm font-medium mb-1">
                Semester:
                </label>
                <input
                    type="text"
                    name="Semester"
                    value={profileInput.semester || ''}
                    onChange={(e) => setProfileInput({ ...profileInput, semester: e.target.value })}
                    className="w-full p-2 bg-gray-700 rounded-md text-white outline-none focus:ring-2 \
                    focus:ring-green-500"
                />
            </div>
            <div>
                <label htmlFor="Section" className="block text-sm font-medium mb-1">
                Section:
                </label>
                <input
                    type="text"
                    name="Section"
                    value={profileInput.section || ''}
                    onChange={(e) => setProfileInput({ ...profileInput, section: e.target.value })}
                    className="w-full p-2 bg-gray-700 rounded-md text-white outline-none focus:ring-2 \
                    focus:ring-green-500"
                />
            </div>
                </>
            ):(
                <>
                  <div>
                <label htmlFor="exprerience" className="block text-sm font-medium mb-1">
                Experience:
                </label>
                <input
                    type="number"
                    name="exprerience"
                    value={profileInput.exprerience || 0.5}
                    onChange={(e) => setProfileInput({ ...profileInput, exprerience: e.target.value })}
                    className="w-full p-2 bg-gray-700 rounded-md text-white outline-none focus:ring-2 \
                    focus:ring-green-500"
                />
            </div>
            <div>
                <label htmlFor="employeeId" className="block text-sm font-medium mb-1">
                Employee Id:
                </label>
                <input
                    type="text"
                    name="employeeId"
                    value={profileInput.employeeId || ''}
                    onChange={(e) => setProfileInput({ ...profileInput, employeeId: e.target.value })}
                    className="w-full p-2 bg-gray-700 rounded-md text-white outline-none focus:ring-2 \
                    focus:ring-green-500"
                />
            </div>
                </>
            )}
            <div>
                <label htmlFor="Contact" className="block text-sm font-medium mb-1">
                Contact:
                </label>
                <input
                    type="text"
                    name="Contact"
                    value={profileInput.contact || ''}
                    onChange={(e) => setProfileInput({ ...profileInput, contact: e.target.value })}
                    className="w-full p-2 bg-gray-700 rounded-md text-white outline-none focus:ring-2 \
                    focus:ring-green-500"
                />
            </div>
            <div>
            <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded-md 
            font-bold transition"
          >
            Update Profile
          </button>
            </div>
            </form>
        </div>
    </div>
    );
}

export default UpdateProfile;