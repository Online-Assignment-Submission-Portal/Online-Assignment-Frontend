import React, { useState } from "react";

const Rubrics = ({ rubricResults }) => {
    // State to manage column visibility
    const [columns, setColumns] = useState({
        CompletenessScore: true,
        GrammarScore: true,
        OriginalityScore: true,
        StructureScore: true,
        FinalRubricScore: true,
    });

    // console.log(rubricResults);

    // Toggle column visibility
    const handleFieldToggle = (column) => {
        setColumns((prevColumns) => ({
            ...prevColumns,
            [column]: !prevColumns[column],
        }));
    };

    return (
        <div className="overflow-x-auto mt-8 bg-gray-800 rounded-lg shadow-lg">
            {/* Header with Column Toggle Checkboxes */}
            <div className="overflow-x-auto">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-200">Rubrics Score</h2>
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

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse border border-gray-700">
                    <thead>
                        <tr className="bg-gray-700 text-gray-200">
                            <th className="px-2 sm:px-4 py-2 border border-gray-600">Name
                            </th>
                            <th className="px-2 sm:px-4 py-2 border border-gray-600">Roll No
                            </th>

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
                        </tr>
                    </thead>

                    <tbody>
                        {rubricResults.length > 0 ? (
                            rubricResults.map((entry, index) => (
                                <tr
                                    key={index}
                                    className={`${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"} hover:bg-gray-600`}
                                >
                                    <td className="px-2 sm:px-4 py-2 border border-gray-600">
                                        <a
                                            href={`https://docs.google.com/gview?url=${entry.studentId.fileUrl}&embedded=true`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:underline"
                                        >
                                            {entry.studentId.name}
                                        </a>
                                    </td>
                                    <td className="px-2 sm:px-4 py-2 border border-gray-600">
                                        {entry.studentId.rollNo}
                                    </td>
                                    {columns.CompletenessScore && (
                                        <td className="px-2 sm:px-4 py-2 border border-gray-600">
                                            {entry.CompletenessScore}
                                        </td>
                                    )}
                                    {columns.GrammarScore && (
                                        <td className="px-2 sm:px-4 py-2 border border-gray-600">
                                            {entry.GrammarScore}
                                        </td>
                                    )}
                                    {columns.OriginalityScore && (
                                        <td className="px-2 sm:px-4 py-2 border border-gray-600">
                                            {entry.OriginalityScore}
                                        </td>
                                    )}
                                    {columns.StructureScore && (
                                        <td className="px-2 sm:px-4 py-2 border border-gray-600">
                                            {entry.StructureScore}
                                        </td>
                                    )}
                                    {columns.FinalRubricScore && (
                                        <td className="px-2 sm:px-4 py-2 border border-gray-600">
                                            {entry.FinalRubricScore}%
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center text-gray-400 px-4 py-2">
                                    No rubric data available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Rubrics;
