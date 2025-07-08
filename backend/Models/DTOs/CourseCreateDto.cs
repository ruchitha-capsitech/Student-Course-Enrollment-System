namespace Student_course_enrollment.Models.DTOs
{
    public class CourseCreateDto
    {
        public string CourseTitle { get; set; } = null!;

        public int Credits { get; set; }  

        public string Instructor { get; set; } = null!;

        public int Semester { get; set; }  

        public ScheduleDto Schedule { get; set; } = null!;

        public int MaxStudents { get; set; }  
    }
}
