using GoldenFruit.Backend.Database;
using GoldenFruit.Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace GoldenFruit.Backend.Controllers;

[ApiController]
[Route("api/advance")]
public class AdvanceController : ControllerBase
{
    private readonly AppDbContext _context;

    public AdvanceController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var db = await _context.GetConnection();
        var items = await db.Table<SupplierAdvance>().OrderByDescending(x => x.Date).ToListAsync();

        var customerIds = items.Where(x => x.CustomerId.HasValue).Select(x => x.CustomerId!.Value).Distinct();
        var customers = await db.Table<Customer>().ToListAsync();
        var customerLookup = customers.ToDictionary(x => x.Id);

        foreach (var item in items)
        {
            if (item.CustomerId.HasValue && customerLookup.TryGetValue(item.CustomerId.Value, out var c))
                item.Customer = c;
        }

        return Ok(items);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var db = await _context.GetConnection();
        var item = await db.Table<SupplierAdvance>().FirstOrDefaultAsync(x => x.Id == id);
        if (item is null) return NotFound();

        if (item.CustomerId.HasValue)
            item.Customer = await db.Table<Customer>().FirstOrDefaultAsync(x => x.Id == item.CustomerId.Value);

        return Ok(item);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] SupplierAdvance advance)
    {
        var db = await _context.GetConnection();
        advance.CreatedAt = DateTime.UtcNow;
        await db.InsertAsync(advance);
        return Ok(advance);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] SupplierAdvance updated)
    {
        var db = await _context.GetConnection();
        var existing = await db.Table<SupplierAdvance>().FirstOrDefaultAsync(x => x.Id == id);
        if (existing is null) return NotFound();

        existing.Date = updated.Date;
        existing.Sender = updated.Sender;
        existing.CustomerId = updated.CustomerId;
        existing.ReceiverName = updated.ReceiverName;
        existing.Amount = updated.Amount;
        existing.PaidAmount = updated.PaidAmount;
        existing.RemainingDebt = updated.RemainingDebt;
        existing.Note = updated.Note;

        await db.UpdateAsync(existing);
        return Ok(existing);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var db = await _context.GetConnection();
        var item = await db.Table<SupplierAdvance>().FirstOrDefaultAsync(x => x.Id == id);
        if (item is null) return NotFound();
        await db.DeleteAsync(item);
        return Ok();
    }
}
