import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function SubjectDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const subject = location.state?.subject;
  const userID = location.state?.userID;
  const subjectName = location.state?.subjectName;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [foundStudents, setFoundStudents] = useState([]);
  const [notFoundEmails, setNotFoundEmails] = useState([]);
  const [assignments, setAssignments] = useState([]);


  useEffect(() => {
    if (subject?.subject_id) {
      handleAddStudents();
    }
  }, [subject?.subject_id]);


  useEffect(() => {
    if (subject?.subject_id) {
      handleAddStudents();
      fetchAssignments();  // Add this line to fetch assignments
    }
  }, [subject?.subject_id]);
  
  const fetchAssignments = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1];
  
      if (!token) {
        return navigate('/signin');
      }
  
      const response = await axios.get(
        `http://localhost:8000/assignment/${subject.subject_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.data.success) {
        setAssignments(response.data.assignments); // Set the fetched assignments
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };
  
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
        `http://localhost:8000/user/addstudent/${subject.subject_id}`,
        { email: emailInput },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response);
      if (response.data.success) {
        setFoundStudents(response.data.students_id);
        setNotFoundEmails((prev) => [...prev, ...response.data.notFoundStudents]);
        setEmailInput('');
        setIsModalOpen(false);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error adding students:', error);
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
        `http://localhost:8000/user/removestudent/${subject.subject_id}`,
        { studentId, studentEmail },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response);
      if (response.data.success) {
        setFoundStudents((prev) => prev.filter((student) => student._id !== studentId));
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error removing student:', error);
    }
  };

  const removeNotFoundEmail = (email) => {
    setNotFoundEmails(notFoundEmails.filter((e) => e !== email));
  };

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

  const handleRemoveAssignment = async (assignmentId) => {
    try {
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1];
  
      if (!token) {
        return navigate('/signin');
      }
  
      const response = await axios.post(
        `http://localhost:8000/assignment/remove/${assignmentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.data.success) {
        setAssignments((prevAssignments) =>
          prevAssignments.filter((assignment) => assignment._id !== assignmentId)
        );
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error removing assignment:', error);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-900 py-8 flex flex-col">
      <div className="container mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-200 text-center overflow-auto scrollbar-none">{subjectName}</h1>
          <button
            onClick={() => navigate(`/dashboard/${userID}`)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="">
          <p className="text-gray-300 mb-2">Teacher Name: <span className="font-medium text-gray-100">{subject.teacher_name}</span></p>
          <p className="text-gray-300 mb-2">Number of Students: <span className="font-medium text-gray-100">{foundStudents.length}</span></p>
          <p className="text-gray-300">Subject Code: <span className="font-medium text-gray-100">{subject.subject_code}</span></p>
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
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
        

        <div className='mt-6 flex justify-between items-center'>
        {/* <p className="text-2xl font-semibold text-gray-200">Assignments</p> */}

        <div className='w-[40%] flex justify-between items-center overflow-auto'>
          <div className="text-2xl font-semibold text-gray-200">Assignments</div>
          <button
            onClick={() => navigate('/new-assignment', { state: { subject } })}
            className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500 transition"
            >
            + New Assignment
          </button>
          </div>
        <div className='w-[40%] flex justify-between items-center overflow-auto'>
          <div className="text-2xl font-semibold text-gray-200">Students</div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500 transition"
            >
            + Add Students
          </button>
          </div>
        </div>

        <div className='flex justify-between overflow-auto'>
            <p className='text-gray-400 text-center mt-2'>Assignments will be shown here in tabular form</p>
        {foundStudents.length > 0 ? (          
          <table className="mt-6 w-2/5  bg-gray-800 text-gray-200 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-violet-800">
                <th className="px-4 py-2 text-center ">Name</th>
                <th className="px-4 py-2 text-center ">Email</th>
                <th className="px-4 py-2 text-center ">Chat</th>
                <th className="px-4 py-2 text-center ">Remove</th>
              </tr>
            </thead>
            <tbody>
              {foundStudents.map((student) => (
                <tr key={student._id} className="hover:bg-gray-700 transition text-center">
                  <td className="border-b border-double border-gray-600 px-4 py-2 items-center">{student.firstName} {student.lastName}</td>
                  <td className="border-b border-gray-600 px-4 py-2 items-center">{student.email}</td>
                  <td className="border-b border-gray-600 px-4 py-2 items-center">Chat</td>
                  <td className="border-b border-gray-600 px-4 py-2 items-center">

                  <button
                      onClick={() => handleRemoveStudent(student._id, student.email)}
                      className="text-red-500 hover:text-red-600"
                      >
                      ✕
                    </button>
                      </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
            <p className="text-gray-400 text-center mt-2 mr-[15%]">No students found.</p>
        )}
        </div>

        {notFoundEmails.length > 0 && (
          <>
        <p className="text-2xl font-semibold text-gray-200 mt-6">Emails Not Found</p>
        <table className="mt-6 w-full border-collapse bg-gray-800 text-gray-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {notFoundEmails.map((email, index) => (
                  <tr key={index} className="hover:bg-gray-700 transition">
                    <td className="border-b border-gray-600 px-4 py-2 break-all w-[75%]">{email}</td>
                    <td className="border-b border-gray-600 px-4 py-2">
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
          </>
        )}
        {assignments.length > 0 ? (
  <table className="mt-6 w-2/5  bg-gray-800 text-gray-200 rounded-lg overflow-hidden">
    <thead>
      <tr className="bg-violet-800">
        <th className="px-4 py-2 text-center ">Assignment Name</th>
        <th className="px-4 py-2 text-center ">Due Date</th>
        <th className="px-4 py-2 text-center ">Details</th>
        <th className="px-4 py-2 text-center ">Remove</th>
      </tr>
    </thead>
    <tbody>
      {assignments.map((assignment) => (
        <tr key={assignment._id} className="hover:bg-gray-700 transition text-center">
          <td className="border-b border-double border-gray-600 px-4 py-2 items-center">{assignment.name}</td>
          <td className="border-b border-gray-600 px-4 py-2 items-center">{assignment.dueDate}</td>
          <td className="border-b border-gray-600 px-4 py-2 items-center">Details</td>
          <td className="border-b border-gray-600 px-4 py-2 items-center">
            <button
              onClick={() => handleRemoveAssignment(assignment._id)}
              className="text-red-500 hover:text-red-600"
            >
              ✕
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
) : (
  <p className="text-gray-400 text-center mt-2 mr-[15%]">No assignments found.</p>
)}


      </div>
    </div>
  );
  
}

export default SubjectDetails;