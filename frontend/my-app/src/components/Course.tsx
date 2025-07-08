import '../App.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../api';

interface Course {
  id: string;
  courseNo: string;
  title: string;
  description: string;
  instructor: string;
  startTime: string;
  endTime: string;
  maxStudents: number;
}

const Course: React.FC = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState<Course[]>([]);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Course>>({});
  const [newCourse, setNewCourse] = useState<Omit<Course, 'id'>>({
    courseNo: '',
    title: '',
    description: '',
    instructor: '',
    startTime: '',
    endTime: '',
    maxStudents: 0,
  });

  const [createErrors, setCreateErrors] = useState<Partial<Record<keyof Course, string>>>({});
  const [editErrors, setEditErrors] = useState<Partial<Record<keyof Course, string>>>({});

  const validateCourse = (course: Partial<Course>) => {
    const errors: Partial<Record<keyof Course, string>> = {};
    if (!course.title) errors.title = 'Title is required';
    if (!course.courseNo) errors.courseNo = 'Course No is required';
    if (!course.instructor) errors.instructor = 'Instructor is required';
    if (!course.startTime) errors.startTime = 'Start Time is required';
    if (!course.endTime) errors.endTime = 'End Time is required';
    if (!course.maxStudents || course.maxStudents < 1) errors.maxStudents = 'Max students must be greater than 0';
    return errors;
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/courses`);
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateCourse(newCourse);
    if (Object.keys(errors).length > 0) {
      setCreateErrors(errors);
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCourse),
      });

      if (res.ok) {
        await fetchCourses();
        setNewCourse({
          courseNo: '',
          title: '',
          description: '',
          instructor: '',
          startTime: '',
          endTime: '',
          maxStudents: 0,
        });
        setCreateErrors({});
      }
    } catch (err) {
      console.error('Error creating course:', err);
    }
  };

  const handleUpdateCourse = async () => {
    const errors = validateCourse(formData);
    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/courses/${formData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setEditingCourseId(null);
        setFormData({});
        setEditErrors({});
        await fetchCourses();
      }
    } catch (err) {
      console.error('Error updating course:', err);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    try {
      const res = await fetch(`${BASE_URL}/api/courses/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await fetchCourses();
      }
    } catch (err) {
      console.error('Error deleting course:', err);
    }
  };

  const handleEditClick = (course: Course) => {
    setEditingCourseId(course.id);
    setFormData({ ...course });
    setEditErrors({});
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="student-container">
      <h1>Course Management</h1>
      <button onClick={goToDashboard}>Back to Dashboard</button>

      <div className="student-layout">
        <div className="left-panel">
          <h2>Create New Course</h2>
          <form onSubmit={handleCreateCourse}>
            <div className="student-form">
              <div>
                <label><strong>Course No:</strong></label>
                <input value={newCourse.courseNo} onChange={(e) => setNewCourse({ ...newCourse, courseNo: e.target.value })} />
                {createErrors.courseNo && <span className="error">{createErrors.courseNo}</span>}
              </div>
              <div>
                <label><strong>Title:</strong></label>
                <input value={newCourse.title} onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })} />
                {createErrors.title && <span className="error">{createErrors.title}</span>}
              </div>
              <div>
                <label><strong>Description:</strong></label>
                <input value={newCourse.description} onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })} />
              </div>
              <div>
                <label><strong>Instructor:</strong></label>
                <input value={newCourse.instructor} onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })} />
                {createErrors.instructor && <span className="error">{createErrors.instructor}</span>}
              </div>
              <div>
                <label><strong>Start Time:</strong></label>
                <input type="time" value={newCourse.startTime} onChange={(e) => setNewCourse({ ...newCourse, startTime: e.target.value })} />
                {createErrors.startTime && <span className="error">{createErrors.startTime}</span>}
              </div>
              <div>
                <label><strong>End Time:</strong></label>
                <input type="time" value={newCourse.endTime} onChange={(e) => setNewCourse({ ...newCourse, endTime: e.target.value })} />
                {createErrors.endTime && <span className="error">{createErrors.endTime}</span>}
              </div>
              <div>
                <label><strong>Max Students:</strong></label>
                <input
                  type="number"
                  value={newCourse.maxStudents}
                  onChange={(e) => setNewCourse({ ...newCourse, maxStudents: Number(e.target.value) })}
                />
                {createErrors.maxStudents && <span className="error">{createErrors.maxStudents}</span>}
              </div>
              <div>
                <button type="submit">Add Course</button>
              </div>
            </div>
          </form>
        </div>

        <div className="right-panel">
          <h2>All Courses</h2>
          <ul className="student-list">
            {courses.map((course) => (
              <li key={course.id} className="student-item">
                {editingCourseId === course.id ? (
                  <div>
                    <label><strong>Course No:</strong></label>
                    <input value={formData.courseNo || ''} onChange={(e) => setFormData({ ...formData, courseNo: e.target.value })} />
                    {editErrors.courseNo && <span className="error">{editErrors.courseNo}</span>}

                    <label><strong>Title:</strong></label>
                    <input value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                    {editErrors.title && <span className="error">{editErrors.title}</span>}

                    <label><strong>Description:</strong></label>
                    <input value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />

                    <label><strong>Instructor:</strong></label>
                    <input value={formData.instructor || ''} onChange={(e) => setFormData({ ...formData, instructor: e.target.value })} />
                    {editErrors.instructor && <span className="error">{editErrors.instructor}</span>}

                    <label><strong>Start Time:</strong></label>
                    <input type="time" value={formData.startTime || ''} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} />
                    {editErrors.startTime && <span className="error">{editErrors.startTime}</span>}

                    <label><strong>End Time:</strong></label>
                    <input type="time" value={formData.endTime || ''} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} />
                    {editErrors.endTime && <span className="error">{editErrors.endTime}</span>}

                    <label><strong>Max Students:</strong></label>
                    <input
                      type="number"
                      value={formData.maxStudents || 0}
                      onChange={(e) => setFormData({ ...formData, maxStudents: Number(e.target.value) })}
                    />
                    {editErrors.maxStudents && <span className="error">{editErrors.maxStudents}</span>}

                    <button onClick={handleUpdateCourse}>Save</button>
                    <button onClick={() => setEditingCourseId(null)}>Cancel</button>
                  </div>
                ) : (
                  <div className="student-details">
                    <p><strong>Course No:</strong> {course.courseNo}</p>
                    <p><strong>Title:</strong> {course.title}</p>
                    <p><strong>Description:</strong> {course.description}</p>
                    <p><strong>Instructor:</strong> {course.instructor}</p>
                    <p><strong>Start Time:</strong> {course.startTime}</p>
                    <p><strong>End Time:</strong> {course.endTime}</p>
                    <p><strong>Max Students:</strong> {course.maxStudents}</p>
                    <button onClick={() => handleEditClick(course)}>Edit</button>
                    <button className="deletebutton" onClick={() => handleDeleteCourse(course.id)}>Delete</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Course;



// import '../Course.css';
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// //interface tells to what fields should be called from backend
// interface Schedule {
//   days: string[];
//   startTime: string;
//   endTime: string;
// }

// interface Course {
//   id: string;
//   courseTitle: string;
//   credits: string;
//   instructor: string;
//   semester: string;
//   maxStudents: string;
//   schedule: Schedule;
//   courseNo: string; 
// }

// const dayMap: { [key: string]: string } = {
//   "1": "Monday",
//   "2": "Tuesday",
//   "3": "Wednesday",
//   "4": "Thursday",
//   "5": "Friday",
//   "6": "Saturday",
//   "0": "Sunday"
// };

// // eslint-disable-next-line @typescript-eslint/no-redeclare
// const Course: React.FC = () => {
//   //declaring use states
//   const navigate = useNavigate();
//   const [courses, setCourses] = useState<Course[]>([]);
//   //searching states
//    const [searchCoursetitle, setCoursetitle] = useState<string>('');
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [formData, setFormData] = useState<Partial<Course>>({
//     schedule: { days: [], startTime: '', endTime: '' },
//   });
//   const [newCourse, setNewCourse] = useState<Omit<Course, 'id'>>({
//      courseNo: '', 
//     courseTitle: '',
//     credits: '',
//     instructor: '',
//     semester: '',
//     maxStudents: '',
//     schedule: { days: [], startTime: '', endTime: '' },
//   });

//   // separate validation states
//   const [createErrors, setCreateErrors] = useState<Partial<Record<keyof Course, string>>>({});
//   const [editErrors, setEditErrors] = useState<Partial<Record<keyof Course, string>>>({});
// //validations
//   const validateCourse = (course: Partial<Course | Omit<Course, 'id'>>) => {
//     const newErrors: Partial<Record<keyof Course, string>> = {};

//     if (!course.courseTitle) newErrors.courseTitle = 'Course title is required';
//     if (!course.credits) newErrors.credits = 'Credits are required';
//     if (!course.instructor) newErrors.instructor = 'Instructor is required';
//     if (!course.semester) newErrors.semester = 'Semester is required';
//     if (!course.maxStudents) newErrors.maxStudents = 'Max students is required';

//     return newErrors;
//   };
// //method for fetching courses
//   const fetchCourses = async () => {
//     const res = await fetch('https://localhost:7172/api/course');
//     const data = await res.json();
//     setCourses(data);
//   };
// //method to create courses
//   const handleCreate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const validationErrors = validateCourse(newCourse);
//     if (Object.keys(validationErrors).length > 0) {
//       setCreateErrors(validationErrors);
//       return;
//     }
//     setCreateErrors({}); 

//     const res = await fetch('https://localhost:7172/api/course', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(newCourse),
//     });
//     if (res.ok) {
//       await fetchCourses();
//       setNewCourse({
//          courseNo: '', 
//         courseTitle: '',
//         credits: '',
//         instructor: '',
//         semester: '',
//         maxStudents: '',
//         schedule: { days: [], startTime: '', endTime: '' },
//       });
//     }
//   };
// //method to delete courses
//   const handleDelete = async (id: string) => {
//     await fetch(`https://localhost:7172/api/course/${id}`, { method: 'DELETE' });
//     await fetchCourses();
//   };
// //method to update courses
//   const handleUpdate = async () => {
//     const validationErrors = validateCourse(formData);
//     if (Object.keys(validationErrors).length > 0) {
//       setEditErrors(validationErrors);
//       return;
//     }
//     setEditErrors({}); 

//     if (!formData.id || !formData.schedule) return;

//     const updateDto = {
//       id: formData.id,
//       courseTitle: formData.courseTitle,
//       credits: formData.credits,
//       instructor: formData.instructor,
//       semester: formData.semester,
//       maxStudents: formData.maxStudents,
//       schedule: {
//         days: formData.schedule.days.map(day => dayMap[day] || day),
//         startTime: formData.schedule.startTime.length === 5 ? formData.schedule.startTime + ':00' : formData.schedule.startTime,
//         endTime: formData.schedule.endTime.length === 5 ? formData.schedule.endTime + ':00' : formData.schedule.endTime
//       }
//     };

//     const res = await fetch(`https://localhost:7172/api/course/${formData.id}`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(updateDto),
//     });

//     if (res.ok) {
//       setEditingId(null);
//       setFormData({ schedule: { days: [], startTime: '', endTime: '' } });
//       await fetchCourses();
//     } else {
//       const error = await res.text();
//       alert("Failed to update course: " + error);
//     }
//   };
// //method which helps in navigating to the dashboard
//   const goToDashboard = () => navigate('/dashboard');

//   useEffect(() => {
//     fetchCourses();
//   }, []);
//  //  Filter courses by course name
//  const filteredCourses = courses.filter((course) =>
//  course.courseTitle.toLowerCase().includes(searchCoursetitle.toLowerCase())
// );

// const CourseSearchMessage =
//   searchCoursetitle.trim() === ''
//     ? ''
//     : filteredCourses.length > 0
//     ? 'Course Found'
//     : 'Course Not Found';

//   return (
//     <div className="course-container">
//       <h1>Course Management</h1>
//       <button onClick={goToDashboard}>Back to Dashboard</button>

//       <h2>Create New Course</h2>
//       <div className="course-form">
//         <div>
//            <label>Course Name:-</label>
//           <input placeholder="Title" value={newCourse.courseTitle} onChange={(e) => setNewCourse({ ...newCourse, courseTitle: e.target.value })} />
//           {createErrors.courseTitle && <div className="error">{createErrors.courseTitle}</div>}
//         </div>

//         <div>
//             <label>Credits:-</label>
//           <input type="number" placeholder="Credits" value={newCourse.credits} onChange={(e) => setNewCourse({ ...newCourse, credits: e.target.value })} />
//           {createErrors.credits && <div className="error">{createErrors.credits}</div>}
//         </div>

//         <div>
//               <label>Instructor:-</label>
//           <input placeholder="Instructor" value={newCourse.instructor} onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })} />
//           {createErrors.instructor && <div className="error">{createErrors.instructor}</div>}
//         </div>

//         <div>
//           <label>Semester:-</label>
//           <input placeholder="Semester" value={newCourse.semester} onChange={(e) => setNewCourse({ ...newCourse, semester: e.target.value })} />
//           {createErrors.semester && <div className="error">{createErrors.semester}</div>}
//         </div>

//         <div>
//           <label>Maximum Students</label>
//           <input type="number" placeholder="Max Students" value={newCourse.maxStudents} onChange={(e) => setNewCourse({ ...newCourse, maxStudents: e.target.value })} />
//           {createErrors.maxStudents && <div className="error">{createErrors.maxStudents}</div>}
//         </div>

//         <div>
//           <label>Days:-</label>
//           <input placeholder="Days (comma-separated)" value={newCourse.schedule.days.join(',')} onChange={(e) => setNewCourse({ ...newCourse, schedule: { ...newCourse.schedule, days: e.target.value.split(',') } })} />
//         </div>

//         <div>
//           <label>From:-</label>
//           <input type="time" value={newCourse.schedule.startTime} onChange={(e) => setNewCourse({ ...newCourse, schedule: { ...newCourse.schedule, startTime: e.target.value } })} />
//         </div>

//         <div>
//           <label>To:-</label>
//           <input type="time" value={newCourse.schedule.endTime} onChange={(e) => setNewCourse({ ...newCourse, schedule: { ...newCourse.schedule, endTime: e.target.value } })} />
//         </div>

//         <button className='Addcourse' onClick={handleCreate}>Add Course</button>
//       </div>
//  <div className="search-box">
//           <input
//             type="text"
//             placeholder="Search by Course Title"
//             value={searchCoursetitle}
//             onChange={(e) => setCoursetitle(e.target.value)}
//           />
//         </div>
//         {searchCoursetitle && <h3>{CourseSearchMessage}</h3>}
//       <h2>All Courses</h2>
//       <ul className="course-list">
//         {(searchCoursetitle ? filteredCourses :courses).map((course) => (
//           <li key={course.id} className="course-item">
//             {editingId === course.id ? (
//               <div className="course-form">
//                 <div>
//                       <label>Course Name:-</label>
//                   <input placeholder="Title" value={formData.courseTitle || ''} onChange={(e) => setFormData({ ...formData, courseTitle: e.target.value })} />
//                   {editErrors.courseTitle && <div className="error">{editErrors.courseTitle}</div>}
//                 </div>

//                 <div>
//                       <label>Credits:-</label>
//                   <input placeholder="Credits" type="number" value={formData.credits || ''} onChange={(e) => setFormData({ ...formData, credits: e.target.value })} />
//                   {editErrors.credits && <div className="error">{editErrors.credits}</div>}
//                 </div>

//                 <div>
//                     <label>Instructor:-</label>
//                   <input placeholder="Instructor" value={formData.instructor || ''} onChange={(e) => setFormData({ ...formData, instructor: e.target.value })} />
//                   {editErrors.instructor && <div className="error">{editErrors.instructor}</div>}
//                 </div>

//                 <div>
//                     <label>Semester:-</label>
//                   <input placeholder="Semester" value={formData.semester || ''} onChange={(e) => setFormData({ ...formData, semester: e.target.value })} />
//                   {editErrors.semester && <div className="error">{editErrors.semester}</div>}
//                 </div>

//                 <div>
//                   <label>Days:-</label>
//                   <input placeholder="Days (comma-separated)" value={formData.schedule?.days.map(day => dayMap[day] || day).join(',') || ''} onChange={(e) => setFormData({ ...formData, schedule: { ...formData.schedule!, days: e.target.value.split(',') } })} />
//                 </div>

//                 <div>
//                      <label>From:-</label>
//                   <input type="time" value={formData.schedule?.startTime || ''} onChange={(e) => setFormData({ ...formData, schedule: { ...formData.schedule!, startTime: e.target.value } })} />
//                 </div>

//                 <div>
//                      <label>To:-</label>
//                   <input type="time" value={formData.schedule?.endTime || ''} onChange={(e) => setFormData({ ...formData, schedule: { ...formData.schedule!, endTime: e.target.value } })} />
//                 </div>

//                 <button onClick={handleUpdate}>Save</button>
//                 <button onClick={() => setEditingId(null)}>Cancel</button>
//               </div>
//             ) : (
//               <div> 
//                  <p><strong>Course Number:- </strong> {course.courseNo}</p>
//                 <p><strong>Course Name:</strong> {course.courseTitle}</p>
//                 <p><strong>Instructor:</strong> {course.instructor}</p>
//                 <p><strong>Semester:</strong> {course.semester}</p>
//                 <p><strong>Credits:</strong> {course.credits}</p>
//                 <p><strong>Max Students:</strong> {course.maxStudents}</p>
//                 <p><strong>Schedule:</strong> {course.schedule.days.map(day => dayMap[day] || day).join(', ')} | {course.schedule.startTime} - {course.schedule.endTime}</p>
//                 <button onClick={() => {
//                   setEditingId(course.id);
//                   setFormData({ ...course });
//                 }}>Edit</button>
//                 <button className='deletebutton' onClick={() => handleDelete(course.id)}>Delete</button>
//               </div>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Course;
