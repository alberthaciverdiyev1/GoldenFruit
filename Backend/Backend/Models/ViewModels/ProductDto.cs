namespace Backend.Models.ViewModels;

public record ProductDto(long Id, string Name,string Description, decimal Price, int Barcode, string Image);
