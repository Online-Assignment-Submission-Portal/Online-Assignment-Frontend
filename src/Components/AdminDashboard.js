import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    try{
      const token = localStorage.getItem("token");
      console.log(token);
      if(!token){
        console.error("No Token provided");
        return;
      }
      const response = await axios.post("http://localhost:8000/admin/logout", {token},
                                      {
                                       headers: {
                                        Authorization: `Bearer ${token}`,
                                       },
                                    });
      console.log(response);
      if(response.status === 200){
        localStorage.removeItem("token");
        navigate("/");
      }
    } catch(err){
      if (err.response && err.response.status === 401) {
        console.log("Token has expired");
        localStorage.removeItem('token'); // Clear expired token
        navigate('/'); // Redirect to login page
      } else {
        alert('An error occurred during logout.');
      }
      console.log(err);
    }
  }
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Welcome, Admin! This is your dashboard.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default AdminDashboard;
