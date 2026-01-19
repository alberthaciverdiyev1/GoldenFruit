using AutoMapper;
using Backend.Models.Domain;
using Backend.Models.ViewModels;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;

namespace Backend.Services.Implementations;

public class CustomerService(ICustomerRepository repository, IMapper mapper) : ICustomerService
{
    public async Task<List<CustomerDto>> GetAllAsync()
    {
        var customers = await repository.GetAllAsync();
        return mapper.Map<List<CustomerDto>>(customers);
    }

    public async Task<CustomerDto?> GetByIdAsync(long id)
    {
        var customer = await repository.GetByIdAsync(id);
        return customer is null ? null : mapper.Map<CustomerDto>(customer);
    }


    public async Task CreateAsync(CustomerDto dto)
    {
        var entity = mapper.Map<Customer>(dto);
        await repository.AddAsync(entity);
    }

    public async Task UpdateAsync(long id, CustomerDto dto)
    {
        var customer = await repository.GetByIdAsync(id);
        if (customer is null)
        {
            throw new Exception("Customer not found");
        }

        mapper.Map(dto, customer);
        await repository.UpdateAsync(customer);
    }

    public async Task DeleteAsync(long id)
    {
        var customer = await repository.GetByIdAsync(id);
        if (customer is null)
            throw new Exception("Customer not found");

       // repository.Delete(customer);
    }
    
}