using SQLite;

namespace GoldenFruit.Backend.Models;

public class Export
{
    [PrimaryKey, AutoIncrement]
    public int Id { get; set; }
    public DateTime Date { get; set; }
    public string Destination { get; set; }
    public string CustomerName { get; set; }
    public string? DriverName { get; set; }
    public string? Phone { get; set; }
    public string? TruckPlate { get; set; }
    public string? ProductType { get; set; }
    public int? PalletCount { get; set; }
    public double Quantity { get; set; }
    public double WeightWithBox { get; set; }
    public double BoxWeight { get; set; }
    public double NetWeight { get; set; }
    public double Price { get; set; }
    public double TotalAmount { get; set; }
    public double? ExtraCost { get; set; }
    public double PaidAmount { get; set; }
    public double RemainingDebt { get; set; }
    public string? Note { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
