using Course_course_enrollment.Services;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Student_course_enrollment.Models;
using Student_course_enrollment.Models.DTOs;
using Student_course_enrollment.Services;
namespace Student_course_enrollment.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CourseController : ControllerBase
    {
           
           //TO CONNECT WITH COURSE SERVICES
            private readonly CourseService _courseService;

            public CourseController(CourseService courseService)
            {
                _courseService = courseService;
            }
        //get all courses
        [HttpGet]

            public async Task<IActionResult> GetAll()
            {
                var courses = await _courseService.GetAllAsync();
                return Ok(courses);
            }
        //get courses by id
        [HttpGet("{id}", Name = "GetCourseById")]
        public async Task<IActionResult> GetCourseById(string id)
        {
            var course = await _courseService.GetByIdAsync(id);
            if (course == null)
                return NotFound();
            return Ok(course);
        }


        // POST: api/courses
        [HttpPost]
        public async Task<IActionResult> Createcourse([FromBody] CourseCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var course = new Course
            {
                CourseTitle = dto.CourseTitle,
                Credits = dto.Credits,
                Instructor = dto.Instructor,
                Semester = dto.Semester,
                MaxStudents = dto.MaxStudents,

                Schedule = new Schedule
                {
                    Days = dto.Schedule.Days
        .Select(day => Enum.Parse<DayOfWeek>(day, ignoreCase: true))
        .ToList(),
                    StartTime = TimeSpan.Parse(dto.Schedule.StartTime),
                    EndTime = TimeSpan.Parse(dto.Schedule.EndTime)
                }

            };

            var createdCourse = await _courseService.CreateAsync(course);
            return CreatedAtAction(nameof(GetCourseById), new { id = createdCourse.Id }, createdCourse);
        }



        // PUT: api/courses/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCourse(string id, [FromBody] UpdateCourseDto dto)
        {
            if (!ModelState.IsValid || id != dto.Id)
                return BadRequest(ModelState);

            var existingCourse = await _courseService.GetByIdAsync(id);
            if (existingCourse == null)
                return NotFound();

            //  Prevent changing MaxStudents
            if (dto.MaxStudents != existingCourse.MaxStudents)
                return BadRequest("MaxStudents cannot be changed after course creation.");

            // Update allowed fields
            existingCourse.CourseTitle = dto.CourseTitle;
            existingCourse.Credits = dto.Credits;
            existingCourse.Instructor = dto.Instructor;
            existingCourse.Semester = dto.Semester;

            // Update Schedule with conversion from DTO
            existingCourse.Schedule = new Schedule
            {
                Days = dto.Schedule.Days.Select(day =>
                {
                    return Enum.TryParse<DayOfWeek>(day, true, out var parsedDay)
                        ? parsedDay
                        : throw new ArgumentException($"Invalid day: {day}");
                }).ToList(),
                StartTime = TimeSpan.Parse(dto.Schedule.StartTime),
                EndTime = TimeSpan.Parse(dto.Schedule.EndTime)
            };

            var result = await _courseService.UpdateAsync(id, existingCourse);
            if (!result)
                return StatusCode(500, "Failed to update course.");

            return NoContent();
        }


        // DELETE: api/students/{id}
        [HttpDelete("{id}")]
            public async Task<IActionResult> DeleteCourse(string id)
            {
                var existingcourse = await _courseService.GetByIdAsync(id);
                if (existingcourse == null)
                    return NotFound();

                var deleteResult = await _courseService.DeleteAsync(id);
                if (!deleteResult)
                    return StatusCode(500, "Failed to delete student");

                return NoContent(); // 204 No Content on successful delete
            }
        }
}
