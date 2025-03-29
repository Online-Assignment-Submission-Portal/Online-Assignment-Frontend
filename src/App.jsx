import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import useStore from './lib/useStore.js';
import Header from "./Components/Header.jsx";
import Signup from "./Components/Signup.jsx";
import Signin from "./Components/Signin.jsx";
import OTPVerification from "./Components/OTPVerification.jsx";
import BlankPage from "./Components/BlankPage.jsx";
import AdminSignin from "./Components/AdminSignin.jsx";
import AdminDashboard from "./Components/AdminDashboard.jsx";
import UserDashboard from "./Components/UserDashboard.jsx";
import Home from "./Components/Home.jsx";
import ForgotPassword from "./Components/ForgotPassEmail.jsx";
import ResetPassword from "./Components/ResetPass.jsx";
import AddSubject from "./Components/AddSubject.jsx";
import SubjectDetails from "./Components/SubjectDetails.jsx";
import ExistingUsers from "./Components/ExistingUsers.jsx";
import NewAssignment from "./Components/NewAssignment.jsx";
import Profile from "./Components/Profile.jsx";
import UpdateProfile from "./Components/UpdateProfile.jsx";
import AssignmentDetails from './Components/AssignmentDetails.jsx';
import ViewSubmission from './Components/ViewSubmission.jsx';
import UpdateAssignment from "./Components/UpdateAssignment.jsx";
import PageNotFound from "./Components/PageNotFound.jsx";
import CheckPlagiarism from "./Components/CheckPlagiarism.jsx";
import AboutUs from './Components/AboutUs.jsx';
import Services from './Components/Services.jsx';
import ContactUs from "./Components/ContactUs.jsx";
import ChatContainer from "./Components/ChatContainer.jsx";
import Grievance from "./Components/Grievance.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import Notification from "./Components/Notification.jsx";

import UserFeedback from "./Components/UserFeedback.jsx";

import AdminFeedback from "./Components/AdminFeedback.jsx";


const App = () => {
  // const { monitorSocketConnection, userId } = useStore();

  // useEffect(() => {
  //   if(userId){
  //   console.log("Montioring socket connection");
  //   monitorSocketConnection();
  //   }
  // }, [monitorSocketConnection, userId]);

  const { connectSocket, userId } = useStore();

  useEffect(() => {
    // On app mount, if there is a userId, establish the socket connection.
    if (userId) {
      connectSocket();
    }
  }, [userId, connectSocket]);

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

        <Route path="/feedback" element={<UserFeedback />} />          
        <Route path="/notification" element={<Notification />} />              
        <Route path="/userfeedback" element={<AdminFeedback />} />              
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
