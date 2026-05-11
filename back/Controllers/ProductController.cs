using Microsoft.AspNetCore.Mvc;
using GoldenFruit.Backend.Models;
using GoldenFruit.Backend.Database;
using SQLite;

namespace GoldenFruit.Backend.Controllers;

[ApiController]
[Route("api/product")]
public class ProductController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProductController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var db = await _context.GetConnection();
        var products = await db.Table<Product>().OrderByDescending(x=>x.Id).ToListAsync();
        return Ok(products);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var db = await _context.GetConnection();
        var product = await db.Table<Product>().FirstOrDefaultAsync(x => x.Id == id);
        
        if (product == null) return NotFound();
        return Ok(product);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Product product)
    {
        var db = await _context.GetConnection();
        product.CreatedAt = DateTime.Now;
        
        await db.InsertAsync(product);
        return Ok(product);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Product updatedProduct)
    {
        var db = await _context.GetConnection();
        var existing = await db.Table<Product>().FirstOrDefaultAsync(x => x.Id == id);
        
        if (existing == null) return NotFound();

        updatedProduct.Id = id; 
        await db.UpdateAsync(updatedProduct);
        return Ok(updatedProduct);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var db = await _context.GetConnection();
        var result = await db.DeleteAsync<Product>(id);
        
        if (result == 0) return NotFound();
        return Ok(new { message = "Mehsul silindi" });
    }
}