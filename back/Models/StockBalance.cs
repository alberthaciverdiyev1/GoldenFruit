using SQLite;

namespace GoldenFruit.Backend.Models;

public class StockBalance
{
    [PrimaryKey, AutoIncrement]
    public int Id { get; set; }
    public DateTime Date { get; set; }
    public string Description { get; set; }
    public double? Quantity { get; set; }
    public double? NetWeight { get; set; }
    public double? Amount { get; set; }
    public string? RelatedPerson { get; set; }
    public string? Note { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
