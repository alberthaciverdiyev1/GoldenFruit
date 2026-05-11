using SQLite;

namespace GoldenFruit.Backend.Models;

public class Balance
{
    [PrimaryKey, AutoIncrement] 
    public int Id { get; set; }
    
    public int CustomerId { get; set; }
    
    [Ignore] 
    public Customer Customer { get; set; }
    
    public string Type { get; set; } // "Sale", "Payment", "Purchase" vb.
    public double Amount { get; set; }
    
    public int? SaleId { get; set; }
    
    [Ignore]
    public Sale? Sale { get; set; }
    
    public int? PurchaseId { get; set; }
    
    [Ignore] 
    public Purchase? Purchase { get; set; }
    
    public DateTime CreatedAt { get; set; }
}