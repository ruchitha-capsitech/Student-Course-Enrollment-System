using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Student_course_enrollment.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

        [BsonElement("Username")]
        public string Username { get; set; } = null!;

        [BsonElement("Password")]
        public string Password { get; set; } = null!;
    }
}
