using Backend.Models.ViewModels;

namespace Backend.Services.Interfaces;

public interface ICustomerService
{
    Task<List<CustomerDto>> GetAllAsync();
    Task<CustomerDto?> GetByIdAsync(long id);
    Task CreateAsync(CustomerDto dto);
    Task UpdateAsync(long id, CustomerDto dto);
    Task DeleteAsync(long id);
}