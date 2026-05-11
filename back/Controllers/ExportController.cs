using GoldenFruit.Backend.Database;
using GoldenFruit.Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace GoldenFruit.Backend.Controllers;

[ApiController]
[Route("api/export")]
public class ExportController : ControllerBase
{
    private readonly AppDbContext _context;

    public ExportController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var db = await _context.GetConnection();
        var items = await db.Table<Export>().OrderByDescending(x => x.Date).ToListAsync();
        return Ok(items);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var db = await _context.GetConnection();
        var item = await db.Table<Export>().FirstOrDefaultAsync(x => x.Id == id);
        return item is not null ? Ok(item) : NotFound();
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Export export)
    {
        var db = await _context.GetConnection();
        export.CreatedAt = DateTime.UtcNow;
        await db.InsertAsync(export);
        return Ok(export);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] Export updated)
    {
        var db = await _context.GetConnection();
        var existing = await db.Table<Export>().FirstOrDefaultAsync(x => x.Id == id);
        if (existing is null) return NotFound();

        existing.Date = updated.Date;
        existing.Destination = updated.Destination;
        existing.CustomerName = updated.CustomerName;
        existing.DriverName = updated.DriverName;
        existing.Phone = updated.Phone;
        existing.TruckPlate = updated.TruckPlate;
        existing.ProductType = updated.ProductType;
        existing.PalletCount = updated.PalletCount;
        existing.Quantity = updated.Quantity;
        existing.WeightWithBox = updated.WeightWithBox;
        existing.BoxWeight = updated.BoxWeight;
        existing.NetWeight = updated.NetWeight;
        existing.Price = updated.Price;
        existing.TotalAmount = updated.TotalAmount;
        existing.ExtraCost = updated.ExtraCost;
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
        var item = await db.Table<Export>().FirstOrDefaultAsync(x => x.Id == id);
        if (item is null) return NotFound();
        await db.DeleteAsync(item);
        return Ok();
    }
}
