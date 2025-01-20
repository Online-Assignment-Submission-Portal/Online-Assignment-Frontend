import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './Footer';

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const profileData = location.state?.profile;
  const userId = location.state?.userID;
  const userRole = location.state?.userRole;
  const [data, setData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // console.log(data);

  useEffect(() => {
    setData({ ...data, data: profileData });
  }, [userId, navigate, profileData]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type;
      if (fileType !== 'image/jpeg' && fileType !== 'image/jpg') {
        // alert('Please upload a JPG or JPEG file.');
        toast.error('Please upload a JPG or JPEG file.');
        e.target.value = '';
        return;
      }
      setSelectedFile(file);
    }
  };

  const handlePhotoUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('displayPicture', selectedFile);
    console.log('hello photo:', selectedFile);
    try {
      setIsUploading(true);
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))?.split('=')[1];

      const response = await axios.put(
        `http://localhost:8000/user/updatedisplaypicture/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        toast.success('Profile picture updated successfully!');
        console.log(response.data, " updated ");
        profileData.image = response.data.data.image;
        closeModal();
      } else {
        toast.error(response.data.message || 'Failed to update profile picture.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'An error occurred during upload.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      if(userRole !== 'admin'){
        const token = document.cookie
          .split('; ')
          .find((row) => row.startsWith('token='))?.split('=')[1];

        if (!token) {
          navigate('/signin');
          return;
        }

        const response = await axios.post(
          'http://localhost:8000/user/logout',
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
          toast.success("Logout Successful");
          setTimeout(() => navigate(`/signin`), 1500);
        } else {
          // setError(response.data.message || 'Logout failed.');
          toast.error(response.data.message || 'Logout failed.');
        }
    }
    else{
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("adminToken="))
        ?.split("=")[1];

      if (!token) {
        toast.error("Please sign in.");
        setTimeout(() => navigate("/admin-signin"), 1500);
        return;
      }

      const response = await axios.post(
        "http://localhost:8000/admin/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        document.cookie = "adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        toast.success("Logout successful!");
        setTimeout(() => navigate("/admin-signin"), 1500);
      }
    }
    } catch (err) {
      toast.error(err.response?.data?.message || 'An error occurred during logout.');
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col">
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <ToastContainer position="top-center" autoClose={1500} />
      <div className="container mx-auto py-8 px-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-gray-600">
              {profileData?.image ? (
                <img src={profileData?.image} alt="Profile" className="object-cover w-full h-full" />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-700 text-gray-400">
                  No Image
                </div>
              )}
            </div>
            <div>
              {userRole !== 'admin' ? (
                <h1 className="text-3xl font-semibold text-white">
                  Hello, {profileData?.firstName} {profileData?.lastName}
                </h1>

              ):(
                <h1 className="text-3xl font-semibold text-white">
                  {profileData?.firstName} {profileData?.lastName}'s Profile
                </h1>
              )}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg"
          >
            Logout
          </button>
        </div>
        
        <div className="flex justify-between items-center mb-8">
          {userRole !== 'admin' ? (
            <>
            <div className="space-x-4">
              <button
                onClick={openModal}
                className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg"
                >
                Change Photo
              </button>
              <button
                className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg"
                onClick={() =>
                  navigate(`/update-profile/${userId}`, { state: { profile: data, userId, userRole } })
                }
                >
                Edit Profile
              </button>
            </div>
            <button
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg"
              onClick={() =>
                navigate(`/dashboard/${userId}`, { state: { profile: data, userId } })
              }
              >
              Back to Dashboard
            </button>
              </>

          ) : (
            <button
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg ml-auto"
              onClick={() =>
                navigate(`/existing-users`)
              }
              >
              Go Back
            </button>
          )}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-[90%] md:w-[50%]">
              <h2 className="text-xl font-semibold mb-4 text-white text-center">Upload Profile Picture</h2>
              <input
                type="file"
                onChange={handleFileChange}
                className="block w-full text-gray-400 file:py-2 file:px-4 file:mr-4 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-500 transition"
                accept=".jpg, .jpeg"
              />
              <div className="flex justify-end">
                <button
                  onClick={closeModal}
                  className="mr-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePhotoUpload}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
                  disabled={isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
              {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
            </div>
          </div>
        )}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <p>
            <span className="font-semibold text-indigo-400">Email:</span> {profileData?.email}
          </p>
          <p>
            <span className="font-semibold text-indigo-400">Role:</span> {profileData?.role.charAt(0).toUpperCase() + profileData?.role.slice(1).toLowerCase()}
          </p>
          {profileData?.role === 'student' ? (
            <>
              <p>
                <span className="font-semibold text-indigo-400">Roll No:</span> {profileData?.rollNo}
              </p>
              <p>
                <span className="font-semibold text-indigo-400">Branch:</span> {profileData?.branch}
              </p>
              <p>
                <span className="font-semibold text-indigo-400">Semester:</span> {profileData?.semester}
              </p>
              <p>
                <span className="font-semibold text-indigo-400">Section:</span> {profileData?.section}
              </p>
            </>
          ) : (
            <>
              <p>
                <span className="font-semibold text-indigo-400">Employee ID:</span> {profileData?.employeeId}
              </p>
              <p>
                <span className="font-semibold text-indigo-400">Experience:</span> {profileData?.exprerience} years
              </p>
            </>
          )}
          <p>
            <span className="font-semibold text-indigo-400">Contact:</span> {profileData?.contact}
          </p>
        </div>
      </div>
    </div>
    <Footer/>
    </div>
  );
};

export default Profile;
