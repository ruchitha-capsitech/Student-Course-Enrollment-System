using Microsoft.AspNetCore.Mvc;
using Student_course_enrollment.Models;
using Student_course_enrollment.Services;

namespace Student_course_enrollment.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly TokenService _tokenService;

        public AuthController(UserService userService, TokenService tokenService)
        {
            _userService = userService;
            _tokenService = tokenService;
        }

        // Login Method [POST]
       [HttpPost("login")]
public async Task<IActionResult> Login([FromBody] User loginUser)
{
    try
    {
        var user = await _userCollection
            .Find(u => u.Username == loginUser.Username && u.Password == loginUser.Password)
            .FirstOrDefaultAsync();

        if (user == null)
        {
            Console.WriteLine("User not found or invalid credentials.");
            return Unauthorized("Invalid username or password.");
        }

        Console.WriteLine("User found: " + user.Username);
        var token = _jwtService.GenerateToken(user);
        return Ok(new { token });
    }
    catch (Exception ex)
    {
        Console.WriteLine("Login error: " + ex.Message);
        return StatusCode(500, "Internal server error.");
    }
}

    // Move LoginRequest outside the controller
    public class LoginRequest
    {
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
    }

