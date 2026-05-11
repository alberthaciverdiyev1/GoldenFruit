namespace GoldenFruit.Backend.DTOs;


public class PurchaseSaveDTO
{
    public int CustomerId { get; set; }
    public List<PurchaseItemSaveDTO> Items { get; set; } = new();
}

public class PurchaseItemSaveDTO
{
    public int ProductId { get; set; }
    public int Quantity { get; set; }

    // Unit price (1 product price)
    public double Price { get; set; }

    public float Weight { get; set; }
    public double BoxWeight { get; set; }
    public double WeightWithBox { get; set; }
}

public class PurchaseListDTO
{
    public int Id { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }

    public int TotalQuantity { get; set; }
    public double TotalPrice { get; set; }
}
public class PurchaseDetailsDTO
{
    public string CustomerName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }

    public int TotalQuantity { get; set; }
    public double TotalPrice { get; set; }
    public double TotalWeight { get; set; }

    public List<PurchaseItemDetailsDTO> Items { get; set; } = new();
}

public class PurchaseItemDetailsDTO
{
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;

    public int Quantity { get; set; }
    public double Price { get; set; }

    public float Weight { get; set; }
    public double BoxWeight { get; set; }
    public double WeightWithBox { get; set; }
}