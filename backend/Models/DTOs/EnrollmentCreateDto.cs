namespace Student_course_enrollment.Models.DTOs
{
    public class EnrollmentCreateDto
    {
        public int StudentRollNo { get; set; }
        public int CourseNo { get; set; }


        public DateTime EnrolledDate { get; set; }

        public string Grade { get; set; } = null!;

        public List<DateTime> Attendance { get; set; } = new();
    }
}
