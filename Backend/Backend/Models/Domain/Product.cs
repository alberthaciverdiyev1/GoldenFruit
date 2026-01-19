namespace Backend.Models.Domain;

public class Product : IBaseModel
{
    public long Id { get; set; }
    
    public string? Name { get; set; }
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public string? Barcode { get; set; }
    public string? Image { get; set; }
    
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime DeletedAt { get; set; }
}