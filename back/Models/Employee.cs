using SQLite;

namespace GoldenFruit.Backend.Models;

public class Employee
{
    [PrimaryKey, AutoIncrement] 
    public int Id { get; set; }
    
    [Indexed] 
    public string Name { get; set; }
    
    public string? Surname { get; set; }
    public string? Phone { get; set; }
    
    public double MonthlySalary { get; set; }

    [Ignore] 
    public IEnumerable<Salary>? Salaries { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}