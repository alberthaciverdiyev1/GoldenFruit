using SQLite;

namespace GoldenFruit.Backend.Models;

public class SaleItem
{
    [PrimaryKey, AutoIncrement]
    public int Id { get; set; }
    
    [Indexed]
    public int SaleId { get; set; }
    
    [Indexed]
    public int ProductId { get; set; }

    public int Quantity { get; set; }
    public float Weight { get; set; }
    public double Price { get; set; }

    [Ignore]
    public Product? Product { get; set; }
    
    [Ignore]
    public Sale? Sale { get; set; }
}