using Backend.Models.Domain;
using Backend.Models.ViewModels;

namespace Backend.Repositories.Interfaces;

public interface IUserRepository
{
    Task<LoginDto?> Login(LoginDto loginRequest);
    Task<UserDto?> Details(long id);
}