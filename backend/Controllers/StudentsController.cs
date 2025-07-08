using Microsoft.AspNetCore.Mvc;
using Student_course_enrollment.Models;
using Student_course_enrollment.Models.DTOs;
using Student_course_enrollment.Services;

namespace Student_course_enrollment.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentsController : ControllerBase
    {
        private readonly StudentService _studentService;
        //TO CONNECT WITH STUDENT SERVICES FOR LOGIC
        public StudentsController(StudentService studentService)
        {
            _studentService = studentService;
        }

        //GET ALL METHOD
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var students = await _studentService.GetAllAsync();
            return Ok(students);
        }
        //GET BY ID METHOD
        [HttpGet("{id}")]
        public async Task<IActionResult> GetStudentById(string id)
        {
            var student = await _studentService.GetByIdAsync(id);
            if (student == null)
                return NotFound();
            return Ok(student);
        }

        // POST: api/students
        [HttpPost]
        public async Task<IActionResult> CreateStudent([FromBody] StudentCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var student = new Student
            {
                Name = dto.Name,
                Email = dto.Email,
                EnrollmentNo = dto.EnrollmentNo,
                PhoneNo = dto.PhoneNo,
                Dob = dto.Dob,
                Year = dto.Year,
                Department = dto.Department
            };

            var createdStudent = await _studentService.CreateAsync(student);
            return CreatedAtAction(nameof(GetStudentById), new { id = createdStudent.Id }, createdStudent);
        }


        // PUT: api/students/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStudent(string id, [FromBody] UpdateStudentDto dto)
        {
            if (!ModelState.IsValid || id != dto.Id)
                return BadRequest(ModelState);

            var existingStudent = await _studentService.GetByIdAsync(id);
            if (existingStudent == null)
                return NotFound();

            existingStudent.Name = dto.Name;
            existingStudent.Email = dto.Email;
            existingStudent.EnrollmentNo = dto.EnrollmentNo;
            existingStudent.PhoneNo = dto.PhoneNo;
            existingStudent.Dob = dto.Dob;
            existingStudent.Year = dto.Year;
            existingStudent.Department = dto.Department;

            var result = await _studentService.UpdateAsync(id, existingStudent);
            if (!result)
                return StatusCode(500, "Failed to update student.");

            return NoContent();
        }


        // DELETE: api/students/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(string id)
        {
            var existingStudent = await _studentService.GetByIdAsync(id);
            if (existingStudent == null)
                return NotFound();

            var deleteResult = await _studentService.DeleteAsync(id);
            if (!deleteResult)
                return StatusCode(500, "Failed to delete student");

            return NoContent(); // 204 No Content on successful delete
        }
    }
}
