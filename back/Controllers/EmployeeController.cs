using GoldenFruit.Backend.Database;
using GoldenFruit.Backend.DTOs;
using GoldenFruit.Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace GoldenFruit.Backend.Controllers;

[ApiController]
[Route("api/employee")]
public class EmployeeController : ControllerBase
{
    private readonly AppDbContext _context;

    public EmployeeController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<EmployeeListDTO>>> ListAsync()
    {
        var db = await _context.GetConnection();
        var employees = await db.Table<Employee>().ToListAsync();

        var result = employees.Select(e => new EmployeeListDTO(
            Id: e.Id,
            Name:e.Name,
            Surname: e.Surname,
            Phone: e.Phone ?? "-",
            MonthlySalary: e.MonthlySalary,
            CreatedAt: e.CreatedAt
        )).OrderBy(x => x.CreatedAt).ToList();

        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] EmployeeSaveDTO dto)
    {
        var db = await _context.GetConnection();

        var newEmployee = new Employee
        {
            Name = dto.Name,
            Surname = dto.Surname,
            Phone = dto.Phone,
            MonthlySalary = dto.MonthlySalary,
            CreatedAt = DateTime.Now
        };

        await db.InsertAsync(newEmployee);
        return Ok(new { Message = "İşçi uğurla əlavə edildi", EmployeeId = newEmployee.Id });
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetDetailsAsync(int id)
    {
        var db = await _context.GetConnection();

        var employee = await db.Table<Employee>().FirstOrDefaultAsync(e => e.Id == id);
        if (employee == null) return NotFound(new { Message = "İşçi tapılmadı" });

        var salaries = await db.Table<Salary>()
            .Where(s => s.EmployeeId == id)
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync();

        var details = new EmployeeDetailsDTO(
            Id: employee.Id,
            Name: employee.Name,
            Surname: employee.Surname,
            Phone: employee.Phone,
            MonthlySalary: (double)(employee.MonthlySalary),
            CreatedAt: employee.CreatedAt,
            Salaries: salaries.Select(s => new SalaryDetailDTO(
                Id: s.Id,
                Amount: s.Amount,
                Comment: s.Comment,
                CreatedAt: s.CreatedAt
            )).ToList()
        );

        return Ok(details);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateAsync(int id, [FromBody] EmployeeSaveDTO dto)
    {
        var db = await _context.GetConnection();

        var employee = await db.Table<Employee>().FirstOrDefaultAsync(e => e.Id == id);
        if (employee == null) return NotFound();

        employee.Name = dto.Name;
        employee.Surname = dto.Surname;
        employee.Phone = dto.Phone;
        employee.MonthlySalary = dto.MonthlySalary;

        await db.UpdateAsync(employee);
        return Ok(new { Message = "Məlumatlar yeniləndi" });
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteAsync(int id)
    {
        var db = await _context.GetConnection();

        await db.RunInTransactionAsync(conn =>
        {
            var salaryQuery = "DELETE FROM Salary WHERE EmployeeId = ?";
            conn.Execute(salaryQuery, id);

            conn.Delete<Employee>(id);
        });

        return Ok(new { Message = "İşçi və bağlı məlumatlar silindi" });
    }
}