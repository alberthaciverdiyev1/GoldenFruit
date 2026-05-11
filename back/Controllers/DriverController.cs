using GoldenFruit.Backend.Database;
using GoldenFruit.Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace GoldenFruit.Backend.Controllers;

[ApiController]
[Route("api/driver")]
public class DriverController : ControllerBase
{
    private readonly AppDbContext _context;

    public DriverController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var db = await _context.GetConnection();
        var items = await db.Table<DriverSalary>().OrderByDescending(x => x.Date).ToListAsync();
        return Ok(items);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var db = await _context.GetConnection();
        var item = await db.Table<DriverSalary>().FirstOrDefaultAsync(x => x.Id == id);
        return item is not null ? Ok(item) : NotFound();
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary()
    {
        var db = await _context.GetConnection();
        var all = await db.Table<DriverSalary>().ToListAsync();
        var summary = all.GroupBy(x => x.DriverName).Select(g => new
        {
            DriverName = g.Key,
            TotalWage = g.Sum(x => x.TotalAmount),
            TotalPaid = g.Sum(x => x.PaidAmount),
            TotalDebt = g.Sum(x => x.RemainingDebt),
            EntryCount = g.Count()
        }).OrderByDescending(x => x.TotalWage).ToList();
        return Ok(summary);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] DriverSalary salary)
    {
        var db = await _context.GetConnection();
        salary.CreatedAt = DateTime.UtcNow;
        await db.InsertAsync(salary);
        return Ok(salary);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] DriverSalary updated)
    {
        var db = await _context.GetConnection();
        var existing = await db.Table<DriverSalary>().FirstOrDefaultAsync(x => x.Id == id);
        if (existing is null) return NotFound();

        existing.Date = updated.Date;
        existing.DriverName = updated.DriverName;
        existing.DailyWage = updated.DailyWage;
        existing.ExtraTripAmount = updated.ExtraTripAmount;
        existing.TotalAmount = updated.TotalAmount;
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
        var item = await db.Table<DriverSalary>().FirstOrDefaultAsync(x => x.Id == id);
        if (item is null) return NotFound();
        await db.DeleteAsync(item);
        return Ok();
    }
}
