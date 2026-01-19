using Backend.Models.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Data.Configurations;

public class CustomerConfiguration:IEntityTypeConfiguration<Customer>   
{
    public void Configure(EntityTypeBuilder<Customer> builder)
    {
        builder.ToTable("Customers");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedOnAdd();
        builder.Property(x => x.Name).IsRequired().HasMaxLength(70);
        builder.Property(x => x.Surname).IsRequired(false).HasMaxLength(255);
        builder.Property(x => x.Email).IsRequired(false).HasMaxLength(255);
        
        builder.Property(x => x.Phone).IsRequired(false).HasMaxLength(20);
        builder.Property(x => x.Address).IsRequired(false).HasMaxLength(255);
        builder.Property(x => x.Image).IsRequired(false);
        
        builder.Property(x=>x.UpdatedAt);
        builder.Property(x=>x.DeletedAt);
    }
}