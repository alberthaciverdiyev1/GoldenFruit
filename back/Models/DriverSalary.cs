using SQLite;

namespace GoldenFruit.Backend.Models;

public class DriverSalary
{
    [PrimaryKey, AutoIncrement]
    public int Id { get; set; }
    public DateTime Date { get; set; }
    [Indexed]
    public string DriverName { get; set; }
    public double DailyWage { get; set; }
    public double? ExtraTripAmount { get; set; }
    public double TotalAmount { get; set; }
    public double PaidAmount { get; set; }
    public double RemainingDebt { get; set; }
    public string? Note { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
