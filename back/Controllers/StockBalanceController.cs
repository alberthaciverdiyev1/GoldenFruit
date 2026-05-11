using GoldenFruit.Backend.Database;
using GoldenFruit.Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace GoldenFruit.Backend.Controllers;

[ApiController]
[Route("api/stockbalance")]
public class StockBalanceController : ControllerBase
{
    private readonly AppDbContext _context;

    public StockBalanceController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var db = await _context.GetConnection();
        var items = await db.Table<StockBalance>().OrderByDescending(x => x.Date).ToListAsync();
        return Ok(items);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var db = await _context.GetConnection();
        var item = await db.Table<StockBalance>().FirstOrDefaultAsync(x => x.Id == id);
        return item is not null ? Ok(item) : NotFound();
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] StockBalance balance)
    {
        var db = await _context.GetConnection();
        balance.CreatedAt = DateTime.UtcNow;
        await db.InsertAsync(balance);
        return Ok(balance);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] StockBalance updated)
    {
        var db = await _context.GetConnection();
        var existing = await db.Table<StockBalance>().FirstOrDefaultAsync(x => x.Id == id);
        if (existing is null) return NotFound();

        existing.Date = updated.Date;
        existing.Description = updated.Description;
        existing.Quantity = updated.Quantity;
        existing.NetWeight = updated.NetWeight;
        existing.Amount = updated.Amount;
        existing.RelatedPerson = updated.RelatedPerson;
        existing.Note = updated.Note;

        await db.UpdateAsync(existing);
        return Ok(existing);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var db = await _context.GetConnection();
        var item = await db.Table<StockBalance>().FirstOrDefaultAsync(x => x.Id == id);
        if (item is null) return NotFound();
        await db.DeleteAsync(item);
        return Ok();
    }
}
