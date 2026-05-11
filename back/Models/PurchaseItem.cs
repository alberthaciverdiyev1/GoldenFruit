using SQLite;

namespace GoldenFruit.Backend.Models;

public class PurchaseItem
{
    [PrimaryKey, AutoIncrement]
    public int Id { get; set; }

    [Indexed]
    public int PurchaseId { get; set; }

    [Indexed]
    public int ProductId { get; set; }

    public int Quantity { get; set; }
    public double BoxWeight { get; set; }
    public double WeightWithBox { get; set; }
    public float Weight { get; set; }
    public double Price { get; set; }

    [Ignore]
    public Product? Product { get; set; }

    [Ignore]
    public Purchase? Purchase { get; set; }
}
