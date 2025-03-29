import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from './Footer';
import Header from "./Header";
import ReCAPTCHA from "react-google-recaptcha";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState("student");
  const [captchaValue, setCaptchaValue] = useState(null);
  const apiUrl = window.location.hostname === 'localhost' ? "http://localhost:8000" : import.meta.env.VITE_APP_BASE_URL;
  const navigate = useNavigate();
  const recaptchaRef = useRef(null);
  const [loading, SetLoading] = useState(false)
  const [rollNumber, setRollNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    SetLoading(true)

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (role !== "student" && role !== "teacher") {
      // console.log(role);
      toast.error("Role must be student or teacher");
      return;
    }

    if (!captchaValue) {
      toast.error("Please complete the CAPTCHA verification.");
      return;
    }

    const userDetails = { firstName, lastName, email, password, confirmPassword, role, rollNo : rollNumber, recaptchaToken: captchaValue };
    const userEmail = { email };

    try {
      const response = await axios.post(`${apiUrl}/user/signup`, userDetails);
      if (response.status === 201) {
        const result = await axios.post(`${apiUrl}/user/sendotp`, userEmail);
        if (result.status === 200) {
          navigate("/otp-verification", { state: { email } });
        }
      }
    } catch (err) {
      setCaptchaValue(null);
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      toast.error(err.response?.data?.message || "Signup failed. Please try again.");
      // console.error(err);
    }
    finally {
      SetLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col">
        <div
          className="min-h-screen flex items-center justify-center bg-gray-900 text-white"
          style={{
            backgroundImage:
              "url('https://jharkhand.studyinfo.org.in/wp-content/uploads/2023/08/Screenshot-66-1024x469.png')",
            backgroundSize: "cover",
            backgroundPosition: "top",
          }}
        >
          <div className="bg-gray-800 mt-6 mb-6 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
            {error && (
              <div className="bg-red-600 text-white text-center py-2 px-4 mb-4 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium mb-1"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    placeholder="Enter your first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full p-2 bg-gray-700 rounded-md text-white outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium mb-1"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    placeholder="Enter your last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full p-2 bg-gray-700 rounded-md text-white outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-2 bg-gray-700 rounded-md text-white outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  {/* Password Field */}
                  <div className="relative">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium mb-1"
                    >
                      Password
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full p-2 bg-gray-700 rounded-md text-white outline-none focus:ring-2 focus:ring-green-500 pr-10"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-3 flex items-center mt-5 scale-[130%]"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <FaEyeSlash className="text-white" />
                      ) : (
                        <FaEye className="text-white" />
                      )}
                    </button>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="relative mt-4">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium mb-1"
                    >
                      Confirm Password
                    </label>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full p-2 bg-gray-700 rounded-md text-white outline-none focus:ring-2 focus:ring-green-500 pr-10"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-3 flex items-center mt-5 scale-[130%]"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash className="text-white" />
                      ) : (
                        <FaEye className="text-white" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium mb-1"
                  >
                    Role
                  </label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                    className="w-full p-2 bg-gray-700 rounded-md text-white outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                  </select>
                  {role === "student" && (
                    <div className="mt-4">
                      <label
                        htmlFor="rollNumber"
                        className="block text-sm font-medium mb-1"
                      >
                        Roll Number
                      </label>
                      <input
                        placeholder="Enter your complete roll number"
                        type="text"
                        id="rollNumber"
                        value={rollNumber}
                        onChange={(e) => setRollNumber(e.target.value)}
                        required
                        className="w-full p-2 bg-gray-700 rounded-md text-white outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  )}
                </div>
                <div className="flex justify-center">
                  <ReCAPTCHA
                    sitekey="6Ld2NdAqAAAAABxR2yY2qN3U4KofslxMySM3XNmW"
                    ref={recaptchaRef}
                    onChange={(value) => {
                      setCaptchaValue(value);
                    }}
                    onExpired={() => {
                      setCaptchaValue(null);
                    }}
                    onErrored={() => {
                      setCaptchaValue(null);
                    }}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded-md font-bold transition"
                >
                  {loading ? "Signing Up..." : "Sign Up"}
                </button>
              </form>
              <button
                onClick={() => navigate("/")}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md font-bold transition"
              >
                Go to Home
              </button>
            </div>

            <p className="mt-4 text-center text-sm">
              Already a user?{" "}
              <a href="/signin" className="text-green-400 hover:underline">
                Sign In
              </a>
            </p>
          </div>
          {/* <ToastContainer position="top-center" autoClose={2500} /> */}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Signup;
