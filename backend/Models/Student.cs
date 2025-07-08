using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Student_course_enrollment.Models;
using System.ComponentModel.DataAnnotations;

public class Student
{

    //mycode 
    public int StudentRollNo { get; set; }

    //
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = null!;  // MongoDB generated Id

    public List<Enrollment> Enrollments { get; set; } = new List<Enrollment>();

    public required string Name { get; set; }

    [Required]
    [EmailAddress]
    public required string Email { get; set; }

    [Required]
    public required string EnrollmentNo { get; set; }  // string, not int

    [Required]
    [RegularExpression(@"^\d{10}$", ErrorMessage = "Phone number must be exactly 10 digits.")]
    public required string PhoneNo { get; set; }  // string, not int

    [Required]
    [DataType(DataType.Date)]
    public DateTime Dob { get; set; }

    [Required]
    public int Year { get; set; }

    [RegularExpression(@"^[A-Za-z]{2,5}$", ErrorMessage = "Department must be alphabetic and 2 to 5 characters.")]
    public required string Department { get; set; }
}
