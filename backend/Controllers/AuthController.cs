using Microsoft.AspNetCore.Mvc;
using Student_course_enrollment.Models;
using Student_course_enrollment.Services;
using MongoDB.Driver;

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
public async Task<IActionResult> Login([FromBody] LoginRequest loginUser)
{
    try
    {
        var isValid = await _userService.ValidateCredentialsAsync(loginUser.Username, loginUser.Password);
        if (!isValid)
        {
            Console.WriteLine("Invalid credentials.");
            return Unauthorized("Invalid username or password.");
        }

        var user = await _userService.GetByUsernameAsync(loginUser.Username);
        if (user == null)
        {
            return Unauthorized("User not found.");
        }

        var token = _tokenService.CreateToken(user);
        return Ok(new { token });
    }
    catch (Exception ex)
    {
        Console.WriteLine("Login error: " + ex.Message);
        return StatusCode(500, "Internal server error.");
    }
}

    }
}

// LoginRequest class (outside controller)
public class LoginRequest
{
    public string Username { get; set; } = null!;
    public string Password { get; set; } = null!;
}
