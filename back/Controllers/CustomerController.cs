using Microsoft.AspNetCore.Mvc;
using GoldenFruit.Backend.Models;
using GoldenFruit.Backend.Database; 
using SQLite;

namespace GoldenFruit.Backend.Controllers;

[ApiController]
[Route("api/customer")]
public class CustomerController : ControllerBase
{
    private readonly AppDbContext _context;

    public CustomerController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("with-balance")]
    public async Task<IActionResult> GetAllWithBalance()
    {
        var db = await _context.GetConnection();
        var customers = await db.Table<Customer>().ToListAsync();
        var balanceMap = (await db.Table<Balance>().ToListAsync())
            .GroupBy(b => b.CustomerId)
            .ToDictionary(g => g.Key, g => g.Sum(b => b.Amount));

        var result = customers.Select(c => new
        {
            c.Id,
            c.Name,
            c.Surname,
            Balance = balanceMap.GetValueOrDefault(c.Id, 0.0)
        }).ToList();

        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var db = await _context.GetConnection();
        var customers = await db.Table<Customer>().ToListAsync();
        return Ok(customers);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var db = await _context.GetConnection();
        var customer = await db.Table<Customer>().FirstOrDefaultAsync(x => x.Id == id);
        
        if (customer == null) return NotFound();
        return Ok(customer);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Customer customer)
    {
        var db = await _context.GetConnection();
        customer.CreatedAt = DateTime.Now;
        
        await db.InsertAsync(customer);
        return Ok(customer);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Customer updatedCustomer)
    {
        var db = await _context.GetConnection();
        var existing = await db.Table<Customer>().FirstOrDefaultAsync(x => x.Id == id);
        
        if (existing == null) return NotFound();

        updatedCustomer.Id = id; 
        await db.UpdateAsync(updatedCustomer);
        return Ok(updatedCustomer);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var db = await _context.GetConnection();
        var result = await db.DeleteAsync<Customer>(id);
        
        if (result == 0) return NotFound();
        return Ok(new { message = "Müşteri silindi" });
    }
}