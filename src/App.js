import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import useStore from './lib/useStore';
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
import SubjectDetails from "./Components/SubjectDetails";
import ExistingUsers from "./Components/ExistingUsers";
import NewAssignment from "./Components/NewAssignment";
import Profile from "./Components/Profile";
import UpdateProfile from "./Components/UpdateProfile";
import AssignmentDetails from './Components/AssignmentDetails';
import ViewSubmission from './Components/ViewSubmission';
import UpdateAssignment from "./Components/UpdateAssignment";
import PageNotFound from "./Components/PageNotFound";
import CheckPlagiarism from "./Components/CheckPlagiarism";
import AboutUs from './Components/AboutUs.js';
import Services from './Components/Services.js';
import ContactUs from "./Components/ContactUs.js";
import ChatContainer from "./Components/ChatContainer.js";
import Grievance from "./Components/Grievance.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

const App = () => {
  const { monitorSocketConnection } = useStore();

  useEffect(() => {
    monitorSocketConnection();
  }, [monitorSocketConnection]);

  return (
    <Router>
      <ToastContainer position="top-center" autoClose={1500} />
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
        <Route path="/existing-users" element={<ExistingUsers />} />
        <Route path="/dashboard/:id" element={<UserDashboard />} />
        <Route path="/add-subject" element={<AddSubject />} />
        <Route path="/subject/:id" element={<SubjectDetails />} />
        <Route path="/new-assignment" element={<NewAssignment />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/update-profile/:id" element={<UpdateProfile />} />
        <Route path="/assignment/:id" element={<AssignmentDetails />} />
        <Route path="/view-submission/:id" element={<ViewSubmission />} />
        <Route path="/updateassignment/:id" element={<UpdateAssignment />} />
        <Route path="/check-plagiarism" element={<CheckPlagiarism />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/chat-container" element={<ChatContainer />} />
        <Route path="/grievances" element={<Grievance />} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
};

export default App;