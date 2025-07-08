namespace Student_course_enrollment.Models.DTOs
{
    public class ScheduleDto
    {
        public List<string> Days { get; set; } = new(); 
        public string StartTime { get; set; } = null!;   
        public string EndTime { get; set; } = null!;   
    }

}
