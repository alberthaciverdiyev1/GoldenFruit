using System.ComponentModel.DataAnnotations;
using SQLite;

namespace GoldenFruit.Backend.Models;

public class Product
{
    [PrimaryKey, AutoIncrement]
    public int Id { get; set; }
    [Required]
    public string? Name { get; set; }
    [Required]
    public int Stock { get; set; }
    [Required]
    public double BuyingPrice { get; set; }
    public double SellingPrice { get; set; }
    public double Weight { get; set; }
    public DateTime CreatedAt {get; set;}
}
