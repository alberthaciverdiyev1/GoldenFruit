using GoldenFruit.Backend.Database;
using GoldenFruit.Backend.DTOs;
using GoldenFruit.Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace GoldenFruit.Backend.Controllers;

[ApiController]
[Route("api/purchase")]
public class PurchaseController : ControllerBase
{
    private readonly AppDbContext _context;

    public PurchaseController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<PurchaseListDTO>>> ListAsync()
    {
        var db = await _context.GetConnection();

        var purchases = await db.Table<Purchase>().ToListAsync();
        var customers = await db.Table<Customer>().ToListAsync();
        var items = await db.Table<PurchaseItem>().ToListAsync();

        var result = purchases.Select(p =>
        {
            var customer = customers.FirstOrDefault(c => c.Id == p.CustomerId);
            var purchaseItems = items.Where(i => i.PurchaseId == p.Id).ToList();

            return new PurchaseListDTO
            {
                Id = p.Id,
                CustomerName = customer != null
                    ? $"{customer.Name} {customer.Surname}"
                    : "Bilinmeyen Müşteri",
                CreatedAt = p.CreatedAt,
                TotalQuantity = purchaseItems.Sum(i => i.Quantity),
                TotalPrice = purchaseItems.Sum(i => i.Price * i.Quantity)
            };
        })
        .OrderByDescending(x => x.CreatedAt)
        .ToList();

        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] PurchaseSaveDTO dto)
    {
        var db = await _context.GetConnection();

        var newPurchase = new Purchase
        {
            CustomerId = dto.CustomerId,
            CreatedAt = DateTime.UtcNow
        };

        await db.RunInTransactionAsync(conn =>
        {
            conn.Insert(newPurchase);

            double totalPrice = 0;
            int totalQty = 0;

            foreach (var item in dto.Items)
            {
                var purchaseItem = new PurchaseItem
                {
                    PurchaseId = newPurchase.Id,
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    Price = item.Price,
                    Weight = item.Weight,
                    BoxWeight = item.BoxWeight,
                    WeightWithBox = item.WeightWithBox
                };

                conn.Insert(purchaseItem);

                totalPrice += item.Price * item.Quantity;
                totalQty += item.Quantity;

                // Stoktan artır
                var product = conn.Table<Product>().FirstOrDefault(p => p.Id == item.ProductId);
                if (product != null)
                {
                    product.Stock += item.Quantity;
                    conn.Update(product);
                }
            }

            conn.Insert(new Balance
            {
                CustomerId = newPurchase.CustomerId,
                PurchaseId = newPurchase.Id,
                Amount = totalPrice,
                Type = "Purchase",
                CreatedAt = DateTime.UtcNow
            });

            conn.Update(newPurchase);
        });

        return Ok(new
        {
            Message = "Purchase başarıyla kaydedildi",
            PurchaseId = newPurchase.Id
        });
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetDetailsAsync(int id)
    {
        var db = await _context.GetConnection();

        var purchase = await db.Table<Purchase>()
            .FirstOrDefaultAsync(p => p.Id == id);

        if (purchase == null)
            return NotFound();

        var customer = await db.Table<Customer>()
            .FirstOrDefaultAsync(c => c.Id == purchase.CustomerId);

        var items = await db.Table<PurchaseItem>()
            .Where(i => i.PurchaseId == id)
            .ToListAsync();

        var products = await db.Table<Product>().ToListAsync();

        var resultItems = items.Select(i =>
        {
            var product = products.FirstOrDefault(p => p.Id == i.ProductId);

            return new PurchaseItemDetailsDTO
            {
                ProductId = i.ProductId,
                ProductName = product?.Name ?? "Unknown",
                Quantity = i.Quantity,
                Price = i.Price,
                Weight = i.Weight,
                BoxWeight = i.BoxWeight,
                WeightWithBox = i.WeightWithBox
            };
        }).ToList();

        var details = new PurchaseDetailsDTO
        {
            CustomerName = $"{customer?.Name} {customer?.Surname}",
            CreatedAt = purchase.CreatedAt,
            TotalQuantity = items.Sum(i => i.Quantity),
            TotalPrice = items.Sum(i => i.Price * i.Quantity),
            TotalWeight = items.Sum(i => i.WeightWithBox),
            Items = resultItems
        };

        return Ok(details);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteAsync(int id)
    {
        var db = await _context.GetConnection();

        var items = await db.Table<PurchaseItem>()
            .Where(x => x.PurchaseId == id)
            .ToListAsync();

        foreach (var item in items)
            await db.DeleteAsync(item);

        await db.DeleteAsync<Purchase>(id);

        return Ok(new { Message = "Purchase silindi" });
    }
}
