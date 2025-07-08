using MongoDB.Driver;
using Student_course_enrollment.Models;

namespace Student_course_enrollment.Services
{
    public class UserService
    {
        private readonly IMongoCollection<User> _users;
        //For mongodb database connection
        public UserService(IMongoDatabase database)
        {
            _users = database.GetCollection<User>("Users");
        }
        //to check whether user is there or not
        public async Task<User?> GetByUsernameAsync(string Username)
        {
            return await _users.Find(u => u.Username == Username).FirstOrDefaultAsync();
        }
        //FOR VALIDATION
        public async Task<bool> ValidateCredentialsAsync(string Username, string Password)
        {
            var user = await GetByUsernameAsync(Username);
            return user != null && user.Password == Password;
        }
        //OPTIONAL TO CREATE USER 
        public async Task CreateUserAsync(User user)
        {
            await _users.InsertOneAsync(user);
        }
    }
}
