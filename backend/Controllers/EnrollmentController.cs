using Microsoft.AspNetCore.Mvc;
using Student_course_enrollment.Models;
using Student_course_enrollment.Models.DTOs;
using Student_course_enrollment.Services;

namespace Student_course_enrollment.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EnrollmentController : ControllerBase
    {
        private readonly EnrollmentService _service;

        public EnrollmentController(EnrollmentService service)
        {
            _service = service;
        }

        // i. Enroll a student
        [HttpPost]

       
        public async Task<IActionResult> EnrollStudent([FromBody] EnrollmentCreateDto dto)
        {
            var enrollment = new Enrollment
            {
                
                StudentId = string.Empty,
                CourseId = string.Empty,

                StudentRollNo = dto.StudentRollNo,
                CourseNo = dto.CourseNo,
                Grade = dto.Grade,
                Attendance = dto.Attendance,
                EnrollmentDate = dto.EnrolledDate
            };

            // FIX: Pass RollNo and CourseNo as separate args
            var result = await _service.EnrollStudentAsync(dto.StudentRollNo, dto.CourseNo, enrollment);

            if (result == "Enrollment successful") return Ok(result);
            return BadRequest(result);
        }


        // ii. Unenroll a student
        [HttpDelete("unenroll")]
        public async Task<IActionResult> UnenrollStudent([FromQuery] int studentRollNo, [FromQuery] int courseNo)
        {
            var result = await _service.UnenrollStudentAsync(studentRollNo, courseNo);
            return result ? Ok("Unenrolled successfully") : NotFound("Enrollment not found");
        }

        // iii. View GPA per student
        [HttpGet("gpa/{studentRollNo}")]
        public async Task<IActionResult> GetGpa(int studentRollNo)
        {
            var gpa = await _service.GetGpaForStudentAsync(studentRollNo);
            return gpa == null ? NotFound("No enrollments found") : Ok(new { GPA = gpa });
        }

        // iv. Add attendance
        [HttpPost("attendance")]
        public async Task<IActionResult> MarkAttendance([FromQuery] int studentRollNo, [FromQuery] int courseNo, [FromQuery] DateTime date)
        {
            var result = await _service.AddAttendanceAsync(studentRollNo, courseNo, date);
            return Ok(result);
        }

        // iv. View attendance
        [HttpGet("attendance")]
        public async Task<IActionResult> GetAttendance([FromQuery] int studentRollNo, [FromQuery] int courseNo)
        {
            var dates = await _service.GetAttendanceAsync(studentRollNo, courseNo);
            return Ok(dates);
        }

        // v. Get all students in a course
        [HttpGet("students/{courseNo}")]
        public async Task<IActionResult> GetStudentsByCourseNoAsync(int courseNo)
        {
            var students = await _service.GetStudentsByCourseNoAsync(courseNo);
            return Ok(students);
        }

        // Optional: Get all enrollments
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var enrollments = await _service.GetAllAsync();
            return Ok(enrollments);
        }
    }
}













//using Microsoft.AspNetCore.Mvc;
//using Student_course_enrollment.Models;
//using Student_course_enrollment.Models.DTOs;
//using Student_course_enrollment.Services;

//namespace Student_course_enrollment.Controllers
//{
//    [ApiController]
//    [Route("api/[controller]")]
//    public class EnrollmentController : ControllerBase
//    {
//        private readonly EnrollmentService _service;

//        public EnrollmentController(EnrollmentService service)
//        {
//            _service = service;
//        }

//        // i. Enroll a student
//        [HttpPost]
//        public async Task<IActionResult> EnrollStudent([FromBody] EnrollmentCreateDto dto)
//        {
//            var enrollment = new Enrollment
//            {
//                StudentId = dto.StudentId,
//                CourseId = dto.CourseId,
//                Grade = dto.Grade,
//                Attendance = dto.Attendance,
//                EnrollmentDate = dto.EnrolledDate
//            };

//            var result = await _service.EnrollStudentAsync(enrollment);

//            if (result == "Enrollment successful") return Ok(result);
//            return BadRequest(result);
//        }

//        // ii. Unenroll a student
//        [HttpDelete("unenroll")]
//        public async Task<IActionResult> UnenrollStudent([FromQuery] string studentId, [FromQuery] string courseId)
//        {
//            var success = await _service.UnenrollStudentAsync(studentId, courseId);
//            return success ? Ok("Unenrolled successfully") : NotFound("Enrollment not found");
//        }

//        // iii. View GPA per student
//        [HttpGet("gpa/{studentId}")]
//        public async Task<IActionResult> GetGpa(string studentId)
//        {
//            var gpa = await _service.GetGpaForStudentAsync(studentId);
//            return gpa == null ? NotFound("No enrollments found") : Ok(new { GPA = gpa });
//        }

//        // iv. Add attendance
//        [HttpPost("attendance")]
//        public async Task<IActionResult> MarkAttendance([FromQuery] string studentId, [FromQuery] string courseId, [FromQuery] DateTime date)
//        {
//            var result = await _service.AddAttendanceAsync(studentId, courseId, date);
//            return Ok(result);
//        }

//        // iv. View attendance
//        [HttpGet("attendance")]
//        public async Task<IActionResult> GetAttendance([FromQuery] string studentId, [FromQuery] string courseId)
//        {
//            var dates = await _service.GetAttendanceAsync(studentId, courseId);
//            return Ok(dates);
//        }

//        // v. Get all students in a course
//        [HttpGet("students/{courseId}")]
//        public async Task<IActionResult> GetStudentsByCourse(string courseId)
//        {
//            var students = await _service.GetStudentsByCourseIdAsync(courseId);
//            return Ok(students);
//        }

//        // (Optional) Get all enrollments
//        [HttpGet]
//        public async Task<IActionResult> GetAll()
//        {
//            var enrollments = await _service.GetAllAsync();
//            return Ok(enrollments);
//        } 
//    }
//}
