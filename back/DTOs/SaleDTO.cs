using GoldenFruit.Backend.Models;

namespace GoldenFruit.Backend.DTOs;

public record SaleListDTO(
    int Id,
    string CustomerName,
    int TotalQuantity,
    string Type,
    double TotalPrice,
    float TotalWeight,
    DateTime CreatedAt
);

public record SaleSaveDTO(
    int? Id, 
    int CustomerId,
    string Type,
    List<SaleItemDTO> Items
);

public record SaleItemDTO(
    int ProductId,
    int Quantity,
    double PriceAtSale, 
    float Weight
);

public record SalePayDTO(double Amount);

public record SaleItemDetailsDTO(
    int ProductId,
    string ProductName,
    int Quantity,
    double PriceAtSale, 
    float Weight
);

public class SaleItemView : SaleItem {
    public string ProductName { get; set; }
}

public record SaleDetailsDTO(
    string CustomerName,
    int TotalQuantity,
    double TotalPrice,
    string Type,
    float TotalWeight,
    DateTime CreatedAt,
    List<SaleItemDetailsDTO> Items,
    List<BalanceHistoryDTO> PaymentHistory
);