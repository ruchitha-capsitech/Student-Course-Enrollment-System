using MongoDB.Driver;
using Student_course_enrollment.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
namespace Course_course_enrollment.Services
{
    public class CourseService
    {
        //to read data from database
       
        private readonly IMongoCollection<Course> _courses;


        public CourseService(IMongoDatabase database)
        {
            
            _courses = database.GetCollection<Course>("Courses");
        }
        //function to generate unique id for rollnumber 
        private async Task<int> GenerateUniqueCourseNoAsync()
        {
            var random = new Random();
            int newNo;

            do
            {
                newNo = random.Next(1, 51); // Generates a number between 1 and 50
            }
            while (await _courses.Find(s => s.CourseNo == newNo).AnyAsync());

            return newNo;
        }
        //GET all method
        public async Task<List<Course>> GetAllAsync()
        {
            return await _courses.Find(course => true).ToListAsync();
        }

        // Get a course by Id
        public async Task<Course?> GetByIdAsync(string id)
        {
            return await _courses.Find<Course>(course => course.Id == id).FirstOrDefaultAsync();
        }

        // Create a new course
        public async Task<Course> CreateAsync(Course course)
        {
           course.CourseNo = await GenerateUniqueCourseNoAsync();
            await _courses.InsertOneAsync(course);
            return course;
        }

        // Update existing course
        public async Task<bool> UpdateAsync(string id, Course updatedCourse)
        {
            var result = await _courses.ReplaceOneAsync(course => course.Id == id, updatedCourse);
            return result.IsAcknowledged && result.ModifiedCount > 0;
        }

        // Delete course by Id
        public async Task<bool> DeleteAsync(string id)
        {
            var result = await _courses.DeleteOneAsync(course => course.Id == id);
            return result.IsAcknowledged && result.DeletedCount > 0;
        }

        internal void GetById(int id)
        {
            throw new NotImplementedException();
        }
    }
}
