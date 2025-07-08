using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Student_course_enrollment.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

        [BsonElement("username")]
        public string username { get; set; } = null!;

        [BsonElement("password")]
        public string password { get; set; } = null!;
    }
}
