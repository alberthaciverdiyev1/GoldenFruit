using SQLite;

namespace GoldenFruit.Backend.Models;

public class SupplierAdvance
{
    [PrimaryKey, AutoIncrement]
    public int Id { get; set; }
    public DateTime Date { get; set; }
    public string Sender { get; set; }
    [Indexed]
    public int? CustomerId { get; set; }
    public string ReceiverName { get; set; }
    public double Amount { get; set; }
    public double PaidAmount { get; set; }
    public double RemainingDebt { get; set; }
    public string? Note { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Ignore]
    public Customer? Customer { get; set; }
}
