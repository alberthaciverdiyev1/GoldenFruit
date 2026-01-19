using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Backend.Data;
using Backend.Models.Domain;
using Backend.Models.ViewModels;
using Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Backend.Repositories.Implementations;

public class UserRepository(AppDbContext context, IConfiguration config) : IUserRepository
{
    public async Task<LoginDto?> Login(LoginDto loginRequest)
    {
        var user = await context.Users
            .FirstOrDefaultAsync(u =>
                u.Username == loginRequest.Username &&
                u.Password == loginRequest.Password);

        if (user == null)
            return null;

        var token = GenerateToken(user);

        return loginRequest with { Id = user.Id, Token = token };
    }

    public async Task<UserDto?> Details(long id)
    {
        var user = await context.Users.FindAsync(id);
        if (user == null) return null;

        return new UserDto(user.Id, user.Username!);
    }

    private string GenerateToken(User user)
    {
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.UniqueName, user.Username!)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: config["Jwt:Issuer"],
            audience: config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(2),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}