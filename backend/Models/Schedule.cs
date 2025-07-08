namespace Student_course_enrollment.Models
{
    public class Schedule
    {
       
        
            public List<DayOfWeek> Days { get; set; } = new();
        public TimeSpan StartTime { get; set; }
            public TimeSpan EndTime { get; set; }

        
    }
}
