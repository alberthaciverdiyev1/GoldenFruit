using AutoMapper;
using Backend.Models.ViewModels;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;

namespace Backend.Services.Implementations;

public class UserService(IUserRepository userRepository, IMapper mapper) : IUserService
{
    public async Task<LoginDto?> Login(LoginDto loginRequest)
    {
        var result = await userRepository.Login(loginRequest);

        return result;
    }


    public async Task<UserDto?> Details(long id)
    {
        var user = await userRepository.Details(id);
        if (user == null) return null;

        return mapper.Map<UserDto>(user);
    }
}
