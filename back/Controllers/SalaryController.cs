using GoldenFruit.Backend.Database;
using GoldenFruit.Backend.DTOs;
using GoldenFruit.Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace GoldenFruit.Backend.Controllers;

[ApiController]
[Route("api/salary")]
public class SalaryController : ControllerBase
{
    private readonly AppDbContext _context;

    public SalaryController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] SalarySaveDTO dto)
    {
        var db = await _context.GetConnection();
        var employee = await db.Table<Employee>().FirstOrDefaultAsync(e => e.Id == dto.EmployeeId);
        if (employee == null) return NotFound(new { Message = "İşçi tapılmadı" });

        var newSalary = new Salary
        {
            EmployeeId = dto.EmployeeId,
            Amount = dto.Amount,
            Comment = dto.Comment,
            CreatedAt = dto.CreatedAt ?? DateTime.Now 
        };

        await db.InsertAsync(newSalary);
        return Ok(new { Message = "Ödəniş uğurla qeyd edildi" });
    }
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteAsync(int id)
    {
        var db = await _context.GetConnection();
        
        var salary = await db.Table<Salary>().FirstOrDefaultAsync(s => s.Id == id);
        if (salary == null) return NotFound();

        await db.DeleteAsync(salary);
        return Ok(new { Message = "Ödəniş qeydiyyatı silindi" });
    }

    [HttpGet("employee/{employeeId:int}")]
    public async Task<ActionResult<List<SalaryDetailDTO>>> GetByEmployeeAsync(int employeeId)
    {
        var db = await _context.GetConnection();
        
        var salaries = await db.Table<Salary>()
            .Where(s => s.EmployeeId == employeeId)
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync();

        var result = salaries.Select(s => new SalaryDetailDTO(
            Id: s.Id,
            Amount: s.Amount,
            Comment: s.Comment,
            CreatedAt: s.CreatedAt
        )).ToList();

        return Ok(result);
    }
}