import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';
import { faUserGraduate } from '@fortawesome/free-solid-svg-icons';
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

  const goToStudent = () => {
    navigate('/student');
  };

  const goToCourse = () => {
    navigate('/course');
  };

  const goToEnrollment = () => {
    navigate('/enrollment');
  };

  return (
    
    <div className="dashboard-container">
      <h1>Welcome to the Dashboard!</h1>
      <button className="dashboard-button-logout" onClick={handleLogout}>Logout</button>
      <button className="dashboard-buttons" onClick={goToStudent}><FontAwesomeIcon icon={faUsers} />    Students</button>
      <button className="dashboard-buttons" onClick={goToCourse}><FontAwesomeIcon icon={faBookOpen} />    Courses</button>
      <button className="dashboard-buttons" onClick={goToEnrollment}><FontAwesomeIcon icon={faUserGraduate} />    Enrollments</button>
    </div>
  );
};

export default Dashboard;