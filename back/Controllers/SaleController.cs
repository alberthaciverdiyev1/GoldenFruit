using GoldenFruit.Backend.Database;
using GoldenFruit.Backend.DTOs;
using GoldenFruit.Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace GoldenFruit.Backend.Controllers;

[ApiController]
[Route("api/sale")]
public class SaleController : ControllerBase
{
    private readonly AppDbContext _context;

    public SaleController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<SaleListDTO>>> ListAsync()
    {
        var db = await _context.GetConnection();

        var sales = await db.Table<Sale>().ToListAsync();
        var customers = await db.Table<Customer>().ToListAsync();

        var result = sales.Select(s =>
        {
            var customer = customers.FirstOrDefault(c => c.Id == s.CustomerId);
            return new SaleListDTO(
                Id: s.Id,
                CustomerName: customer != null ? $"{customer.Name} {customer.Surname}" : "Bilinmeyen Müşteri",
                TotalQuantity: s.TotalQuantity,
                Type: s.Type,
                TotalPrice: s.TotalPrice,
                TotalWeight: s.TotalWeight,
                CreatedAt: s.CreatedAt
            );
        }).OrderByDescending(x => x.CreatedAt).ToList();

        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] SaleSaveDTO dto)
    {
        var db = await _context.GetConnection();

        var newSale = new Sale
        {
            CustomerId = dto.CustomerId,
            Type = dto.Type,
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now
        };

        double totalPrice = 0;
        int totalQty = 0;
        float totalWeight = 0;

        await db.RunInTransactionAsync(conn =>
        {
            conn.Insert(newSale);

            foreach (var item in dto.Items)
            {
                var saleItem = new SaleItem
                {
                    SaleId = newSale.Id,
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    Price = item.PriceAtSale,
                    Weight = item.Weight
                };
                conn.Insert(saleItem);

                totalPrice += (item.PriceAtSale * item.Quantity);
                totalQty += item.Quantity;
                totalWeight += item.Weight * item.Quantity;

                // Stoktan düş
                var product = conn.Table<Product>().FirstOrDefault(p => p.Id == item.ProductId);
                if (product != null)
                {
                    product.Stock -= item.Quantity;
                    if (product.Stock < 0) product.Stock = 0;
                    conn.Update(product);
                }
            }

            if (dto.Type == "cash")
            {
                var newBalance = new Balance
                {
                    CustomerId = newSale.CustomerId,
                    SaleId = newSale.Id,
                    Amount = totalPrice,
                    Type = "Sale",
                    CreatedAt = DateTime.Now
                };

                conn.Insert(newBalance);
            }

            newSale.TotalPrice = totalPrice;
            newSale.TotalQuantity = totalQty;
            newSale.TotalWeight = totalWeight;
            conn.Update(newSale);
        });

        return Ok(new { Message = "Satış başarıyla kaydedildi", SaleId = newSale.Id });
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetDetailsAsync(int id)
    {
        var db = await _context.GetConnection();

        var sale = await db.Table<Sale>().FirstOrDefaultAsync(s => s.Id == id);
        if (sale == null) return NotFound();

        var customer = await db.Table<Customer>().FirstOrDefaultAsync(c => c.Id == sale.CustomerId);

        // SQLite-net QueryAsync anonymous parameter hatası verdiği için LINQ kullanılıyor
        var allSaleItems = await db.Table<SaleItem>().Where(si => si.SaleId == id).ToListAsync();
        var allProducts = await db.Table<Product>().ToListAsync();

        var itemsWithNames = allSaleItems.Select(si =>
        {
            var p = allProducts.FirstOrDefault(pr => pr.Id == si.ProductId);
            return new SaleItemView
            {
                ProductId = si.ProductId,
                ProductName = p?.Name ?? "Bilinmeyen",
                Quantity = si.Quantity,
                Price = si.Price,
                Weight = si.Weight
            };
        }).ToList();

        var balanceRecords = await db.Table<Balance>().Where(b => b.SaleId == id).ToListAsync();
        var paymentHistory = balanceRecords.Select(b => new BalanceHistoryDTO
        {
            Id = b.Id,
            CustomerId = b.CustomerId,
            Type = b.Type,
            Amount = b.Amount,
            SaleId = b.SaleId,
            PurchaseId = b.PurchaseId,
            CreatedAt = b.CreatedAt
        }).ToList();

        var details = new SaleDetailsDTO(
            CustomerName: $"{customer?.Name} {customer?.Surname}".Trim(),
            TotalQuantity: sale.TotalQuantity,
            Type: sale.Type,
            TotalPrice: sale.TotalPrice,
            TotalWeight: (float)sale.TotalWeight,
            CreatedAt: sale.CreatedAt,
            Items: itemsWithNames.Select(i => new SaleItemDetailsDTO(
                ProductId: i.ProductId,
                ProductName: i.ProductName,
                Quantity: i.Quantity,
                PriceAtSale: i.Price,
                Weight: i.Weight
            )).ToList(),
            PaymentHistory: paymentHistory.ToList()
        );

        return Ok(details);
    }

    [HttpPost("{id:int}/pay")]
    public async Task<IActionResult> PayAsync(int id, [FromBody] SalePayDTO dto)
    {
        var db = await _context.GetConnection();

        var sale = await db.Table<Sale>().FirstOrDefaultAsync(s => s.Id == id);
        if (sale == null) return NotFound(new { Message = "Satış tapılmadı" });
        if (sale.Type != "debt") return BadRequest(new { Message = "Yalnız borc satışları üçün ödəniş edilə bilər" });

        if (dto.Amount <= 0) return BadRequest(new { Message = "Ödəniş miqdarı düzgün deyil" });

        // Mevcut ödenen miktarı kontrol et
        var payments = await db.Table<Balance>()
            .Where(b => b.SaleId == id && b.Type == "Payment")
            .ToListAsync();
        double paidSoFar = payments.Sum(p => Math.Abs(p.Amount));
        double remaining = sale.TotalPrice - paidSoFar;

        if (dto.Amount > remaining)
            return BadRequest(new { Message = $"Ödəniş miqdarı qalan borcdan ({remaining:F2} AZN) çox ola bilməz" });

        var payment = new Balance
        {
            CustomerId = sale.CustomerId,
            SaleId = sale.Id,
            Amount = -dto.Amount,
            Type = "Payment",
            CreatedAt = DateTime.Now
        };

        await db.InsertAsync(payment);

        return Ok(new { Message = "Ödəniş qeydə alındı", PaidAmount = dto.Amount, Remaining = remaining - dto.Amount });
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteAsync(int id)
    {
        var db = await _context.GetConnection();
        await db.DeleteAsync<Sale>(id);
        return Ok(new { Message = "Sale Deleted" });
    }
}
