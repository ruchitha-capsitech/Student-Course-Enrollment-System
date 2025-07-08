using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Student_course_enrollment.Models;

public class Enrollment
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = null!;

    public required string Grade { get; set; }

    public List<DateTime> Attendance { get; set; } = new List<DateTime>();

    [BsonRepresentation(BsonType.ObjectId)]
    public required string StudentId { get; set; }
    [BsonIgnore]
    public Student Student { get; set; }

    [BsonRepresentation(BsonType.ObjectId)]
    public required string CourseId { get; set; }
    [BsonIgnore]
    public Course Course { get; set; }

    public DateTime EnrollmentDate { get; set; }

    public int StudentRollNo { get; set; }

    public int CourseNo { get; set; }
}
