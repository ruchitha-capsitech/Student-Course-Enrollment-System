using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace Student_course_enrollment.Models
{
    public class Course
    {
        //mycode 
        public int CourseNo { get; set; }

        //
        [BsonId] 
        [BsonRepresentation(BsonType.ObjectId)] 
        public string Id { get; set; }  


        public List<Enrollment> Enrollments { get; set; } = new List<Enrollment>();

        [Required]
        public string CourseTitle { get; set; }

        [Required]
        public int Credits { get; set; }

        [Required]
        public string Instructor { get; set; }

        [Required]
        public int Semester { get; set; }

        [Required]
        public Schedule Schedule { get; set; }

        [Required]
        [Range(1, 10, ErrorMessage = "MaxStudents are 10.")]
        public int MaxStudents { get; set; }
    }
}
