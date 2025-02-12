import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from 'xlsx';

const Feedback = ({ assignmentId, submissions }) => {
    const [columns, setColumns] = useState({
        CompletenessScore: false,
        GrammarScore: false,
        OriginalityScore: false,
        StructureScore: false,
        FinalRubricScore: true,
    });
    const handleFieldToggle = (column) => {
        setColumns((prevColumns) => ({
            ...prevColumns,
            [column]: !prevColumns[column],
        }));
    };
    console.log(submissions);
    const navigate = useNavigate();
    const apiUrl =
        window.location.hostname === "localhost"
            ? "http://localhost:8000"
            : process.env.REACT_APP_BASE_URL;

    const [editedSubmissions, setEditedSubmissions] = useState({});

    const handleInputChange = (e, studentId, field) => {
        let { value } = e.target;

        if (field === "grade") {
            value = value ? Number(value) : "";
        }

        setEditedSubmissions((prevState) => {
            const updatedState = {
                ...prevState,
                [studentId]: {
                    ...prevState[studentId],
                    [field]: value,
                },
            };
            return updatedState;
        });
    };


    const handleSave = async (studentId) => {
        const submissionData = editedSubmissions[studentId];
        const originalSubmission = submissions.find(submission => submission.studentId.id === studentId);
        const grade = submissionData?.grade !== undefined ? submissionData.grade : originalSubmission?.grade;
        const feedback = submissionData?.feedback !== undefined ? submissionData.feedback : originalSubmission?.feedback;
        if (grade === undefined || grade === "") {
            toast.error("Marks cannot be empty.");
            return;
        }
        try {
            const token = document.cookie
                .split("; ")
                .find((row) => row.startsWith("token="))
                ?.split("=")[1];

            if (!token) {
                toast.error("Please sign in to save submissions.");
                return navigate("/signin");
            }

            const response = await axios.post(
                `${apiUrl}/assignment/submission/save/${studentId}/${assignmentId}`,
                {
                    grade: grade,
                    feedback: feedback,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                toast.success("Submission saved successfully!");
            } else {
                toast.error("Failed to save submission.");
            }
        } catch (err) {
            toast.error("Error in saving submission.");
        }
    };

    const handleDownload = () => {
        const data = submissions
            .map(submission => ({
                RollNo: submission.rollNo,
                Name: `${submission.firstName} ${submission.lastName}`,
                Marks: submission.grade,
            }))
            .sort((a, b) => a.RollNo - b.RollNo);

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Submissions");

        XLSX.writeFile(workbook, `Submissions_${assignmentId}.xlsx`);
    };

    return (
        <div className="overflow-x-auto mt-8 bg-gray-800 rounded-lg shadow-lg">
            <div className="flex flex-col mb-4 gap-2">
                <div className="flex flex-row justify-between gap-2">

                    <h2 className="text-xl sm:text-2xl font-bold text-gray-200">Grading and Feedback</h2>
                    <button
                        onClick={handleDownload}
                        className="px-4 py-2 text-sm md:px-6 md:py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500 transition"
                    >
                        Download Marks
                    </button>
                </div>
                <div className="mb-4 flex flex-row justify-between sm:justify-end gap-3 mt-2">
                    {Object.keys(columns).map((key) => (
                        <label key={key} className="inline-flex items-center select-none text-gray-300">
                            <input
                                type="checkbox"
                                checked={columns[key]}
                                onChange={() => handleFieldToggle(key)}
                                className="mr-2"
                            />
                            {key.replace(/([A-Z])/g, " $1").trim()}
                        </label>
                    ))}
                </div>
            </div>
            <div className="overflow-x-auto scrollbar-none">
                <table className="w-full text-left border-collapse border border-gray-700">
                    <thead>
                        <tr className="bg-gray-700 text-gray-200">
                            <th className="px-4 py-2 border border-gray-600">Name</th>
                            <th className="px-4 py-2 border border-gray-600">Roll No</th>
                            <th className="px-4 py-2 border border-gray-600">Status</th>

                            {columns.CompletenessScore && (
                                <th
                                    className="px-2 sm:px-4 py-2 border border-gray-600 relative group"
                                    title="Measures how much of the assignment is complete based on the given requirements."
                                >
                                    Completeness Score
                                    <span className="text-blue-400 cursor-help ml-1">🛈</span>
                                </th>
                            )}

                            {columns.GrammarScore && (
                                <th
                                    className="px-2 sm:px-4 py-2 border border-gray-600 relative group"
                                    title="Evaluates the grammar, punctuation, and overall language accuracy."
                                >
                                    Grammar Score
                                    <span className="text-blue-400 cursor-help ml-1">🛈</span>
                                </th>
                            )}

                            {columns.OriginalityScore && (
                                <th
                                    className="px-2 sm:px-4 py-2 border border-gray-600 relative group"
                                    title="Assesses how much of the content is original and not copied from other sources."
                                >
                                    Originality Score
                                    <span className="text-blue-400 cursor-help ml-1">🛈</span>
                                </th>
                            )}

                            {columns.StructureScore && (
                                <th
                                    className="px-2 sm:px-4 py-2 border border-gray-600 relative group"
                                    title="Checks the organization, formatting, and logical structure of the assignment."
                                >
                                    Structure Score
                                    <span className="text-blue-400 cursor-help ml-1">🛈</span>
                                </th>
                            )}

                            {columns.FinalRubricScore && (
                                <th
                                    className="px-2 sm:px-4 py-2 border border-gray-600 relative group"
                                    title="The overall score based on all rubric criteria, represented as a percentage."
                                >
                                    Final Rubric Score (%)
                                    <span className="text-blue-400 cursor-help ml-1">🛈</span>
                                </th>
                            )}
                            <th className="px-4 py-2 border border-gray-600">Marks</th>
                            <th className="px-4 py-2 border border-gray-600 min-w-[200px]">Feedback</th>
                            <th className="px-4 py-2 border border-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {submissions.length > 0 ? (
                            submissions.map((submission, index) => (
                                <tr
                                    key={submission.studentId.id}
                                    className={`${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"} hover:bg-gray-600`}
                                >
                                    <td className="px-2 sm:px-4 py-2 border border-gray-600">
                                        <a
                                            href={`https://docs.google.com/gview?url=${submission.studentId.fileUrl}&embedded=true`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:underline"
                                        >
                                            {submission.firstName} {submission.lastName}
                                        </a>
                                    </td>
                                    <td className="border-b border-gray-600 px-4 py-2">
                                        {submission.rollNo}
                                    </td>
                                    <td className="border-b border-gray-600 px-4 py-2">
                                        {submission.status === 'late' ? 'Late' : 'On Time'}
                                    </td>
                                    {columns.CompletenessScore && (
                                        <td className="px-2 sm:px-4 py-2 border border-gray-600">
                                            {submission.CompletenessScore}
                                        </td>
                                    )}
                                    {columns.GrammarScore && (
                                        <td className="px-2 sm:px-4 py-2 border border-gray-600">
                                            {submission.GrammarScore}
                                        </td>
                                    )}
                                    {columns.OriginalityScore && (
                                        <td className="px-2 sm:px-4 py-2 border border-gray-600">
                                            {submission.OriginalityScore}
                                        </td>
                                    )}
                                    {columns.StructureScore && (
                                        <td className="px-2 sm:px-4 py-2 border border-gray-600">
                                            {submission.StructureScore}
                                        </td>
                                    )}
                                    {columns.FinalRubricScore && (
                                        <td className="px-2 sm:px-4 py-2 border border-gray-600">
                                            {submission.FinalRubricScore}%
                                        </td>
                                    )}
                                    <td className="border-b border-gray-600 px-4 py-2">
                                        <input
                                            type="number"
                                            value={
                                                editedSubmissions[submission.studentId.id]?.grade !== undefined
                                                    ? editedSubmissions[submission.studentId.id]?.grade
                                                    : (submission.grade !== undefined ? submission.grade : "")
                                            }
                                            onChange={(e) => handleInputChange(e, submission.studentId.id, "grade")}
                                            className="bg-gray-600 border border-gray-400 p-2 rounded-md focus:ring-2 focus:ring-blue-500 w-20"
                                        />

                                    </td>
                                    <td className="border-b border-gray-600 px-4 py-2">
                                        <input
                                            type="text"
                                            value={
                                                editedSubmissions[submission.studentId.id]?.feedback !== undefined
                                                    ? editedSubmissions[submission.studentId.id]?.feedback
                                                    : submission.feedback || ""
                                            }
                                            onChange={(e) => handleInputChange(e, submission.studentId.id, "feedback")}
                                            className="bg-gray-600 border border-gray-400 p-2 rounded-md focus:ring-2 focus:ring-blue-500 w-full"
                                        />

                                    </td>
                                    <td className="border-b border-gray-600 px-4 py-2 text-center">
                                        <button
                                            onClick={() => handleSave(submission.studentId.id)}
                                            disabled={
                                                !editedSubmissions[submission.studentId.id] ||
                                                editedSubmissions[submission.studentId.id]?.grade === ""
                                            }
                                            className={`py-1 px-4 rounded-lg ${!editedSubmissions[submission.studentId.id] ||
                                                editedSubmissions[submission.studentId.id]?.grade === ""
                                                ? "bg-gray-500 cursor-not-allowed"
                                                : "bg-blue-600 hover:bg-blue-500 text-white"
                                                }`}
                                            title={`${!editedSubmissions[submission.studentId.id] ||
                                                editedSubmissions[submission.studentId.id]?.grade === ""
                                                ? "Make a change to enable the Save button."
                                                : ""
                                                }`}
                                        >
                                            Save
                                        </button>


                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center text-gray-400 px-4 py-2">
                                    No submissions found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Feedback;
