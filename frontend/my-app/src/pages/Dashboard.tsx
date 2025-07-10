import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faBookOpen, faUserGraduate, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

interface DashboardProps {
  setIsLoggedIn: (value: boolean) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    navigate('/');
  };

  const goToStudent = () => navigate('/student');
  const goToCourse = () => navigate('/course');
  const goToEnrollment = () => navigate('/enrollment');

  return (
    <div className="dashboard-container">
      <nav>
        <div><strong>Welcome to the Dashboard!</strong></div>
        <button className="dashboard-button-logout" onClick={handleLogout}>
          <FontAwesomeIcon icon={faRightFromBracket} /> Logout
        </button>
      </nav>

      <div className='icons'>
        <button className="dashboard-buttons" onClick={goToStudent}>
          <FontAwesomeIcon icon={faUsers} /> Students
        </button>
        <button className="dashboard-buttons" onClick={goToCourse}>
          <FontAwesomeIcon icon={faBookOpen} /> Courses
        </button>
        <button className="dashboard-buttons" onClick={goToEnrollment}>
          <FontAwesomeIcon icon={faUserGraduate} /> Enrollments
        </button>
      </div>

      <h1>Student-Course-Enrollment-System</h1>

      <div className="dashboard-content">
        <div className="dashboard-image">
          <img src="https://www.shutterstock.com/image-vector/back-school-cartoon-vector-kids-600nw-2493305457.jpg" alt="Dashboard" />
        </div>
        <div className="dashboard-text">
          <h2>🎓 Welcome to the Student-Course Enrollment System Dashboard</h2>
          <p>
            Manage all aspects of student enrollment with ease and efficiency.
            This system allows administrators and faculty to handle student registrations,
            course scheduling, and performance tracking — all in one place.
          </p>

         
          <ul>
            <li> <h3>Key Features:</h3></li>
            <li>Enroll or Unenroll Students using Student Roll Number and Course Number.</li>
            <li>Track GPA for individual students based on academic performance.</li>
            <li>Mark and View Attendance per course per student.</li>
            <li>View enrolled students in each course.</li>
            <li>Search students by Roll Number and courses by Title or Number.</li>
            <li>Create, Edit, or Delete students and courses with validation.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;



// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../App.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faUsers } from '@fortawesome/free-solid-svg-icons';
// import { faBookOpen } from '@fortawesome/free-solid-svg-icons';
// import { faUserGraduate } from '@fortawesome/free-solid-svg-icons';
// import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
// interface DashboardProps {
//   setIsLoggedIn: (value: boolean) => void;
// }

// const Dashboard: React.FC<DashboardProps> = ({ setIsLoggedIn }) => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem('isLoggedIn');
//     setIsLoggedIn(false);
//     navigate('/');
//   };

//   const goToStudent = () => {
//     navigate('/student');
//   };

//   const goToCourse = () => {
//     navigate('/course');
//   };

//   const goToEnrollment = () => {
//     navigate('/enrollment');
//   };

//   return (
    
//     <div className="dashboard-container">
//       <nav> <strong>Welcome to the Dashboard!</strong>
//         <button className="dashboard-button-logout" onClick={handleLogout}><FontAwesomeIcon icon={faRightFromBracket} /></button>
//          </nav>
//       {/* <h1>Welcome to the Dashboard!</h1> */}
//       {/* <button className="dashboard-button-logout" onClick={handleLogout}>Logout</button> */}
//       <div className='icons'>
//       <button className="dashboard-buttons" onClick={goToStudent}><FontAwesomeIcon icon={faUsers} />    Students</button>
//       <button className="dashboard-buttons" onClick={goToCourse}><FontAwesomeIcon icon={faBookOpen} />    Courses</button>
//       <button className="dashboard-buttons" onClick={goToEnrollment}><FontAwesomeIcon icon={faUserGraduate} />    Enrollments</button>
//       </div>
//       <div>
//         <h1>Student-Course-Enrollment-System</h1>
//         <div className="dashboard-content">
//   <div className="dashboard-image">
//     <img src="https://www.shutterstock.com/image-vector/back-school-cartoon-vector-kids-600nw-2493305457.jpg" alt="Dashboard" />
//   </div>
//   <div className="dashboard-text">
//     <h2>🎓 Welcome to the Student-Course Enrollment System Dashboard</h2>
//     <p>Manage all aspects of student enrollment with ease and efficiency. This system allows administrators and faculty to handle student registrations, course scheduling, and performance tracking — all in one place.</p>
    
//     <h3>Key Features:</h3>
//     <ul>
//       <li>📚 Enroll or Unenroll Students using Student Roll Number and Course Number.</li>
//       <li>🧠 Track GPA for individual students based on academic performance.</li>
//       <li>✅ Mark and View Attendance per course per student.</li>
//       <li>👥 View enrolled students in each course.</li>
//       <li>🔍 Search students by Roll Number and courses by Title or Number.</li>
//       <li>✏️ Create, Edit, or Delete students and courses with validation.</li>
//     </ul>
//   </div>
// </div>
// </div></div>
//   );

// };

// export default Dashboard;
