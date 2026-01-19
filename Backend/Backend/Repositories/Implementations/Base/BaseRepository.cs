using Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories.Implementations.Base;

public class BaseRepository<T>(AppDbContext context) : IBaseRepository<T>
    where T : class
{
    protected readonly AppDbContext Context = context;
    protected readonly DbSet<T> DbSet = context.Set<T>();

    public async Task<T?> GetByIdAsync(long id)
    {
        return await DbSet.FindAsync(id);
    }

    public async Task<IEnumerable<T>> GetAllAsync()
    {
        return await DbSet.ToListAsync();
    }

    public async Task<T> CreateAsync(T entity)
    {
        await DbSet.AddAsync(entity);
        await Context.SaveChangesAsync();
        return entity;
    }

    public async Task<T> UpdateAsync(T entity)
    {
        DbSet.Update(entity);
        await Context.SaveChangesAsync();
        return entity;
    }

    public async Task<bool> Delete(long id)
    {
        var entity = await GetByIdAsync(id);
        if (entity is null)
            return false;

        DbSet.Remove(entity);
        await Context.SaveChangesAsync();
        return true;
    }
}