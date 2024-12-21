// OTPVerification.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OTPVerification = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleOTPSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/user/verify-otp", { otp });
      if (response.status === 200) {
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
