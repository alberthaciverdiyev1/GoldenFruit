using GoldenFruit.Backend.Database;
using GoldenFruit.Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace GoldenFruit.Backend.Controllers;

[ApiController]
[Route("api/expense")]
public class ExpenseController : ControllerBase
{
    private readonly AppDbContext _context;

    public ExpenseController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var db = await _context.GetConnection();
        var items = await db.Table<WarehouseExpense>().OrderByDescending(x => x.Date).ToListAsync();
        return Ok(items);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var db = await _context.GetConnection();
        var item = await db.Table<WarehouseExpense>().FirstOrDefaultAsync(x => x.Id == id);
        return item is not null ? Ok(item) : NotFound();
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] WarehouseExpense expense)
    {
        var db = await _context.GetConnection();
        expense.CreatedAt = DateTime.UtcNow;
        await db.InsertAsync(expense);
        return Ok(expense);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] WarehouseExpense updated)
    {
        var db = await _context.GetConnection();
        var existing = await db.Table<WarehouseExpense>().FirstOrDefaultAsync(x => x.Id == id);
        if (existing is null) return NotFound();

        existing.Date = updated.Date;
        existing.Name = updated.Name;
        existing.Description = updated.Description;
        existing.Count = updated.Count;
        existing.UnitPrice = updated.UnitPrice;
        existing.TotalAmount = updated.TotalAmount;
        existing.PaidAmount = updated.PaidAmount;
        existing.Note = updated.Note;

        await db.UpdateAsync(existing);
        return Ok(existing);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var db = await _context.GetConnection();
        var item = await db.Table<WarehouseExpense>().FirstOrDefaultAsync(x => x.Id == id);
        if (item is null) return NotFound();
        await db.DeleteAsync(item);
        return Ok();
    }
}
