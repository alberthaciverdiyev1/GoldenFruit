using SQLite;

namespace GoldenFruit.Backend.Models;

public class Purchase
{
    [PrimaryKey, AutoIncrement]
    public int Id { get; set; }
    public int CustomerId { get; set; }
    public DateTime CreatedAt { get; set; } =  DateTime.UtcNow;
    
    [Ignore]
    public Customer Customer { get; set; }
    [Ignore]
    public List<PurchaseItem> Items { get; set; } = new();
}