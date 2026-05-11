using GoldenFruit.Backend.Database;
using GoldenFruit.Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace GoldenFruit.Backend.Controllers;

[ApiController]
[Route("api/bag")]
public class BagController : ControllerBase
{
    private readonly AppDbContext _context;

    public BagController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllAsync()
    {
        var db = await _context.GetConnection();
        var bags = await db.Table<Bag>()
            .OrderByDescending(b => b.Date)
            .ToListAsync();
            
        return Ok(bags);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetByIdAsync(int id)
    {
        var db = await _context.GetConnection();
        var bag = await db.Table<Bag>().FirstOrDefaultAsync(b => b.Id == id);
        
        if (bag == null) return NotFound(new { Message = "Qeyd tapılmadı" });
        
        return Ok(bag);
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] Bag bag)
    {
        if (bag == null) return BadRequest();

        var db = await _context.GetConnection();
        
        if (bag.Date == default) bag.Date = DateTime.Now;

        await db.InsertAsync(bag);
        return Ok(new { Message = "Bağ qeydiyyatı uğurla yaradıldı", Data = bag });
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateAsync(int id, [FromBody] Bag updatedBag)
    {
        var db = await _context.GetConnection();
        var existingBag = await db.Table<Bag>().FirstOrDefaultAsync(b => b.Id == id);

        if (existingBag == null) return NotFound(new { Message = "Yenilənəcək qeyd tapılmadı" });

        existingBag.Date = updatedBag.Date;
        existingBag.PersonName = updatedBag.PersonName;
        existingBag.Count = updatedBag.Count;
        existingBag.ReturnedCount = updatedBag.ReturnedCount;
        existingBag.ToBeReturned = updatedBag.ToBeReturned;
        existingBag.RemainingDebt = updatedBag.RemainingDebt;
        existingBag.PaymentAmount = updatedBag.PaymentAmount;
        existingBag.Note = updatedBag.Note;

        await db.UpdateAsync(existingBag);
        return Ok(new { Message = "Məlumatlar yeniləndi" });
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteAsync(int id)
    {
        var db = await _context.GetConnection();
        var bag = await db.Table<Bag>().FirstOrDefaultAsync(b => b.Id == id);
        
        if (bag == null) return NotFound();

        await db.DeleteAsync(bag);
        return Ok(new { Message = "Qeyd silindi" });
    }
}