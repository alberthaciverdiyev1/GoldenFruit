using Backend.Data;

namespace Backend.Repositories.Implementations.Base;

public interface IBaseRepository<T> where T : class
{
    Task<T?> GetByIdAsync(long id);
    Task<IEnumerable<T>> GetAllAsync();
    Task<T> CreateAsync(T entity);
    Task<T> UpdateAsync(T entity);
    Task<bool> Delete(long id);
}