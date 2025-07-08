// ﻿namespace Student_course_enrollment.Models
// {
//     public class MongoDbSettings
//     {
//         public string ConnectionString { get; set; } = null!;
//         public string DatabaseName { get; set; } = null!;
//     }

// }
namespace Student_course_enrollment.Models
{
    public class MongoDbSettings : IMongoDbSettings
    {
        public string ConnectionString { get; set; } = null!;
        public string DatabaseName { get; set; } = null!;
        public string StudentCollectionName { get; set; } = null!;
        public string CourseCollectionName { get; set; } = null!;
        public string EnrollmentCollectionName { get; set; } = null!;
        public string UserCollectionName { get; set; } = null!;
    }

    public interface IMongoDbSettings
    {
        string ConnectionString { get; set; }
        string DatabaseName { get; set; }
        string StudentCollectionName { get; set; }
        string CourseCollectionName { get; set; }
        string EnrollmentCollectionName { get; set; }
        string UserCollectionName { get; set; }
    }
}
