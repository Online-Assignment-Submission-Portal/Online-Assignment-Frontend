import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./Components/Signup";
import Signin from "./Components/Signin";
import OTPVerification from "./Components/OTPVerification"; // Import OTP verification page
import BlankPage from "./Components/BlankPage"; // Import BlankPage
import Header from "./Components/Header"; // Header for navigation (optional)

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/otp-verification" element={<OTPVerification />} /> {/* OTP verification page */}
        <Route path="/blank" element={<BlankPage />} /> {/* Blank page after OTP */}
      </Routes>
    </Router>
  );
}

export default App;
