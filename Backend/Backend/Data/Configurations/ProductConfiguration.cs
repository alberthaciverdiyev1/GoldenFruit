using Backend.Models.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Data.Configurations;

public class ProductConfiguration:IEntityTypeConfiguration<Product>
{
   
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            builder.ToTable("Products");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id).ValueGeneratedOnAdd();
            builder.Property(x => x.Name).IsRequired().HasMaxLength(70);
            builder.Property(x => x.Description).IsRequired(false).HasMaxLength(500);
            builder.Property(x => x.Price).IsRequired();
            builder.Property(x => x.Barcode).IsRequired(false).HasMaxLength(50);
            builder.Property(x => x.Image).IsRequired(false);

            builder.Property(x=>x.CreatedAt).IsRequired().HasDefaultValue(DateTime.Now) ;
            builder.Property(x=>x.UpdatedAt);
            builder.Property(x=>x.DeletedAt);
     
    }
}