using SQLite;

namespace GoldenFruit.Backend.Models;

public class Salary
{
    [PrimaryKey, AutoIncrement]
    public int Id { get; set; }
    
    public double Amount { get; set; }
    public string? Comment { get; set; }

    [Indexed] 
    public int EmployeeId { get; set; }

    [Ignore] 
    public Employee? Employee { get; set; }

    public DateTime CreatedAt { get; set; }
}