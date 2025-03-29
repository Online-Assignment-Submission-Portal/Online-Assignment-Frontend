import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';  // Import Toastify
import 'react-toastify/dist/ReactToastify.css';  // Import styles for Toastify
import * as XLSX from 'xlsx'; // Import XLSX for Excel export
import Header from './UserHeader'
import NoticeBoard from './NoticeBoard';
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FaBars } from "react-icons/fa";


function SubjectDetails() {
  const location = useLocation();
  // const apiUrl = process.env.REACT_APP_BASE_URL || "http://localhost:8000"
  const apiUrl = window.location.hostname === 'localhost'
    ? "http://localhost:8000" : import.meta.env.VITE_APP_BASE_URL;
  const navigate = useNavigate();
  const subject = location.state?.subject;
  const userID = location.state?.userID;
  const userRole = location.state?.userRole;
  const subjectID = location.state.subject.subject_id;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [foundStudents, setFoundStudents] = useState([]);
  const [notFoundEmails, setNotFoundEmails] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  // console.log(subject);
  // console.log(location.state, " there ");


  useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        const token = document.cookie
          .split('; ')
          .find((row) => row.startsWith('token='))
          ?.split('=')[1];

        const response = await axios.get(`${apiUrl}/message/read/${userID}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = response.data;
        // Transform the data into a more usable format (keyed by user ID)
        const unreadByUser = {};
        data.forEach((user) => {
          unreadByUser[user._id] = user.unreadMessages;
        });

        setUnreadMessages(unreadByUser);
      } catch (error) {
        console.error("Error fetching unread messages:", error);
      }
    };

    fetchUnreadMessages();

    const interval = setInterval(fetchUnreadMessages, 10000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [userID, apiUrl]);


  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='))
      ?.split('=')[1];

    if (!token) {
      return navigate('/signin');
    }
    handleAddStudents();
    if (subject?.assignments) setAssignments(subject.assignments);
  }, [navigate]);

  const navigateToChat = async (receiverId) => {
    try {
      // Call the backend API to mark the messages as read
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1];

      await axios.post(
        `${apiUrl}/message/markread`,
        { senderId: receiverId },  // Pass the senderId (the current student)
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Optionally update the unreadMessages state locally to reflect the changes
      setUnreadMessages((prev) => ({
        ...prev,
        [receiverId]: 0, // Set unread count for this sender to 0
      }));

      // Navigate to the chat container with the sender and receiver IDs
      navigate('/chat-container', {
        state: {
          senderId: userID,
          receiverId: receiverId
        }
      });
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };


  useEffect(() => {
    // console.log("Unread Messages State:", unreadMessages);
  }, [unreadMessages]);

  const handleAddStudents = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1];

      if (!token) {
        return navigate('/signin');
      }

      const response = await axios.post(
        `${apiUrl}/user/addstudent/${subject.subject_id}`,
        { email: emailInput },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      // console.log(response);
      if (response.data.success) {
        setFoundStudents(response.data.students_id);
        setNotFoundEmails((prev) => [...prev, ...response.data.notFoundStudents]);
        setEmailInput('');
        setIsModalOpen(false);
        if (emailInput.length === 0) {
          return;
        }
        if (emailInput.length !== 0) {
          toast.success('Students added successfully!'); // Success toast
        }

        const senderId = userID; // The teacher/admin adding the student
        // console.log(response.data.students_id);
        response.data.addedStudents.forEach(async (studentId) => {
          try {
            await axios.post(
              `${apiUrl}/notification/new`,
              {
                senderId,
                receiverId: studentId,
                content: `You have been added to the subject: ${subject.subject_name}`,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              }
            );
          } catch (notifError) {
            console.error('Error sending notification:', notifError);
          }

        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      // console.error('Error adding students:', error);
      toast.error('Error adding students.'); // Error toast
    }
  };

  const handleRemoveStudent = async (studentId, studentEmail) => {
    try {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1];

      if (!token) {
        return navigate('/signin');
      }

      const response = await axios.post(
        `${apiUrl}/user/removestudent/${subject.subject_id}`,
        { studentId, studentEmail },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.data.success) {
        setFoundStudents((prev) => prev.filter((student) => student._id !== studentId));
        toast.success('Student removed successfully!'); // Success toast
        const senderId = userID; // The teacher/admin removing the student
        response.data.removedStudents.forEach(async (studentId) => {
          try {
            await axios.post(
              `${apiUrl}/notification/new`,
              {
                senderId,
                receiverId: studentId,
                content: `You have been removed from the subject: ${subject.subject_name}`,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              }
            );
          } catch (notifError) {
            console.error('Error sending notification:', notifError);
          }
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error removing student:', error);
      toast.error('Error removing student.'); // Error toast
    }
  };

  const removeNotFoundEmail = (email) => {
    setNotFoundEmails(notFoundEmails.filter((e) => e !== email));
    // toast.info('Email removed from list.'); Info toast
  };

  const downloadStudentList = () => {
    if (foundStudents.length === 0) {
      toast.error('No students found to download!');
      return;
    }

    const studentData = foundStudents.map((student, index) => ({
      S_No: index + 1,
      RollNo: student.rollNo,
      Name: `${student.firstName} ${student.lastName}`,
      Email: student.email,
    }));

    const worksheet = XLSX.utils.json_to_sheet(studentData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

    XLSX.writeFile(workbook, `${subject.subject_name}_Students_List.xlsx`);
    toast.success('Student list downloaded successfully!');
  };

  const confirmDeleteSubject = () => {
    toast(
      ({ closeToast }) => (
        <div className="text-gray-800">
          <p className='font-semibold text-center'>Are you sure you want to delete this subject? This action cannot be undone.</p>
          <div className="flex justify-between gap-2 mt-4">
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
              onClick={closeToast}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 transition"
              onClick={() => {
                handleDeleteSubject();
                closeToast();
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
  };

  const handleDeleteSubject = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1];

      if (!token) {
        return navigate('/signin');
      }
      const response = await axios.delete(`${apiUrl}/subject/${subjectID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        toast.success('Subject deleted successfully!');
        navigate(`/dashboard/${userID}`);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Error deleting subject.');
    }
  };


  const renderStudentRow = (student) => (
    <tr key={student._id} className="hover:bg-gray-700 transition text-center">
      <td className="border-b border-gray-600 px-4 py-2 max-w-[150px] overflow-auto scrollbar-none">
        <div className="flex items-center justify-center gap-2">
          {unreadMessages[student._id] > 0 && (
            <div className="relative">
              <div className="absolute -left-2 -top-2">
                <span className="flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
              </div>
            </div>
          )}
          <span>{student.firstName} {student.lastName}</span>
        </div>
      </td>
      <td className="border-b border-gray-600 px-4 py-2 max-w-[150px] overflow-auto scrollbar-none">
        {student.email}
      </td>
      {userRole === "teacher" && (
        <>
          <td className="border-b border-gray-600 px-4 py-2">
            <button
              onClick={() => navigateToChat(student._id)}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
            >
              {unreadMessages[student._id] > 0 ? `Chat (${unreadMessages[student._id]})` : 'Chat'}
            </button>
          </td>
          <td className="border-b border-gray-600 px-4 py-2">
            <button
              onClick={() => handleRemoveStudent(student._id, student.email)}
              className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-500 transition"
            >
              Remove
            </button>
          </td>
        </>
      )}
    </tr>
  );
  if (!subject) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Subject Details Not Found</h1>
          <button
            onClick={() => navigate(`/dashboard/${userID}`)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }


  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-900 py-8 flex flex-col">
        {/* <ToastContainer position="top-center" autoClose={1500} /> */}
        <div className="container mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4 relative">
            <div className="flex items-center justify-between w-full sm:w-auto">
              <h1 className="text-3xl font-bold text-gray-200 text-left">
                Subject Name: {subject.subject_name}
              </h1>
              <div className="sm:hidden ml-4 relative z-20">
                <button
                  className="p-2 bg-gray-700 rounded-lg text-white transition-transform duration-200"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <FaBars className={`h-6 w-6 transform duration-200 ${isOpen ? 'rotate-90' : 'rotate-0'}`} />
                </button>
                {isOpen && (
                  <div className="font-bold absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-lg p-2 flex flex-col gap-2 z-10 transition duration-200">
                    {userRole === 'teacher' && (
                      <button
                        onClick={confirmDeleteSubject}
                        className="px-4 py-2 sm:px-6 sm:py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition"
                      >
                        Delete Subject
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/dashboard/${userID}`)}
                      className="px-4 py-2 sm:px-6 sm:py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition"
                    >
                      Back to Dashboard
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="sm:flex gap-4 hidden">
              {userRole === 'teacher' && (
                <button
                  onClick={confirmDeleteSubject}
                  className="px-4 py-2 sm:px-6 sm:py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition"
                >
                  Delete Subject
                </button>
              )}
              <button
                onClick={() => navigate(`/dashboard/${userID}`)}
                className="px-4 py-2 sm:px-6 sm:py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
          <div className="space-y-2 text-sm sm:text-base">
            <div>
              <p className="flex flex-row text-gray-300 space-x-5 items-baseline">
                <div>
                  Teacher Name:{" "}
                  <span className="font-medium text-gray-100">{subject.teacher_name}</span>
                </div>
                {userRole === "student" && (
                  <button
                    onClick={() => navigateToChat(subject.teacher_id)}
                    className="px-2 py-1 bg-blue-600 text-white hover:bg-blue-500 font-semibold rounded-lg transition"
                  >
                    Chat with Teacher
                  </button>
                )}
              </p>
            </div>
            <div>
              <p className="text-gray-300">
                Number of Students:{" "}
                <span className="font-medium text-gray-100">{foundStudents.length}</span>
              </p>
            </div>
            <div>
              <p className="text-gray-300">
                Subject Code:{" "}
                <span className="font-medium text-gray-100">{subject.subject_code}</span>
              </p>
            </div>
          </div>
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
              <div className="bg-gray-300 p-8 rounded-lg shadow-lg w-[90%] md:w-[50%]">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Add Students</h2>
                <textarea
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full p-2 border border-gray-400 rounded mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter emails, separated by commas"
                  rows={5}
                />
                <div className="flex justify-end">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="mr-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddStudents}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="mt-6">
            <div className="flex flex-col lg:flex-row lg:gap-6 ">
              <div className="lg:w-1/2 mt-6 lg:mt-0">
                <div className="flex justify-between items-center mb-4 gap-2">
                  <h2 className="text-2xl font-semibold text-gray-200">Assignments</h2>
                  <div className="flex gap-2">
                    {userRole === "teacher" && (
                      <button
                        onClick={() =>
                          navigate("/new-assignment", {
                            state: { subject, userID, userRole, subjectID, foundStudents },
                          })
                        }
                        className="px-4 py-2 text-sm md:px-6 md:py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500 transition"
                      >
                        + New Assignment
                      </button>
                    )}
                  </div>
                </div>
                {assignments.length > 0 ? (
                  <div className="max-h-96 overflow-auto scrollbar-none">
                    <table className="table-auto min-w-full bg-gray-800 text-gray-200 rounded-lg">
                      <thead>
                        <tr className="bg-violet-800">
                          <th className="px-4 py-2 text-center">Assignment Name</th>
                          <th className="px-4 py-2 text-center">Deadline</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...assignments]
                          .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
                          .map((assignment) => (
                            <tr
                              key={assignment._id}
                              className="hover:bg-gray-700 transition text-center"
                              onClick={() =>
                                navigate(`/assignment/${assignment._id}`, {
                                  state: { assignment_id: assignment._id, userRole, userID, subjectID },
                                })
                              }
                            >
                              <td className="border-b border-gray-600 px-4 py-2 max-w-[150px] overflow-auto scrollbar-none">
                                {assignment.title}
                              </td>
                              <td className="border-b border-gray-600 px-4 py-2 max-w-[150px] overflow-auto scrollbar-none">
                                {new Date(assignment.deadline).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                })}
                              </td>
                            </tr>
                          ))}

                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-400 text-center">No assignments found.</p>
                )}
              </div>
              <div className="lg:w-1/2 mt-8 lg:mt-0">
                <div className="flex justify-between items-center mb-4 gap-2">
                  <h2 className="text-2xl font-semibold text-gray-200">Students</h2>
                  <div className="flex gap-2">
                    {userRole === "teacher" && (
                      <>
                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="px-4 py-2 text-sm md:px-6 md:py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500 transition"
                        >
                          + Add Students
                        </button>
                        <button
                          onClick={downloadStudentList}
                          className="px-4 py-2 text-sm md:px-6 md:py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500 transition"
                        >
                          Download Student List
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {foundStudents.length > 0 ? (
                  <div className="max-h-96 overflow-auto scrollbar-none">
                    <table className="table-auto min-w-full bg-gray-800 text-gray-200 rounded-lg">
                      <thead>
                        <tr className="bg-violet-800">
                          <th className="px-4 py-2 text-center">Name</th>
                          <th className="px-4 py-2 text-center">Email</th>
                          {userRole === "teacher" && (
                            <>
                              <th className="px-4 py-2 text-center">Chat</th>
                              <th className="px-4 py-2 text-center">Remove</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {[...foundStudents]
                          .sort((a, b) => a.email.localeCompare(b.email))
                          .map(student => renderStudentRow(student))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-400 text-center">No students found.</p>
                )}
              </div>
            </div>
          </div>

          {notFoundEmails.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-200">Emails Not Found</h2>
              <div className="max-h-96 overflow-auto mt-4 scrollbar-none ">
                <table className="table-auto min-w-full bg-gray-800 text-gray-200 rounded-lg">
                  <thead>
                    <tr className="bg-gray-700">
                      <th className="px-4 py-2 text-center">Email</th>
                      <th className="px-4 py-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notFoundEmails.map((email, index) => (
                      <tr key={index} className="hover:bg-gray-700 transition text-center">
                        <td className="border-b border-gray-600 px-4 py-2 overflow-auto scrollbar-none">{email}</td>
                        <td className="border-b border-gray-600 px-4 py-2 overflow-auto scrollbar-none">
                          <button
                            onClick={() => removeNotFoundEmail(email)}
                            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <NoticeBoard userRole={userRole} subject={subject} notice={subject.notices} />
        </div>
      </div>
    </>
  );
}

export default SubjectDetails;