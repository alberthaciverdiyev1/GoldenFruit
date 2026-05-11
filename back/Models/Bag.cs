using System.ComponentModel.DataAnnotations;
using SQLite;

namespace GoldenFruit.Backend.Models;

[Table("Bags")]
public class Bag
{
    [PrimaryKey, AutoIncrement] public int Id { get; set; }

    [Indexed] public DateTime Date { get; set; }
    [Required] public string PersonName { get; set; }

    public int Count { get; set; }

    public int ReturnedCount { get; set; }

    public int ToBeReturned { get; set; }

    public double RemainingDebt { get; set; }

    public double PaymentAmount { get; set; }

    public string? Note { get; set; }
}