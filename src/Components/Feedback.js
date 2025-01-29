import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Loding from "../partials/Loding";
import "react-toastify/dist/ReactToastify.css";


const Feedback = ({ assignmentId }) => {
    const navigate = useNavigate();
    const apiUrl =
        window.location.hostname === "localhost"
            ? "http://localhost:8000"
            : process.env.REACT_APP_BASE_URL;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submittedSubmissions, setSubmittedSubmissions] = useState([]);
    const [editedSubmissions, setEditedSubmissions] = useState({});

    const handleInputChange = (e, studentId, field) => {
        const { value } = e.target;
        setEditedSubmissions(prevState => ({
            ...prevState,
            [studentId]: {
                ...prevState[studentId],
                [field]: value
            }
        }));
    };

    const handleSave = async (studentId) => {
        const submissionData = editedSubmissions[studentId];
        if (!submissionData?.marks) {
            toast.error('Marks cannot be empty.');
            return;
        }
        try {
            const token = document.cookie
                .split('; ')
                .find((row) => row.startsWith('token='))?.split('=')[1];

            if (!token) {
                toast.error('Please sign in to save submissions.');
                return navigate('/signin');
            }

            // Send the updated marks and feedback to your backend
            const response = await axios.post(`${apiUrl}/assignment/submission/save`, {
                studentId,
                marks: submissionData.marks,
                feedback: submissionData.feedback
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                toast.success('Submission saved successfully!');
            } else {
                toast.error('Failed to save submission.');
            }
        } catch (err) {
            toast.error('Error in saving submission.');
        }
    };

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const token = document.cookie
                    .split('; ')
                    .find((row) => row.startsWith('token='))?.split('=')[1];

                if (!token) {
                    toast.error('Please sign in to view submissions.');
                    return navigate('/signin');
                }

                const response = await axios.get(`${apiUrl}/assignment/submission/${assignmentId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.success) {
                    const { submitted, late } = response.data.submissions;

                    const formattedSubmissions = [
                        ...submitted.map((submission) => ({ ...submission, status: 'On Time' })),
                        ...late.map((submission) => ({ ...submission, status: 'Late' })),
                    ];

                    setSubmittedSubmissions(formattedSubmissions);
                    toast.success('Feedback loaded successfully!');
                } else {
                    toast.error('Failed to fetch assignment Feedback.');
                }
            } catch (err) {
                toast.error('Error in fetching Feedback.');
            } finally {
                setLoading(false);
            }
        };
        if (!assignmentId) return;
        fetchSubmissions();
    }, [assignmentId, navigate]);

    if (loading) {
        return <Loding />;
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
                <p>{error}</p>
            </div>
        );
    }

    return (

        <div className="overflow-x-auto">
            {/* <ToastContainer position="top-center" autoClose={1500} /> */}
            <table className="w-full text-left border-collapse border border-gray-700">
                <thead>
                    <tr className="bg-gray-700 text-gray-200">
                        <th className="px-4 py-2 border border-gray-600">Name</th>
                        <th className="px-4 py-2 border border-gray-600">Roll No</th>
                        <th className="px-4 py-2 border border-gray-600">Status</th>
                        <th className="px-4 py-2 border border-gray-600">Marks</th>
                        <th className="px-4 py-2 border border-gray-600">Feedback</th>
                        <th className="px-4 py-2 border border-gray-600">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {submittedSubmissions.length > 0 ? (
                        submittedSubmissions.map((submission, index) => (
                            <tr
                                key={submission.studentId}
                                className={`${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                                    } hover:bg-gray-600`}
                            >
                                <td className="border-b border-gray-600 px-4 py-2">
                                    {submission.firstName} {submission.lastName}
                                </td>
                                <td className="border-b border-gray-600 px-4 py-2">
                                    {submission.rollNo}
                                </td>
                                <td className="border-b border-gray-600 px-4 py-2">
                                    {submission.status}
                                </td>
                                <td className="border-b border-gray-600 px-4 py-2">
                                    <input
                                        type="number"
                                        value={editedSubmissions[submission.studentId]?.marks || submission.marks}
                                        onChange={(e) => handleInputChange(e, submission.studentId, "marks")}
                                        className="bg-gray-600 border border-gray-400 p-2 rounded-md focus:ring-2 focus:ring-blue-500"
                                    />
                                </td>
                                <td className="border-b border-gray-600 px-4 py-2">
                                    <input
                                        type="text"
                                        value={editedSubmissions[submission.studentId]?.feedback || submission.feedback}
                                        onChange={(e) => handleInputChange(e, submission.studentId, "feedback")}
                                        className="bg-gray-600 border border-gray-400 p-2 rounded-md focus:ring-2 focus:ring-blue-500"
                                    />
                                </td>
                                <td className="border-b border-gray-600 px-4 py-2 text-center">
                                    <button
                                        onClick={() => handleSave(submission.studentId)}
                                        className="bg-blue-600 text-white py-1 px-4 rounded-lg hover:bg-blue-500"
                                    >
                                        Save
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center text-gray-400 px-4 py-2">
                                No submissions found.
                            </td>
                        </tr>
                    )}
                </tbody>

            </table>
        </div>
    )
}

export default Feedback
