// OTPVerification.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const OTPVerification = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const { state } = useLocation();
  const navigate = useNavigate();

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
   
    // const UserEmail = { email };
    try {
      const response = await axios.post("http://localhost:8000/user/verifyotp", { email: state.email, otp });
      if (response.status === 200) {
        const {token} = response.data;
        console.log(token);
        localStorage.setItem("token", token);
        console.log("OTP Verified!");
        navigate("/blank"); // Redirect to a blank page after successful OTP verification
      }
    } catch (err) {
      setError("Invalid OTP. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="otp-container">
      <h2>Enter OTP</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleOTPSubmit}>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button type="submit">Submit OTP</button>
      </form>
    </div>
  );
};

export default OTPVerification;
