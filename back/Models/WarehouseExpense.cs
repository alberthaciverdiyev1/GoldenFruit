using SQLite;

namespace GoldenFruit.Backend.Models;

public class WarehouseExpense
{
    [PrimaryKey, AutoIncrement]
    public int Id { get; set; }
    public DateTime Date { get; set; }
    public string Name { get; set; }
    public string? Description { get; set; }
    public double? Count { get; set; }
    public double? UnitPrice { get; set; }
    public double TotalAmount { get; set; }
    public double PaidAmount { get; set; }
    public string? Note { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
