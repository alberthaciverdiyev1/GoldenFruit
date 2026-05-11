namespace GoldenFruit.Backend.DTOs;

public record EmployeeListDTO(
    int Id,
    string Name,
    string Surname,
    string Phone,
    double MonthlySalary,
    DateTime CreatedAt
);

public record EmployeeSaveDTO(
    string Name,
    string Surname,
    string Phone,
    double MonthlySalary
);

public record EmployeeDetailsDTO(
    int Id,
    string Name,
    string Surname,
    string Phone,
    double MonthlySalary,
    DateTime CreatedAt,
    List<SalaryDetailDTO> Salaries
);

public record SalaryDetailDTO(
    int Id,
    double Amount,
    string? Comment,
    DateTime CreatedAt
);

public record SalarySaveDTO(
    int EmployeeId,
    double Amount,
    string? Comment,
    DateTime? CreatedAt
);