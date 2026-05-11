using System;
using System.Collections.Generic;
using SQLite;

namespace GoldenFruit.Backend.Models;

public class Sale
{
    [PrimaryKey, AutoIncrement]
    public int Id { get; set; }
    
    [Indexed]
    public int CustomerId { get; set; }
    
    public string Type { get; set; }

    public int TotalQuantity { get; set; }
    public double TotalPrice { get; set; }
    public float TotalWeight { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    [Ignore]
    public Customer? Customer { get; set; }

    [Ignore]
    public List<SaleItem> Items { get; set; } = new();
}