using Backend.Data;
using Backend.Models.Domain;
using Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories.Implementations;

public class CustomerRepository(AppDbContext context) : IBaseRepository<Customer>, ICustomerRepository
{
    public async Task<Customer?> GetByIdAsync(long id)
    {
        return await context.Customers.FindAsync(id);
    }

    public async Task<IEnumerable<Customer>> GetAllAsync()
    {
        return await context.Customers.AsNoTracking().ToListAsync();
    }

    public async Task<Customer> AddAsync(Customer entity)
    {
        context.Customers.Add(entity);
        await context.SaveChangesAsync();
        return entity;
    }

    public async Task<Customer> UpdateAsync(Customer entity)
    {
        context.Customers.Update(entity);
        await context.SaveChangesAsync();
        return entity;
    }

    public async Task<bool> Delete(long id)
    {
        var customer = await context.Customers.FindAsync(id);
        if (customer is null)
            return false;

        context.Customers.Remove(customer);
        await context.SaveChangesAsync();
        return true;
    }
}