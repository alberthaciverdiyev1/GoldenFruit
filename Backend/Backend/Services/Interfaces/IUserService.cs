using Backend.Models.ViewModels;

namespace Backend.Services.Interfaces;

public interface IUserService
{
    Task<LoginDto?> Login(LoginDto loginRequest);
    Task<UserDto?> Details(long id);
}