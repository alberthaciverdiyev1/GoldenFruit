namespace Backend.Models.ViewModels;

public record CustomerDto(
    long Id,
    string Name,
    string Surname,
    string Email,
    string Phone,
    string Address,
    string Image);