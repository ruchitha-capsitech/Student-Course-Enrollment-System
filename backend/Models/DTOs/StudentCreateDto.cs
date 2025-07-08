namespace Student_course_enrollment.Models.DTOs
{
    public class StudentCreateDto
    {
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string EnrollmentNo { get; set; } = null!;
        public string PhoneNo { get; set; } = null!;
        public DateTime Dob { get; set; }
        public int Year { get; set; }
        public string Department { get; set; } = null!;
    }
}
