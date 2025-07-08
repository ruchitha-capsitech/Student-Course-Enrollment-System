import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../enrollment.css';

const Enrollment: React.FC = () => {
  const navigate = useNavigate();

  const [studentRollNo, setStudentRollNo] = useState('');
  const [courseNo, setCourseNo] = useState('');
  const [grade, setGrade] = useState('');
  const [attendanceDate, setAttendanceDate] = useState('');
  const [gpa, setGpa] = useState<string | null>(null);
  const [attendanceList, setAttendanceList] = useState<string[]>([]);
  const [studentsInCourse, setStudentsInCourse] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [gpaRequested, setGpaRequested] = useState(false);
//url used to fetch courseno and student roll number
  const apiUrl = 'https://localhost:7172/api/enrollment';
//validation 
  const validateRollNos = () => {
    if (!studentRollNo.trim() || !courseNo.trim()) {
      setError('Student Roll No and Course No are required');
      return false;
    }
    if (isNaN(Number(studentRollNo)) || isNaN(Number(courseNo))) {
      setError('Student Roll No and Course No must be valid numbers');
      return false;
    }
    setError('');
    return true;
  };
//method to handle enrollment
  const handleEnroll = async () => {
    if (!validateRollNos()) return;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentRollNo: parseInt(studentRollNo),
        courseNo: parseInt(courseNo),
        grade: grade || null,
        attendance: [],
        enrolledDate: new Date().toISOString(),
      }),
    });

    const result = await response.text();
    alert(result);
  };
//method to handle un enrolling
  const handleUnenroll = async (studentRollNo: string, courseNo: string) => {
    const response = await fetch(
      `${apiUrl}/unenroll?studentRollNo=${studentRollNo}&courseNo=${courseNo}`,
      { method: 'DELETE' }
    );

    const result = await response.text();
    alert(result);
    handleViewAllEnrollments();
  };
//method to handle gpa
  const handleViewGpa = async () => {
    setGpaRequested(true);

    if (!studentRollNo.trim()) {
      setError('Student Roll No is required');
      setGpa(null);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/gpa/${studentRollNo}`);
      if (response.ok) {
        const data = await response.json();
        setGpa(data.gpa ?? data.GPA);
      } else {
        const message = await response.text();
        alert(message);
        setGpa(null);
      }
    } catch (error) {
      console.error('Error fetching GPA:', error);
      setGpa(null);
    }
  };
//method to mark attendance
  const handleMarkAttendance = async () => {
    if (!validateRollNos() || !attendanceDate) {
      setError('Please provide Student Roll No, Course No, and Date');
      return;
    }
    setError('');

    const dateFormatted = new Date(attendanceDate).toISOString();

    const response = await fetch(
      `${apiUrl}/attendance?studentRollNo=${studentRollNo}&courseNo=${courseNo}&date=${dateFormatted}`,
      { method: 'POST' }
    );

    const result = await response.text();
    alert(result);
  };
//method to view attendance
  const handleViewAttendance = async () => {
    if (!validateRollNos()) return;

    const response = await fetch(
      `${apiUrl}/attendance?studentRollNo=${studentRollNo}&courseNo=${courseNo}`
    );
    const data = await response.json();
    setAttendanceList(data);
  };
//method to get students enrolled in a course
  const handleGetStudentsInCourse = async () => {
    if (!courseNo.trim()) {
      setError('Course No is required');
      return;
    }
    setError('');

    const response = await fetch(`${apiUrl}/students/${courseNo}`);
    const data = await response.json();
    setStudentsInCourse(data);
  };
//method to view allk enrollments in a table
  const handleViewAllEnrollments = async () => {
    try {
      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        setEnrollments(data);
      } else {
        const message = await response.text();
        alert('Failed to fetch enrollments: ' + message);
      }
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      alert('An error occurred while fetching enrollments.');
    }
  };

  return (
    <div className="enrollment-container">
      <div className="enrollment-form-section">
       <h1 className="section-title">Enrollment Page</h1>
         <button className="dashboard-btn" onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </button>
        <h2>Enroll Student</h2>
        <div className="enrollment-form-group">
          <label htmlFor="studentRollNo">Student Roll No:</label>
          <input
            id="studentRollNo"
            placeholder="Enter Student Roll No"
            value={studentRollNo}
            onChange={(e) => setStudentRollNo(e.target.value)}
          />
          <label htmlFor="courseNo">Course No:</label>
          <input
            id="courseNo"
            placeholder="Enter Course No"
            value={courseNo}
            onChange={(e) => setCourseNo(e.target.value)}
          />
          <label htmlFor="grade">Grade (Optional):</label>
          <input
            id="grade"
            placeholder="Enter Grade"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          />
          {error && <p className="error-text">{error}</p>}
          <button onClick={handleEnroll}>Enroll Student</button>
        </div>
      </div>

      <div className="enrollment-form-section">
        <h2>GPA</h2>
        <button className="gpabutton" onClick={handleViewGpa}>View GPA</button>
        {gpaRequested &&
          (gpa !== null ? (
            <p className="gpa-text"><strong>GPA:</strong> {gpa}</p>
          ) : (
            <p className="error-text">No GPA available</p>
          ))}
      </div>

      <div className="enrollment-form-section">
        <h2>Attendance</h2>
        <div className="enrollment-form-group">
          <label htmlFor="attendanceDate">Select Date:</label>
          <input
            type="date"
            id="attendanceDate"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
          />
          <button onClick={handleMarkAttendance}>Mark Attendance</button>
          <button onClick={handleViewAttendance}>View Attendance</button>
        </div>
        <ul className="enrollment-attendance-list">
          {attendanceList.map((date, index) => (
            <li key={index}>{new Date(date).toDateString()}</li>
          ))}
        </ul>
      </div>

      <div className="enrollment-form-section">
        <h2>Students in Course</h2>
        <button className="gpabutton" onClick={handleGetStudentsInCourse}>Get Students in Course</button>
        <ul className="enrollment-student-list">
          {studentsInCourse.map((student, index) => (
            <li key={index}>
              {student.name || student.fullName || 'Unnamed Student'}
            </li>
          ))}
        </ul>
      </div>

      <div className="enrollment-form-section">
        <h2>All Enrollments</h2>
        <button className="gpabutton" onClick={handleViewAllEnrollments}>View All Enrollments</button>
        {enrollments.length > 0 ? (
          <table className="enrollment-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Student Roll No</th>
                <th>Course No</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((enrollment, index) => (
                <tr key={index}>
                  <td><strong>{index + 1}</strong></td>
                  <td><strong>{enrollment.studentRollNo}</strong></td>
                  <td><strong>{enrollment.courseNo}</strong></td>
                  <td>
                    <button
                      onClick={() =>
                        handleUnenroll(enrollment.studentRollNo, enrollment.courseNo)
                      }
                    >
                      Unenroll
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No enrollments found.</p>
        )}
      </div>
    </div>
  );
};

export default Enrollment;