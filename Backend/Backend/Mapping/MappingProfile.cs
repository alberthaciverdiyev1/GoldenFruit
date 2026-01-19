using AutoMapper;
using Backend.Models.Domain;
using Backend.Models.ViewModels;

namespace Backend.Mapping;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<User, UserDto>().ReverseMap();
        CreateMap<Customer, CustomerDto>().ReverseMap();
    }
}