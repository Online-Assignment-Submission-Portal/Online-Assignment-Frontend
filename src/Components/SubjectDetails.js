import { useLocation, useNavigate } from 'react-router-dom';

function SubjectDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const subject = location.state?.subject;
  const userID = location.state?.userID;

  if (!subject) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
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
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{subject.name}</h1>
        <p className="text-gray-600 mb-2">Subject ID: {subject.subjectId}</p>
        <p className="text-gray-600 mb-2">Number of Students: {subject.numberOfStudents}</p>

        <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-2">Assignments</h2>
        {subject.assignments.length > 0 ? (
          <ul className="list-disc list-inside text-gray-600">
            {subject.assignments.map((assignment) => (
              <li key={assignment.id}>
                <strong>{assignment.title}</strong> - Due: {assignment.dueDate}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No assignments available.</p>
        )}

        <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-2">Students</h2>
        {subject.students.length > 0 ? (
          <ul className="list-disc list-inside text-gray-600">
            {subject.students.map((student) => (
              <li key={student.id}>{student.name}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No students enrolled.</p>
        )}

        <button
          onClick={() => navigate('/')}
          className="mt-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default SubjectDetails;
