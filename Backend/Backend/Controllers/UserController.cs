using Backend.Models.ViewModels;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[Route("user")]
public class UserController(IUserService userService) : Controller
{
    [HttpGet("login")]
    public IActionResult Index()
    {
        return View("Login");
    }

    [HttpPost("login"), ValidateAntiForgeryToken()]
    public async Task<IActionResult> Login([FromBody] LoginDto loginRequest)
    {
        var result = await userService.Login(loginRequest);

        if (result == null)
            return Json(new { success = false, message = "Username və ya şifrə səhvdir" });

        return Json(new { success = true, token = result.Token });
    }

    [HttpGet("details/{id:int}")]
    public async Task<IActionResult> Details(long id)
    {
        var user = await userService.Details(id);
        if (user == null) return NotFound();

        return View("Login");
    }
}