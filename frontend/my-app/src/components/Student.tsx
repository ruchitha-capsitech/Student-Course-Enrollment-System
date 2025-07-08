import '../App.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Student {
  id: string;
  studentRollNo:string;
  name: string;
  email: string;
  enrollmentNo: string;
  phoneNo: string;
  dob: string;
  year: string;
  department: string;
}
const departmentOptions = ['CSE', 'ECE', 'EEE', 'MEC', 'CIVIL'];
// eslint-disable-next-line @typescript-eslint/no-redeclare
const Student: React.FC = () => {
  const navigate = useNavigate();
  //  ADDED - State for Roll No Search
  const [searchRollNo, setSearchRollNo] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Student>>({});
  const [newStudent, setNewStudent] = useState<Omit<Student, 'id'>>({
     studentRollNo: '', 
    name: '',
    email: '',
    enrollmentNo: '',
    phoneNo: '',
    dob: '',
    year: '',
    department: '',

  });
  //validation
  const [createErrors, setCreateErrors] = useState<Partial<Record<keyof Student, string>>>({});
    const [editErrors, setEditErrors] = useState<Partial<Record<keyof Student, string>>>({});
  
    const validateStudent = (student: Partial<Student | Omit<Student, 'id'>>) => {
      const newErrors: Partial<Record<keyof Student, string>> = {};
  
    if (!student.name) newErrors.name = 'Name is required';
    if (!student.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.email))
      newErrors.email = 'Valid email is required';
    if (!student.enrollmentNo) newErrors.enrollmentNo = 'Enrollment No is required';
    if (!student.phoneNo || !/^\d{10}$/.test(student.phoneNo))
      newErrors.phoneNo = 'Phone No must be 10 digits';
    if (!student.dob || new Date(student.dob) > new Date())
      newErrors.dob = 'Valid DOB is required';
    if (!student.year || isNaN(Number(student.year)) || Number(student.year) < 1 || Number(student.year) > 4)
      newErrors.year = 'Year must be between 1 and 4';
    if (!student.department) newErrors.department = 'Department is required';
      return newErrors;
    };

  
//method for fetching students 
  const fetchStudents = async () => {
    try {
      const response = await fetch('https://localhost:7172/api/students');
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    }
  };
  //method to add students
const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateStudent(newStudent);
    if (Object.keys(validationErrors).length > 0) {
      setCreateErrors(validationErrors);
      return;
    }
    try {
      const response = await fetch('https://localhost:7172/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent),
      });

      if (response.ok) {
        await fetchStudents();
        setNewStudent({
           studentRollNo: '', 
          name: '',
          email: '',
          enrollmentNo: '',
          phoneNo: '',
          dob: '',
          year: '',
          department: '',
        });
       setCreateErrors({});
      }
    } catch (error) {
      console.error('Error creating student:', error);
    }
  };
  //method to update student
 const handleUpdateStudent = async () => {
    const validationErrors = validateStudent(formData);
    if (Object.keys(validationErrors).length > 0) {
      setEditErrors(validationErrors);
      return;
    }
  

    try {
      const response = await fetch(`https://localhost:7172/api/students/${formData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setEditingStudentId(null);
        setFormData({});
        setEditErrors({});
        await fetchStudents();
      }
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };
//method to delete student
  const handleDeleteStudent = async (id: string) => {
    try {
      const response = await fetch(`https://localhost:7172/api/students/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchStudents();
      }
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };
//method to handle edit button
  const handleEditClick = (student: Student) => {
    setEditingStudentId(student.id);
    setFormData({ ...student });
    setEditErrors({});
  };
//method to go to dashboard
  const goToDashboard = () => {
    navigate('/dashboard');
  };

  useEffect(() => {
    fetchStudents();
  }, []);
// 🔥 Filter students by Roll No
 const filteredStudents = students.filter((student) =>
  student.studentRollNo.toString().toLowerCase().includes(searchRollNo.toLowerCase())
);

const studentSearchMessage =
  searchRollNo.trim() === ''
    ? ''
    : filteredStudents.length > 0
    ? 'Student Found'
    : 'Student Not Found';


  return (
    <div className="student-container">
      <h1>Student Management</h1>
      <button onClick={goToDashboard}>Back to Dashboard</button>
 <div className="student-layout">
      <div className="left-panel">

      <h2>Create New Student</h2>
      <form onSubmit={handleCreateStudent}>
        <div className="student-form">
         <div>
           <label><strong> Name:-</strong> </label>
          <input placeholder="Name" value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} />
          {createErrors.name && <span className="error">{createErrors.name}</span>}
         </div>
 <div>
   <strong>    <label> Email:-</label></strong> 
          <input placeholder="Email" value={newStudent.email} onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })} />
          {createErrors.email && <span className="error">{createErrors.email}</span>}
</div>
  <strong> <label> Enrollment No:-</label></strong> 
          <input placeholder="Enrollment No" value={newStudent.enrollmentNo} onChange={(e) => setNewStudent({ ...newStudent, enrollmentNo: e.target.value })} />
          {createErrors.enrollmentNo && <span className="error">{createErrors.enrollmentNo}</span>}
<div>
    <strong> <label> Phone No:-</label></strong> 
          <input placeholder="Phone No" value={newStudent.phoneNo} onChange={(e) => setNewStudent({ ...newStudent, phoneNo: e.target.value })} />
          {createErrors.phoneNo && <span className="error">{createErrors.phoneNo}</span>}
</div>
     <strong>  <label> Date of birth:-</label></strong> 
          <input type="date" value={newStudent.dob} onChange={(e) => setNewStudent({ ...newStudent, dob: e.target.value })} />
          {createErrors.dob && <span className="error">{createErrors.dob}</span>}
<div>
       <strong>  <label> Year:-</label></strong> 
          <input type="number" placeholder="Year" value={newStudent.year} onChange={(e) => setNewStudent({ ...newStudent, year: e.target.value })} />
          {createErrors.year && <span className="error">{createErrors.year}</span>}
</div>
         <div>
            <strong> <label> Department:-</label></strong> 
  <select value={newStudent.department} onChange={(e) => setNewStudent({ ...newStudent, department: e.target.value })}>
    <option value="">Select Department</option>
    {departmentOptions.map((dept) => (
      <option key={dept} value={dept}>{dept}</option>
    ))}
  </select>
  {createErrors.department && <span className="error">{createErrors.department}</span>}
</div>
<div>
          <button type="submit">Add Student</button>
        </div>
        </div>
      </form>
</div> 
</div>
<h2>All Students</h2>
 <div className="right-panel">

      {/*  Search Filter Input */}
        <div className="search-student-box">
          <input
            type="text"
            placeholder="Search by Roll Number"
            value={searchRollNo}
            onChange={(e) => setSearchRollNo(e.target.value)}
            
          />
        </div>
        {/* {searchRollNo && <h3>{studentSearchMessage}</h3>} */}
<ul className="student-list">
   {searchRollNo && <h3>{studentSearchMessage}</h3>}
  {(searchRollNo ? filteredStudents : students).map((student) => (
    <li key={student.id} className="student-item">
      {editingStudentId === student.id ? (
        <div>
          <div>
             
            <strong><label>Name:-</label></strong>
            <input
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {editErrors.name && <span className="error">{editErrors.name}</span>}
          </div>
          <strong><label>Email:-</label></strong>
          <input
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          {editErrors.email && <span className="error">{editErrors.email}</span>}
          <div>
            <strong><label>Enrollment No:-</label></strong>
            <input
              value={formData.enrollmentNo || ''}
              onChange={(e) => setFormData({ ...formData, enrollmentNo: e.target.value })}
            />
            {editErrors.enrollmentNo && <span className="error">{editErrors.enrollmentNo}</span>}
          </div>
          <strong><label>Phone No:-</label></strong>
          <input
            value={formData.phoneNo || ''}
            onChange={(e) => setFormData({ ...formData, phoneNo: e.target.value })}
          />
          {editErrors.phoneNo && <span className="error">{editErrors.phoneNo}</span>}
          <div>
            <strong><label>Date of birth:-</label></strong>
            <input
              type="date"
              value={formData.dob || ''}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
            />
            {editErrors.dob && <span className="error">{editErrors.dob}</span>}
          </div>
          <strong><label>Year:-</label></strong>
          <input
            type="number"
            value={formData.year || ''}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          />
          {editErrors.year && <span className="error">{editErrors.year}</span>}
          <div>
            <strong><label>Department:-</label></strong>
            <select
              value={formData.department || ''}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            >
              <option value="">Select Department</option>
              {departmentOptions.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            {editErrors.department && <span className="error">{editErrors.department}</span>}
          </div>
          <button onClick={handleUpdateStudent}>Save</button>
          <button onClick={() => setEditingStudentId(null)}>Cancel</button>
        </div>
      ) : (
        <div className="student-details">
          <p><strong>Student Roll Number:</strong> {student.studentRollNo}</p>
          <p><strong>Name:</strong> {student.name}</p>
          <p><strong>Email:</strong> {student.email}</p>
          <p><strong>Enrollment No:</strong> {student.enrollmentNo}</p>
          <p><strong>Phone No:</strong> {student.phoneNo}</p>
          <p><strong>Date of Birth:</strong> {student.dob.split('T')[0]}</p>
          <p><strong>Year:</strong> {student.year}</p>
          <p><strong>Department:</strong> {student.department}</p>
          <button onClick={() => handleEditClick(student)}>Edit</button>
          <button className="deletebutton" onClick={() => handleDeleteStudent(student.id)}>Delete</button>
        </div>
      )}
    </li>
  ))}
</ul>
      </div>
      </div>
);
 
};

export default Student;
