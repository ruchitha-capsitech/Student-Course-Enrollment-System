using MongoDB.Driver;
using Student_course_enrollment.Models;
using Student_course_enrollment.Models.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Student_course_enrollment.Services
{
    public class EnrollmentService
    {
        private readonly IMongoCollection<Enrollment> _enrollments;
        private readonly IMongoCollection<Student> _students;
        private readonly IMongoCollection<Course> _courses;

        public EnrollmentService(IMongoDatabase database)
        {
            _enrollments = database.GetCollection<Enrollment>("Enrollments");
            _students = database.GetCollection<Student>("Students");
            _courses = database.GetCollection<Course>("Courses");
        }

        public async Task<List<Enrollment>> GetAllAsync()
        {
            return await _enrollments.Find(enrollment => true).ToListAsync();
        }

        public async Task<Enrollment?> GetByIdAsync(string id)
        {
            return await _enrollments.Find(enrollment => enrollment.Id == id).FirstOrDefaultAsync();
        }

        public async Task<string> EnrollStudentAsync(int studentRollNo, int courseNo, Enrollment enrollment)
        {
            var student = await _students.Find(s => s.StudentRollNo == studentRollNo).FirstOrDefaultAsync();   
            if (student == null) return "Student not found";

            var course = await _courses.Find(c => c.CourseNo == courseNo).FirstOrDefaultAsync();
            if (course == null) return "Course not found";

            var exists = await _enrollments.Find(e => e.StudentRollNo == studentRollNo && e.CourseNo == courseNo).AnyAsync();
            if (exists) return "Student already enrolled in this course";

            var enrolledCount = await _enrollments.CountDocumentsAsync(e => e.CourseNo == courseNo);
            if (enrolledCount >= course.MaxStudents) return "Course has reached maximum capacity";

            enrollment.StudentId = student.Id;
            enrollment.CourseId = course.Id;
            enrollment.Student = student;
            enrollment.Course = course;
            enrollment.StudentRollNo = studentRollNo;
            enrollment.CourseNo = courseNo;

            await _enrollments.InsertOneAsync(enrollment);
            return "Enrollment successful";
        }

        public async Task<bool> UnenrollStudentAsync(int studentRollNo, int courseNo)
        {
            var result = await _enrollments.DeleteOneAsync(e => e.StudentRollNo == studentRollNo && e.CourseNo == courseNo);
            return result.DeletedCount > 0;
        }

        public async Task<List<Student>> GetStudentsByCourseNoAsync(int courseNo)
        {
            var enrollments = await _enrollments.Find(e => e.CourseNo == courseNo).ToListAsync();
            var studentIds = enrollments.ConvertAll(e => e.StudentId);
            return await _students.Find(s => studentIds.Contains(s.Id)).ToListAsync();
        }

        public async Task<string> UpdateAsync(int studentRollNo, int courseNo, Enrollment updatedEnrollment)
        {
            var existing = await _enrollments.Find(e => e.StudentRollNo == studentRollNo && e.CourseNo == courseNo).FirstOrDefaultAsync();
            if (existing == null) return "Enrollment not found";

            var student = await _students.Find(s => s.StudentRollNo == updatedEnrollment.StudentRollNo).FirstOrDefaultAsync();
            if (student == null) return "Student not found";

            var course = await _courses.Find(c => c.CourseNo == updatedEnrollment.CourseNo).FirstOrDefaultAsync();
            if (course == null) return "Course not found";

            bool isChanging = existing.CourseNo != updatedEnrollment.CourseNo || existing.StudentRollNo != updatedEnrollment.StudentRollNo;

            if (isChanging)
            {
                var duplicate = await _enrollments.Find(e =>
                    e.StudentRollNo == updatedEnrollment.StudentRollNo && e.CourseNo == updatedEnrollment.CourseNo && e.Id != existing.Id).AnyAsync();

                if (duplicate) return "Student already enrolled in the target course";

                var enrolledCount = await _enrollments.CountDocumentsAsync(e => e.CourseNo == updatedEnrollment.CourseNo);
                if (enrolledCount >= course.MaxStudents) return "Course has reached maximum capacity";
            }

            updatedEnrollment.StudentId = student.Id;
            updatedEnrollment.CourseId = course.Id;
            updatedEnrollment.Student = student;
            updatedEnrollment.Course = course;

            var result = await _enrollments.ReplaceOneAsync(e => e.Id == existing.Id, updatedEnrollment);
            return result.IsAcknowledged && result.ModifiedCount > 0 ? "Enrollment updated successfully" : "Update failed";
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var result = await _enrollments.DeleteOneAsync(enrollment => enrollment.Id == id);
            return result.IsAcknowledged && result.DeletedCount > 0;
        }

        public async Task<string> AddAttendanceAsync(int studentRollNo, int courseNo, DateTime date)
        {
            var filter = Builders<Enrollment>.Filter.Where(e =>
                e.StudentRollNo == studentRollNo && e.CourseNo == courseNo);

            var update = Builders<Enrollment>.Update.AddToSet(e => e.Attendance, date.Date);

            var result = await _enrollments.UpdateOneAsync(filter, update);

            return result.ModifiedCount > 0 ? "Attendance marked" : "Enrollment not found or already marked";
        }

        public async Task<List<DateTime>> GetAttendanceAsync(int studentRollNo, int courseNo)
        {
            var enrollment = await _enrollments.Find(e =>
                e.StudentRollNo == studentRollNo && e.CourseNo == courseNo).FirstOrDefaultAsync();

            return enrollment?.Attendance ?? new List<DateTime>();
        }

        public async Task<double?> GetGpaForStudentAsync(int studentRollNo)
        {
            var enrollments = await _enrollments.Find(e => e.StudentRollNo == studentRollNo).ToListAsync();

            if (enrollments.Count == 0)
                return null;

            double totalPoints = 0;
            int count = 0;

            foreach (var e in enrollments)
            {
                if (GradeToPoints.TryGetValue(e.Grade.ToUpper(), out double points))
                {
                    totalPoints += points;
                    count++;
                }
            }

            return count == 0 ? null : totalPoints / count;
        }

        public async Task<string> UpdateGradeAsync(int studentRollNo, int courseNo, string newGrade)
        {
            if (!GradeToPoints.ContainsKey(newGrade.ToUpper()))
                return "Invalid grade";

            var filter = Builders<Enrollment>.Filter.Where(e => e.StudentRollNo == studentRollNo && e.CourseNo == courseNo);
            var update = Builders<Enrollment>.Update.Set(e => e.Grade, newGrade.ToUpper());

            var result = await _enrollments.UpdateOneAsync(filter, update);
            return result.ModifiedCount > 0 ? "Grade updated" : "Enrollment not found";
        }

        //internal async Task<string> EnrollStudentAsync(EnrollmentCreateDto dto)
        //{
        //    throw new NotImplementedException();
        //}

        private static readonly Dictionary<string, double> GradeToPoints = new()
        {
            { "A", 10.0 },
            { "B", 9.0 },
            { "C", 8.0 },
            { "D", 7.0 },
            { "F", 0.0 }
        };
    }
}
