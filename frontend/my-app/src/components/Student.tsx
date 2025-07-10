import React, { useState, useEffect } from 'react';
import {
  Panel, PanelType, PrimaryButton, TextField, DetailsList, IColumn,
  IconButton, Stack, Dropdown, IDropdownOption, DatePicker, DayOfWeek
} from '@fluentui/react-components';
import axios from 'axios';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { useNavigate } from 'react-router-dom';

initializeIcons();//

export const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://localhost:7172/api';

interface Student {
  id?: string;
  studentRollNo?: number;
  name: string;
  email: string;
  enrollmentNo: string;
  phoneNo: string;
  dob: string;
  year: string;
  department: string;
}

const departmentOptions: IDropdownOption[] = [
  { key: 'cse', text: 'CSE' },
  { key: 'ece', text: 'ECE' },
  { key: 'eee', text: 'EEE' },
  { key: 'msc', text: 'MSC' },
  { key: 'civil', text: 'CIVIL' },
];

// eslint-disable-next-line @typescript-eslint/no-redeclare
const Student: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
const navigate = useNavigate();

  const [formData, setFormData] = useState<Student>({
    id: '',
    name: '',
    email: '',
    enrollmentNo: '',
    phoneNo: '',
    dob: '',
    year: '',
    department: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/students`);
      setStudents(res.data);
    } catch (error) {
      console.error("Failed to fetch students", error);
    }
  };

  const openAddPanel = () => {
    setIsEditMode(false);
    setFormData({
      id: '',
      name: '',
      email: '',
      enrollmentNo: '',
      phoneNo: '',
      dob: '',
      year: '',
      department: ''
    });
    setFormErrors({});
    setIsPanelOpen(true);
  };

  const openEditPanel = (student: Student) => {
    setIsEditMode(true);
    setSelectedStudent(student);
    setFormData({
      id: student.id || '',
      name: student.name,
      email: student.email,
      enrollmentNo: student.enrollmentNo,
      phoneNo: student.phoneNo,
      dob: student.dob,
      year: String(student.year),
      department: student.department
    });
    setFormErrors({});
    setIsPanelOpen(true);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
    setSelectedStudent(null);
    setFormErrors({});
  };

  const handleChange = (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ) => {
    const name = (e.target as HTMLInputElement).name;
    setFormData(prev => ({ ...prev, [name]: newValue || '' }));
  };

  const handleDateChange = (date: Date | null | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, dob: date.toISOString().split('T')[0] }));
    }
  };

  const handleDropdownChange = (
    _: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption
  ) => {
    if (option) {
      setFormData(prev => ({ ...prev, department: option.key.toString() }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Name is required.";
    if (!formData.email.trim()) errors.email = "Email is required.";
    if (!formData.enrollmentNo.trim()) errors.enrollmentNo = "Enrollment No is required.";
    if (!formData.phoneNo.trim()) errors.phoneNo = "Phone No is required.";
    if (!formData.dob) errors.dob = "Date of birth is required.";
    if (!String(formData.year).trim()) errors.year = "Year is required.";
    if (!formData.department) errors.department = "Department is required.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      if (isEditMode && selectedStudent) {
        await axios.put(`${BASE_URL}/students/${selectedStudent.id}`, formData);
      } else {
        await axios.post(`${BASE_URL}/students`, formData);
      }
      fetchStudents();
      closePanel();
    } catch (error) {
      console.error("Error saving student", error);
    }
  };

  const deleteStudent = async (id?: string) => {
    if (!id) return;
    try {
      await axios.delete(`${BASE_URL}/students/${id}`);
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student", error);
    }
  };

  const columns: IColumn[] = [
    { key: 'rollNo', name: 'Roll No', fieldName: 'studentRollNo', minWidth: 70, isResizable: true },
    { key: 'name', name: 'Name', fieldName: 'name', minWidth: 100, isResizable: true },
    { key: 'email', name: 'Email', fieldName: 'email', minWidth: 150, isResizable: true },
    { key: 'enrollmentNo', name: 'Enrollment No', fieldName: 'enrollmentNo', minWidth: 100, isResizable: true },
    { key: 'phoneNo', name: 'Phone No', fieldName: 'phoneNo', minWidth: 100, isResizable: true },
    { key: 'dob', name: 'DOB', fieldName: 'dob', minWidth: 100, isResizable: true },
    { key: 'year', name: 'Year', fieldName: 'year', minWidth: 50, isResizable: true },
    { key: 'department', name: 'Department', fieldName: 'department', minWidth: 100, isResizable: true },
    {
      key: 'actions',
      name: 'Actions',
      minWidth: 100,
      onRender: (item: Student) => (
        <Stack horizontal tokens={{ childrenGap: 8 }}>
          <IconButton iconProps={{ iconName: 'Edit' }} title="Edit" onClick={() => openEditPanel(item)} />
          <IconButton iconProps={{ iconName: 'Delete' }} title="Delete" onClick={() => deleteStudent(item.id)} />
        </Stack>
      )
    }
  ];

  return (
    
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
  <PrimaryButton text="Go to Dashboard" onClick={() => navigate('/dashboard')} />
  <PrimaryButton text="Add Student" onClick={openAddPanel} />
</div>

      <h1 style={{ textAlign: 'center', marginBottom: 20 }}>Student Management</h1>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        {/* <PrimaryButton text="Add Student" onClick={openAddPanel} /> */}
      </div>

      <DetailsList
        items={students}
        columns={columns}
        selectionMode={0}
        styles={{ root: { overflowX: 'auto' } }}
      />

      <Panel
        isOpen={isPanelOpen}
        onDismiss={closePanel}
        type={PanelType.medium}
        headerText={isEditMode ? 'Edit Student' : 'Add Student'}
        closeButtonAriaLabel="Close"
      >
        <TextField
          label="Name" name="name" value={formData.name}
          onChange={handleChange} required errorMessage={formErrors.name}
        />
        <TextField
          label="Email" name="email" value={formData.email}
          onChange={handleChange} required errorMessage={formErrors.email}
        />
        <TextField
          label="Enrollment No" name="enrollmentNo" value={formData.enrollmentNo}
          onChange={handleChange} required errorMessage={formErrors.enrollmentNo}
        />
        <TextField
          label="Phone No" name="phoneNo" value={formData.phoneNo}
          onChange={handleChange} required errorMessage={formErrors.phoneNo}
        />
        <DatePicker
          label="Date of Birth"
          value={formData.dob ? new Date(formData.dob) : undefined}
          onSelectDate={handleDateChange}
          firstDayOfWeek={DayOfWeek.Sunday}
          placeholder="Select a date..."
          ariaLabel="Select a date"
        />
        {formErrors.dob && <div style={{ color: 'red', marginBottom: 8 }}>{formErrors.dob}</div>}
        <TextField
          label="Year" name="year" value={formData.year}
          onChange={handleChange} required errorMessage={formErrors.year}
        />
        <Dropdown
          label="Department"
          options={departmentOptions}
          selectedKey={formData.department}
          onChange={handleDropdownChange}
          required
          errorMessage={formErrors.department}
        />

        <PrimaryButton
          text={isEditMode ? 'Update Student' : 'Create Student'}
          onClick={handleSubmit}
          style={{ marginTop: 20 }}
        />
      </Panel>
    </div>
  );
};

export default Student;










// import '../App.css';
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { BASE_URL } from '../api'; 

// interface Student {
//   id: string;
//   studentRollNo: string;
//   name: string;
//   email: string;
//   enrollmentNo: string;
//   phoneNo: string;
//   dob: string;
//   year: string;
//   department: string;
// }

// const departmentOptions = ['CSE', 'ECE', 'EEE', 'MEC', 'CIVIL'];

// const Student: React.FC = () => {
//   const navigate = useNavigate();

//   const [searchRollNo, setSearchRollNo] = useState<string>('');
//   const [students, setStudents] = useState<Student[]>([]);
//   const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
//   const [formData, setFormData] = useState<Partial<Student>>({});
//   const [newStudent, setNewStudent] = useState<Omit<Student, 'id'>>({
//     studentRollNo: '',
//     name: '',
//     email: '',
//     enrollmentNo: '',
//     phoneNo: '',
//     dob: '',
//     year: '',
//     department: '',
//   });

//   const [createErrors, setCreateErrors] = useState<Partial<Record<keyof Student, string>>>({});
//   const [editErrors, setEditErrors] = useState<Partial<Record<keyof Student, string>>>({});

//   const validateStudent = (student: Partial<Student | Omit<Student, 'id'>>) => {
//     const newErrors: Partial<Record<keyof Student, string>> = {};

//     if (!student.name) newErrors.name = 'Name is required';
//     if (!student.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.email))
//       newErrors.email = 'Valid email is required';
//     if (!student.enrollmentNo) newErrors.enrollmentNo = 'Enrollment No is required';
//     if (!student.phoneNo || !/^\d{10}$/.test(student.phoneNo))
//       newErrors.phoneNo = 'Phone No must be 10 digits';
//     if (!student.dob || new Date(student.dob) > new Date())
//       newErrors.dob = 'Valid DOB is required';
//     if (!student.year || isNaN(Number(student.year)) || Number(student.year) < 1 || Number(student.year) > 4)
//       newErrors.year = 'Year must be between 1 and 4';
//     if (!student.department) newErrors.department = 'Department is required';

//     return newErrors;
//   };

//   const fetchStudents = async () => {
//     try {
//       const response = await fetch(`${BASE_URL}/api/students`);
//       const data = await response.json();
//       setStudents(data);
//     } catch (error) {
//       console.error('Failed to fetch students:', error);
//     }
//   };

//   const handleCreateStudent = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const validationErrors = validateStudent(newStudent);
//     if (Object.keys(validationErrors).length > 0) {
//       setCreateErrors(validationErrors);
//       return;
//     }

//     try {
//       const response = await fetch(`${BASE_URL}/api/students`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(newStudent),
//       });

//       if (response.ok) {
//         await fetchStudents();
//         setNewStudent({
//           studentRollNo: '',
//           name: '',
//           email: '',
//           enrollmentNo: '',
//           phoneNo: '',
//           dob: '',
//           year: '',
//           department: '',
//         });
//         setCreateErrors({});
//       }
//     } catch (error) {
//       console.error('Error creating student:', error);
//     }
//   };

//   const handleUpdateStudent = async () => {
//     const validationErrors = validateStudent(formData);
//     if (Object.keys(validationErrors).length > 0) {
//       setEditErrors(validationErrors);
//       return;
//     }

//     try {
//       const response = await fetch(`${BASE_URL}/api/students/${formData.id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });

//       if (response.ok) {
//         setEditingStudentId(null);
//         setFormData({});
//         setEditErrors({});
//         await fetchStudents();
//       }
//     } catch (error) {
//       console.error('Error updating student:', error);
//     }
//   };

//   const handleDeleteStudent = async (id: string) => {
//     try {
//       const response = await fetch(`${BASE_URL}/api/students/${id}`, {
//         method: 'DELETE',
//       });

//       if (response.ok) {
//         await fetchStudents();
//       }
//     } catch (error) {
//       console.error('Error deleting student:', error);
//     }
//   };

//   const handleEditClick = (student: Student) => {
//     setEditingStudentId(student.id);
//     setFormData({ ...student });
//     setEditErrors({});
//   };

//   const goToDashboard = () => {
//     navigate('/dashboard');
//   };

//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   const filteredStudents = students.filter((student) =>
//     student.studentRollNo.toString().toLowerCase().includes(searchRollNo.toLowerCase())
//   );

//   const studentSearchMessage =
//     searchRollNo.trim() === ''
//       ? ''
//       : filteredStudents.length > 0
//       ? 'Student Found'
//       : 'Student Not Found';

//   return (
//     <div className="student-container">
//       <h1>Student Management</h1>
//       <button onClick={goToDashboard}>Back to Dashboard</button>

//       <div className="student-layout">
//         <div className="left-panel">
//           <h2>Create New Student</h2>
//           <form onSubmit={handleCreateStudent}>
//             <div className="student-form">
//               <div>
//                 <label><strong>Name:</strong></label>
//                 <input placeholder="Name" value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} />
//                 {createErrors.name && <span className="error">{createErrors.name}</span>}
//               </div>
//               <div>
//                 <label><strong>Email:</strong></label>
//                 <input placeholder="Email" value={newStudent.email} onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })} />
//                 {createErrors.email && <span className="error">{createErrors.email}</span>}
//               </div>
//               <div>
//                 <label><strong>Enrollment No:</strong></label>
//                 <input placeholder="Enrollment No" value={newStudent.enrollmentNo} onChange={(e) => setNewStudent({ ...newStudent, enrollmentNo: e.target.value })} />
//                 {createErrors.enrollmentNo && <span className="error">{createErrors.enrollmentNo}</span>}
//               </div>
//               <div>
//                 <label><strong>Phone No:</strong></label>
//                 <input placeholder="Phone No" value={newStudent.phoneNo} onChange={(e) => setNewStudent({ ...newStudent, phoneNo: e.target.value })} />
//                 {createErrors.phoneNo && <span className="error">{createErrors.phoneNo}</span>}
//               </div>
//               <div>
//                 <label><strong>Date of Birth:</strong></label>
//                 <input type="date" value={newStudent.dob} onChange={(e) => setNewStudent({ ...newStudent, dob: e.target.value })} />
//                 {createErrors.dob && <span className="error">{createErrors.dob}</span>}
//               </div>
//               <div>
//                 <label><strong>Year:</strong></label>
//                 <input type="number" placeholder="Year" value={newStudent.year} onChange={(e) => setNewStudent({ ...newStudent, year: e.target.value })} />
//                 {createErrors.year && <span className="error">{createErrors.year}</span>}
//               </div>
//               <div>
//                 <label><strong>Department:</strong></label>
//                 <select value={newStudent.department} onChange={(e) => setNewStudent({ ...newStudent, department: e.target.value })}>
//                   <option value="">Select Department</option>
//                   {departmentOptions.map((dept) => (
//                     <option key={dept} value={dept}>{dept}</option>
//                   ))}
//                 </select>
//                 {createErrors.department && <span className="error">{createErrors.department}</span>}
//               </div>
//               <div>
//                 <button type="submit">Add Student</button>
//               </div>
//             </div>
//           </form>
//         </div>

//         <div className="right-panel">
//           <h2>All Students</h2>
//           <div className="search-student-box">
//             <input
//               type="text"
//               placeholder="Search by Roll Number"
//               value={searchRollNo}
//               onChange={(e) => setSearchRollNo(e.target.value)}
//             />
//           </div>
//           {searchRollNo && <h3>{studentSearchMessage}</h3>}
//           <ul className="student-list">
//             {(searchRollNo ? filteredStudents : students).map((student) => (
//               <li key={student.id} className="student-item">
//                 {editingStudentId === student.id ? (
//                   <div>
//                     <div>
//                       <label><strong>Name:</strong></label>
//                       <input value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
//                       {editErrors.name && <span className="error">{editErrors.name}</span>}
//                     </div>
//                     <label><strong>Email:</strong></label>
//                     <input value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
//                     {editErrors.email && <span className="error">{editErrors.email}</span>}
//                     <div>
//                       <label><strong>Enrollment No:</strong></label>
//                       <input value={formData.enrollmentNo || ''} onChange={(e) => setFormData({ ...formData, enrollmentNo: e.target.value })} />
//                       {editErrors.enrollmentNo && <span className="error">{editErrors.enrollmentNo}</span>}
//                     </div>
//                     <label><strong>Phone No:</strong></label>
//                     <input value={formData.phoneNo || ''} onChange={(e) => setFormData({ ...formData, phoneNo: e.target.value })} />
//                     {editErrors.phoneNo && <span className="error">{editErrors.phoneNo}</span>}
//                     <div>
//                       <label><strong>Date of Birth:</strong></label>
//                       <input type="date" value={formData.dob || ''} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} />
//                       {editErrors.dob && <span className="error">{editErrors.dob}</span>}
//                     </div>
//                     <label><strong>Year:</strong></label>
//                     <input type="number" value={formData.year || ''} onChange={(e) => setFormData({ ...formData, year: e.target.value })} />
//                     {editErrors.year && <span className="error">{editErrors.year}</span>}
//                     <div>
//                       <label><strong>Department:</strong></label>
//                       <select value={formData.department || ''} onChange={(e) => setFormData({ ...formData, department: e.target.value })}>
//                         <option value="">Select Department</option>
//                         {departmentOptions.map((dept) => (
//                           <option key={dept} value={dept}>{dept}</option>
//                         ))}
//                       </select>
//                       {editErrors.department && <span className="error">{editErrors.department}</span>}
//                     </div>
//                     <button onClick={handleUpdateStudent}>Save</button>
//                     <button onClick={() => setEditingStudentId(null)}>Cancel</button>
//                   </div>
//                 ) : (
//                   <div className="student-details">
//                     <p><strong>Student Roll Number:</strong> {student.studentRollNo}</p>
//                     <p><strong>Name:</strong> {student.name}</p>
//                     <p><strong>Email:</strong> {student.email}</p>
//                     <p><strong>Enrollment No:</strong> {student.enrollmentNo}</p>
//                     <p><strong>Phone No:</strong> {student.phoneNo}</p>
//                     <p><strong>Date of Birth:</strong> {student.dob.split('T')[0]}</p>
//                     <p><strong>Year:</strong> {student.year}</p>
//                     <p><strong>Department:</strong> {student.department}</p>
//                     <button onClick={() => handleEditClick(student)}>Edit</button>
//                     <button className="deletebutton" onClick={() => handleDeleteStudent(student.id)}>Delete</button>
//                   </div>
//                 )}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Student;


// import '../App.css';
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// interface Student {
//   id: string;
//   studentRollNo:string;
//   name: string;
//   email: string;
//   enrollmentNo: string;
//   phoneNo: string;
//   dob: string;
//   year: string;
//   department: string;
// }
// const departmentOptions = ['CSE', 'ECE', 'EEE', 'MEC', 'CIVIL'];
// // eslint-disable-next-line @typescript-eslint/no-redeclare
// const Student: React.FC = () => {
//   const navigate = useNavigate();
//   //  ADDED - State for Roll No Search
//   const [searchRollNo, setSearchRollNo] = useState<string>('');
//   const [students, setStudents] = useState<Student[]>([]);
//   const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
//   const [formData, setFormData] = useState<Partial<Student>>({});
//   const [newStudent, setNewStudent] = useState<Omit<Student, 'id'>>({
//      studentRollNo: '', 
//     name: '',
//     email: '',
//     enrollmentNo: '',
//     phoneNo: '',
//     dob: '',
//     year: '',
//     department: '',

//   });
//   //validation
//   const [createErrors, setCreateErrors] = useState<Partial<Record<keyof Student, string>>>({});
//     const [editErrors, setEditErrors] = useState<Partial<Record<keyof Student, string>>>({});
  
//     const validateStudent = (student: Partial<Student | Omit<Student, 'id'>>) => {
//       const newErrors: Partial<Record<keyof Student, string>> = {};
  
//     if (!student.name) newErrors.name = 'Name is required';
//     if (!student.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.email))
//       newErrors.email = 'Valid email is required';
//     if (!student.enrollmentNo) newErrors.enrollmentNo = 'Enrollment No is required';
//     if (!student.phoneNo || !/^\d{10}$/.test(student.phoneNo))
//       newErrors.phoneNo = 'Phone No must be 10 digits';
//     if (!student.dob || new Date(student.dob) > new Date())
//       newErrors.dob = 'Valid DOB is required';
//     if (!student.year || isNaN(Number(student.year)) || Number(student.year) < 1 || Number(student.year) > 4)
//       newErrors.year = 'Year must be between 1 and 4';
//     if (!student.department) newErrors.department = 'Department is required';
//       return newErrors;
//     };

  
// //method for fetching students 
//   const fetchStudents = async () => {
//     try {
//       const response = await fetch('https://localhost:7172/api/students');
//       const data = await response.json();
//       setStudents(data);
//     } catch (error) {
//       console.error('Failed to fetch students:', error);
//     }
//   };
//   //method to add students
// const handleCreateStudent = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const validationErrors = validateStudent(newStudent);
//     if (Object.keys(validationErrors).length > 0) {
//       setCreateErrors(validationErrors);
//       return;
//     }
//     try {
//       const response = await fetch('https://localhost:7172/api/students', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(newStudent),
//       });

//       if (response.ok) {
//         await fetchStudents();
//         setNewStudent({
//            studentRollNo: '', 
//           name: '',
//           email: '',
//           enrollmentNo: '',
//           phoneNo: '',
//           dob: '',
//           year: '',
//           department: '',
//         });
//        setCreateErrors({});
//       }
//     } catch (error) {
//       console.error('Error creating student:', error);
//     }
//   };
//   //method to update student
//  const handleUpdateStudent = async () => {
//     const validationErrors = validateStudent(formData);
//     if (Object.keys(validationErrors).length > 0) {
//       setEditErrors(validationErrors);
//       return;
//     }
  

//     try {
//       const response = await fetch(`https://localhost:7172/api/students/${formData.id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });

//       if (response.ok) {
//         setEditingStudentId(null);
//         setFormData({});
//         setEditErrors({});
//         await fetchStudents();
//       }
//     } catch (error) {
//       console.error('Error updating student:', error);
//     }
//   };
// //method to delete student
//   const handleDeleteStudent = async (id: string) => {
//     try {
//       const response = await fetch(`https://localhost:7172/api/students/${id}`, {
//         method: 'DELETE',
//       });

//       if (response.ok) {
//         await fetchStudents();
//       }
//     } catch (error) {
//       console.error('Error deleting student:', error);
//     }
//   };
// //method to handle edit button
//   const handleEditClick = (student: Student) => {
//     setEditingStudentId(student.id);
//     setFormData({ ...student });
//     setEditErrors({});
//   };
// //method to go to dashboard
//   const goToDashboard = () => {
//     navigate('/dashboard');
//   };

//   useEffect(() => {
//     fetchStudents();
//   }, []);
// // 🔥 Filter students by Roll No
//  const filteredStudents = students.filter((student) =>
//   student.studentRollNo.toString().toLowerCase().includes(searchRollNo.toLowerCase())
// );

// const studentSearchMessage =
//   searchRollNo.trim() === ''
//     ? ''
//     : filteredStudents.length > 0
//     ? 'Student Found'
//     : 'Student Not Found';


//   return (
//     <div className="student-container">
//       <h1>Student Management</h1>
//       <button onClick={goToDashboard}>Back to Dashboard</button>
//  <div className="student-layout">
//       <div className="left-panel">

//       <h2>Create New Student</h2>
//       <form onSubmit={handleCreateStudent}>
//         <div className="student-form">
//          <div>
//            <label><strong> Name:-</strong> </label>
//           <input placeholder="Name" value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} />
//           {createErrors.name && <span className="error">{createErrors.name}</span>}
//          </div>
//  <div>
//    <strong>    <label> Email:-</label></strong> 
//           <input placeholder="Email" value={newStudent.email} onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })} />
//           {createErrors.email && <span className="error">{createErrors.email}</span>}
// </div>
//   <strong> <label> Enrollment No:-</label></strong> 
//           <input placeholder="Enrollment No" value={newStudent.enrollmentNo} onChange={(e) => setNewStudent({ ...newStudent, enrollmentNo: e.target.value })} />
//           {createErrors.enrollmentNo && <span className="error">{createErrors.enrollmentNo}</span>}
// <div>
//     <strong> <label> Phone No:-</label></strong> 
//           <input placeholder="Phone No" value={newStudent.phoneNo} onChange={(e) => setNewStudent({ ...newStudent, phoneNo: e.target.value })} />
//           {createErrors.phoneNo && <span className="error">{createErrors.phoneNo}</span>}
// </div>
//      <strong>  <label> Date of birth:-</label></strong> 
//           <input type="date" value={newStudent.dob} onChange={(e) => setNewStudent({ ...newStudent, dob: e.target.value })} />
//           {createErrors.dob && <span className="error">{createErrors.dob}</span>}
// <div>
//        <strong>  <label> Year:-</label></strong> 
//           <input type="number" placeholder="Year" value={newStudent.year} onChange={(e) => setNewStudent({ ...newStudent, year: e.target.value })} />
//           {createErrors.year && <span className="error">{createErrors.year}</span>}
// </div>
//          <div>
//             <strong> <label> Department:-</label></strong> 
//   <select value={newStudent.department} onChange={(e) => setNewStudent({ ...newStudent, department: e.target.value })}>
//     <option value="">Select Department</option>
//     {departmentOptions.map((dept) => (
//       <option key={dept} value={dept}>{dept}</option>
//     ))}
//   </select>
//   {createErrors.department && <span className="error">{createErrors.department}</span>}
// </div>
// <div>
//           <button type="submit">Add Student</button>
//         </div>
//         </div>
//       </form>
// </div> 
// </div>
// <h2>All Students</h2>
//  <div className="right-panel">

//       {/*  Search Filter Input */}
//         <div className="search-student-box">
//           <input
//             type="text"
//             placeholder="Search by Roll Number"
//             value={searchRollNo}
//             onChange={(e) => setSearchRollNo(e.target.value)}
            
//           />
//         </div>
//         {/* {searchRollNo && <h3>{studentSearchMessage}</h3>} */}
// <ul className="student-list">
//    {searchRollNo && <h3>{studentSearchMessage}</h3>}
//   {(searchRollNo ? filteredStudents : students).map((student) => (
//     <li key={student.id} className="student-item">
//       {editingStudentId === student.id ? (
//         <div>
//           <div>
             
//             <strong><label>Name:-</label></strong>
//             <input
//               value={formData.name || ''}
//               onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//             />
//             {editErrors.name && <span className="error">{editErrors.name}</span>}
//           </div>
//           <strong><label>Email:-</label></strong>
//           <input
//             value={formData.email || ''}
//             onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//           />
//           {editErrors.email && <span className="error">{editErrors.email}</span>}
//           <div>
//             <strong><label>Enrollment No:-</label></strong>
//             <input
//               value={formData.enrollmentNo || ''}
//               onChange={(e) => setFormData({ ...formData, enrollmentNo: e.target.value })}
//             />
//             {editErrors.enrollmentNo && <span className="error">{editErrors.enrollmentNo}</span>}
//           </div>
//           <strong><label>Phone No:-</label></strong>
//           <input
//             value={formData.phoneNo || ''}
//             onChange={(e) => setFormData({ ...formData, phoneNo: e.target.value })}
//           />
//           {editErrors.phoneNo && <span className="error">{editErrors.phoneNo}</span>}
//           <div>
//             <strong><label>Date of birth:-</label></strong>
//             <input
//               type="date"
//               value={formData.dob || ''}
//               onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
//             />
//             {editErrors.dob && <span className="error">{editErrors.dob}</span>}
//           </div>
//           <strong><label>Year:-</label></strong>
//           <input
//             type="number"
//             value={formData.year || ''}
//             onChange={(e) => setFormData({ ...formData, year: e.target.value })}
//           />
//           {editErrors.year && <span className="error">{editErrors.year}</span>}
//           <div>
//             <strong><label>Department:-</label></strong>
//             <select
//               value={formData.department || ''}
//               onChange={(e) => setFormData({ ...formData, department: e.target.value })}
//             >
//               <option value="">Select Department</option>
//               {departmentOptions.map((dept) => (
//                 <option key={dept} value={dept}>
//                   {dept}
//                 </option>
//               ))}
//             </select>
//             {editErrors.department && <span className="error">{editErrors.department}</span>}
//           </div>
//           <button onClick={handleUpdateStudent}>Save</button>
//           <button onClick={() => setEditingStudentId(null)}>Cancel</button>
//         </div>
//       ) : (
//         <div className="student-details">
//           <p><strong>Student Roll Number:</strong> {student.studentRollNo}</p>
//           <p><strong>Name:</strong> {student.name}</p>
//           <p><strong>Email:</strong> {student.email}</p>
//           <p><strong>Enrollment No:</strong> {student.enrollmentNo}</p>
//           <p><strong>Phone No:</strong> {student.phoneNo}</p>
//           <p><strong>Date of Birth:</strong> {student.dob.split('T')[0]}</p>
//           <p><strong>Year:</strong> {student.year}</p>
//           <p><strong>Department:</strong> {student.department}</p>
//           <button onClick={() => handleEditClick(student)}>Edit</button>
//           <button className="deletebutton" onClick={() => handleDeleteStudent(student.id)}>Delete</button>
//         </div>
//       )}
//     </li>
//   ))}
// </ul>
//       </div>
//       </div>
// );
 
// };

// export default Student;
