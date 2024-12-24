import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("adminToken="))
          ?.split("=")[1];

        if (!token) {
          navigate("/admin-signin");
          return;
        }
        const response = await axios.get("http://localhost:8000/admin/check", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPendingUsers(response.data);
      } catch (err) {
        setError("Unauthorized or session expired.");
        navigate("/admin-signin");
      }
    };

    fetchPendingUsers();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("adminToken="))
        ?.split("=")[1];

      if (!token) {
        navigate("/admin-signin");
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
        navigate("/admin-signin");
      }
    } catch (err) {
      setError("Unauthorized or session expired.");
      navigate("/admin-signin");
    }
  };

  const handleConfirmRole = async (userId, role) => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("adminToken="))
      ?.split("=")[1];

    if (!token) {
      setError("Token not found.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/admin/approve",
        { userId, role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setPendingUsers(pendingUsers.filter((user) => user._id !== userId));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to confirm role.");
    }
  };

  const handleDeleteUser = async (userId) => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("adminToken="))
      ?.split("=")[1];

    if (!token) {
      setError("Token not found.");
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:8000/admin/deletependinguser/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setPendingUsers(pendingUsers.filter((user) => user._id !== userId));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user.");
    }
  };

  return (
    <div style={{ textAlign: "center", backgroundColor: "#000", height: "100vh", width:"100vh", marginTop : "7rem", padding: "2rem" }}>
      <div style={{
        backgroundColor: "#008000",
        padding: "2rem",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
        maxWidth: "800px",
        margin: "auto",
        color: "#fff"
      }}>
        <h2>Admin Dashboard</h2>

        {error && (
          <div style={{
            color: "#cc0000",
            backgroundColor: "#ffe6e6",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "10px",
          }}>
            {error}
          </div>
        )}


        <h2>Pending Users</h2>
        {pendingUsers.length === 0 ? (
          <p>No pending users.</p>
        ) : (
          <table style={{ width: "100%", color: "#fff", marginTop: "20px", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#006400", textAlign: "left" }}>
                <th style={{ padding: "10px", border: "1px solid #fff" }}>Name</th>
                <th style={{ padding: "10px", border: "1px solid #fff" }}>Email</th>
                <th style={{ padding: "10px", border: "1px solid #fff" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingUsers.map((user) => (
                <tr key={user._id} style={{ textAlign: "left", backgroundColor: "#004d00" }}>
                  <td style={{ padding: "10px", border: "1px solid #fff" }}>{user.firstName} {user.lastName}</td>
                  <td style={{ padding: "10px", border: "1px solid #fff" }}>{user.email}</td>
                  <td style={{ padding: "10px", border: "1px solid #fff" }}>
                    <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                      <label>
                        <input
                          type="radio"
                          name={`role-${user._id}`}
                          onClick={() => handleConfirmRole(user._id, "student")}
                        />
                        Student
                      </label>
                      <label>
                        <input
                          type="radio"
                          name={`role-${user._id}`}
                          onClick={() => handleConfirmRole(user._id, "teacher")}
                        />
                        Teacher
                      </label>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        style={{
                          backgroundColor: "#cc0000",
                          color: "#fff",
                          padding: "5px 10px",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#005f00",
            padding: "10px 20px",
            fontWeight: "bold",
            borderRadius: "5px",
            color: "#fff",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
