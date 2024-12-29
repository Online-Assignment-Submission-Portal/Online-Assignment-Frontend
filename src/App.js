import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Signup from "./Components/Signup"; 
import Signin from "./Components/Signin"; 
import OTPVerification from "./Components/OTPVerification"; 
import BlankPage from "./Components/BlankPage"; 
import AdminSignin from "./Components/AdminSignin";
import AdminDashboard from "./Components/AdminDashboard"; 
import UserDashboard from "./Components/UserDashboard"; 
import Home from "./Components/Home"; 
import ForgotPassword from "./Components/ForgotPassEmail";
import ResetPassword from "./Components/ResetPass";
import AddSubject from "./Components/AddSubject";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/otp-verification" element={<OTPVerification />} />
        <Route path="/blank" element={<BlankPage />} />
        <Route path="/admin-signin" element={<AdminSignin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/dashboard/:id" element={<UserDashboard />} />
        <Route path="/add-subject" element={<AddSubject />} />
      </Routes>
    </Router>
  );
};

export default App;