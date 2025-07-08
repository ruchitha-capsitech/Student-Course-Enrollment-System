using MongoDB.Driver;
using Student_course_enrollment.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
namespace Student_course_enrollment.Services
{
  
    public class StudentService 
    {

        private readonly IMongoCollection<Student> _students;
        //To enabvle mongodb connection
        public StudentService(IMongoDatabase database)
        {
            _students = database.GetCollection<Student>("Students");
        }
        //function to generate unique id for rollnumber 
        private async Task<int> GenerateUniqueStudentRollNoAsync()
        {
            var random = new Random();
            int newRollNo;

            do
            {
                newRollNo = random.Next(1, 51); // Generates a number between 1 and 50
            }
            while (await _students.Find(s => s.StudentRollNo == newRollNo).AnyAsync());

            return newRollNo;
        }


        //GET ALL METHOD LOGIC
        public async Task<List<Student>> GetAllAsync()
        {
            return await _students.Find(student => true).ToListAsync();
        }

        // Get a student by Id
        public async Task<Student?> GetByIdAsync(string id)
        {
            return await _students.Find<Student>(student => student.Id == id).FirstOrDefaultAsync();
        }

        // Create a new student{modified}
        public async Task<Student> CreateAsync(Student student)
        {
            student.StudentRollNo = await GenerateUniqueStudentRollNoAsync();
            await _students.InsertOneAsync(student);
            return student;
        }

        // Update existing student
        public async Task<bool> UpdateAsync(string id, Student updatedStudent)
        {
            var result = await _students.ReplaceOneAsync(student => student.Id == id, updatedStudent);
            return result.IsAcknowledged && result.ModifiedCount > 0;
        }

        // Delete student by Id
        public async Task<bool> DeleteAsync(string id)
        {
            var result = await _students.DeleteOneAsync(student => student.Id == id);
            return result.IsAcknowledged && result.DeletedCount > 0;
        }

        //internal async Task GetByIdAsync(int id)
        //{
        //    throw new NotImplementedException();
        //}
    }
}
