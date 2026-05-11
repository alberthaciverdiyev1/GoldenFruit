namespace GoldenFruit.Backend.DTOs;

public record BalanceHistoryDTO
{
    public int Id { get; set; }

    public int CustomerId { get; set; }

    public string Type { get; set; } = string.Empty;

    public double Amount { get; set; }

    public int? SaleId { get; set; }

    public int? PurchaseId { get; set; }

    public DateTime CreatedAt { get; set; }
}
