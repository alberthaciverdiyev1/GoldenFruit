namespace Backend.Models.ViewModels;

public record LoginDto(
    long Id,
    string Username,
    string Password,
    string? Token
);