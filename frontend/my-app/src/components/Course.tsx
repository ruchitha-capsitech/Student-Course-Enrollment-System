import '../Course.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
//interface tells to what fields should be called from backend
interface Schedule {
  days: string[];
  startTime: string;
  endTime: string;
}

interface Course {
  id: string;
  courseTitle: string;
  credits: string;
  instructor: string;
  semester: string;
  maxStudents: string;
  schedule: Schedule;
  courseNo: string; 
}

const dayMap: { [key: string]: string } = {
  "1": "Monday",
  "2": "Tuesday",
  "3": "Wednesday",
  "4": "Thursday",
  "5": "Friday",
  "6": "Saturday",
  "0": "Sunday"
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
const Course: React.FC = () => {
  //declaring use states
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  //searching states
   const [searchCoursetitle, setCoursetitle] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Course>>({
    schedule: { days: [], startTime: '', endTime: '' },
  });
  const [newCourse, setNewCourse] = useState<Omit<Course, 'id'>>({
     courseNo: '', 
    courseTitle: '',
    credits: '',
    instructor: '',
    semester: '',
    maxStudents: '',
    schedule: { days: [], startTime: '', endTime: '' },
  });

  // separate validation states
  const [createErrors, setCreateErrors] = useState<Partial<Record<keyof Course, string>>>({});
  const [editErrors, setEditErrors] = useState<Partial<Record<keyof Course, string>>>({});
//validations
  const validateCourse = (course: Partial<Course | Omit<Course, 'id'>>) => {
    const newErrors: Partial<Record<keyof Course, string>> = {};

    if (!course.courseTitle) newErrors.courseTitle = 'Course title is required';
    if (!course.credits) newErrors.credits = 'Credits are required';
    if (!course.instructor) newErrors.instructor = 'Instructor is required';
    if (!course.semester) newErrors.semester = 'Semester is required';
    if (!course.maxStudents) newErrors.maxStudents = 'Max students is required';

    return newErrors;
  };
//method for fetching courses
  const fetchCourses = async () => {
    const res = await fetch('https://localhost:7172/api/course');
    const data = await res.json();
    setCourses(data);
  };
//method to create courses
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateCourse(newCourse);
    if (Object.keys(validationErrors).length > 0) {
      setCreateErrors(validationErrors);
      return;
    }
    setCreateErrors({}); 

    const res = await fetch('https://localhost:7172/api/course', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCourse),
    });
    if (res.ok) {
      await fetchCourses();
      setNewCourse({
         courseNo: '', 
        courseTitle: '',
        credits: '',
        instructor: '',
        semester: '',
        maxStudents: '',
        schedule: { days: [], startTime: '', endTime: '' },
      });
    }
  };
//method to delete courses
  const handleDelete = async (id: string) => {
    await fetch(`https://localhost:7172/api/course/${id}`, { method: 'DELETE' });
    await fetchCourses();
  };
//method to update courses
  const handleUpdate = async () => {
    const validationErrors = validateCourse(formData);
    if (Object.keys(validationErrors).length > 0) {
      setEditErrors(validationErrors);
      return;
    }
    setEditErrors({}); 

    if (!formData.id || !formData.schedule) return;

    const updateDto = {
      id: formData.id,
      courseTitle: formData.courseTitle,
      credits: formData.credits,
      instructor: formData.instructor,
      semester: formData.semester,
      maxStudents: formData.maxStudents,
      schedule: {
        days: formData.schedule.days.map(day => dayMap[day] || day),
        startTime: formData.schedule.startTime.length === 5 ? formData.schedule.startTime + ':00' : formData.schedule.startTime,
        endTime: formData.schedule.endTime.length === 5 ? formData.schedule.endTime + ':00' : formData.schedule.endTime
      }
    };

    const res = await fetch(`https://localhost:7172/api/course/${formData.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateDto),
    });

    if (res.ok) {
      setEditingId(null);
      setFormData({ schedule: { days: [], startTime: '', endTime: '' } });
      await fetchCourses();
    } else {
      const error = await res.text();
      alert("Failed to update course: " + error);
    }
  };
//method which helps in navigating to the dashboard
  const goToDashboard = () => navigate('/dashboard');

  useEffect(() => {
    fetchCourses();
  }, []);
 //  Filter courses by course name
 const filteredCourses = courses.filter((course) =>
 course.courseTitle.toLowerCase().includes(searchCoursetitle.toLowerCase())
);

const CourseSearchMessage =
  searchCoursetitle.trim() === ''
    ? ''
    : filteredCourses.length > 0
    ? 'Course Found'
    : 'Course Not Found';

  return (
    <div className="course-container">
      <h1>Course Management</h1>
      <button onClick={goToDashboard}>Back to Dashboard</button>

      <h2>Create New Course</h2>
      <div className="course-form">
        <div>
           <label>Course Name:-</label>
          <input placeholder="Title" value={newCourse.courseTitle} onChange={(e) => setNewCourse({ ...newCourse, courseTitle: e.target.value })} />
          {createErrors.courseTitle && <div className="error">{createErrors.courseTitle}</div>}
        </div>

        <div>
            <label>Credits:-</label>
          <input type="number" placeholder="Credits" value={newCourse.credits} onChange={(e) => setNewCourse({ ...newCourse, credits: e.target.value })} />
          {createErrors.credits && <div className="error">{createErrors.credits}</div>}
        </div>

        <div>
              <label>Instructor:-</label>
          <input placeholder="Instructor" value={newCourse.instructor} onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })} />
          {createErrors.instructor && <div className="error">{createErrors.instructor}</div>}
        </div>

        <div>
          <label>Semester:-</label>
          <input placeholder="Semester" value={newCourse.semester} onChange={(e) => setNewCourse({ ...newCourse, semester: e.target.value })} />
          {createErrors.semester && <div className="error">{createErrors.semester}</div>}
        </div>

        <div>
          <label>Maximum Students</label>
          <input type="number" placeholder="Max Students" value={newCourse.maxStudents} onChange={(e) => setNewCourse({ ...newCourse, maxStudents: e.target.value })} />
          {createErrors.maxStudents && <div className="error">{createErrors.maxStudents}</div>}
        </div>

        <div>
          <label>Days:-</label>
          <input placeholder="Days (comma-separated)" value={newCourse.schedule.days.join(',')} onChange={(e) => setNewCourse({ ...newCourse, schedule: { ...newCourse.schedule, days: e.target.value.split(',') } })} />
        </div>

        <div>
          <label>From:-</label>
          <input type="time" value={newCourse.schedule.startTime} onChange={(e) => setNewCourse({ ...newCourse, schedule: { ...newCourse.schedule, startTime: e.target.value } })} />
        </div>

        <div>
          <label>To:-</label>
          <input type="time" value={newCourse.schedule.endTime} onChange={(e) => setNewCourse({ ...newCourse, schedule: { ...newCourse.schedule, endTime: e.target.value } })} />
        </div>

        <button className='Addcourse' onClick={handleCreate}>Add Course</button>
      </div>
 <div className="search-box">
          <input
            type="text"
            placeholder="Search by Course Title"
            value={searchCoursetitle}
            onChange={(e) => setCoursetitle(e.target.value)}
          />
        </div>
        {searchCoursetitle && <h3>{CourseSearchMessage}</h3>}
      <h2>All Courses</h2>
      <ul className="course-list">
        {(searchCoursetitle ? filteredCourses :courses).map((course) => (
          <li key={course.id} className="course-item">
            {editingId === course.id ? (
              <div className="course-form">
                <div>
                      <label>Course Name:-</label>
                  <input placeholder="Title" value={formData.courseTitle || ''} onChange={(e) => setFormData({ ...formData, courseTitle: e.target.value })} />
                  {editErrors.courseTitle && <div className="error">{editErrors.courseTitle}</div>}
                </div>

                <div>
                      <label>Credits:-</label>
                  <input placeholder="Credits" type="number" value={formData.credits || ''} onChange={(e) => setFormData({ ...formData, credits: e.target.value })} />
                  {editErrors.credits && <div className="error">{editErrors.credits}</div>}
                </div>

                <div>
                    <label>Instructor:-</label>
                  <input placeholder="Instructor" value={formData.instructor || ''} onChange={(e) => setFormData({ ...formData, instructor: e.target.value })} />
                  {editErrors.instructor && <div className="error">{editErrors.instructor}</div>}
                </div>

                <div>
                    <label>Semester:-</label>
                  <input placeholder="Semester" value={formData.semester || ''} onChange={(e) => setFormData({ ...formData, semester: e.target.value })} />
                  {editErrors.semester && <div className="error">{editErrors.semester}</div>}
                </div>

                <div>
                  <label>Days:-</label>
                  <input placeholder="Days (comma-separated)" value={formData.schedule?.days.map(day => dayMap[day] || day).join(',') || ''} onChange={(e) => setFormData({ ...formData, schedule: { ...formData.schedule!, days: e.target.value.split(',') } })} />
                </div>

                <div>
                     <label>From:-</label>
                  <input type="time" value={formData.schedule?.startTime || ''} onChange={(e) => setFormData({ ...formData, schedule: { ...formData.schedule!, startTime: e.target.value } })} />
                </div>

                <div>
                     <label>To:-</label>
                  <input type="time" value={formData.schedule?.endTime || ''} onChange={(e) => setFormData({ ...formData, schedule: { ...formData.schedule!, endTime: e.target.value } })} />
                </div>

                <button onClick={handleUpdate}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </div>
            ) : (
              <div> 
                 <p><strong>Course Number:- </strong> {course.courseNo}</p>
                <p><strong>Course Name:</strong> {course.courseTitle}</p>
                <p><strong>Instructor:</strong> {course.instructor}</p>
                <p><strong>Semester:</strong> {course.semester}</p>
                <p><strong>Credits:</strong> {course.credits}</p>
                <p><strong>Max Students:</strong> {course.maxStudents}</p>
                <p><strong>Schedule:</strong> {course.schedule.days.map(day => dayMap[day] || day).join(', ')} | {course.schedule.startTime} - {course.schedule.endTime}</p>
                <button onClick={() => {
                  setEditingId(course.id);
                  setFormData({ ...course });
                }}>Edit</button>
                <button className='deletebutton' onClick={() => handleDelete(course.id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Course;
