using Backend.Models.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Data.Configurations;

public class UserConfiguration: IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedOnAdd();
        builder.Property(x => x.Username).IsRequired();
        builder.Property(x => x.Password).IsRequired();
        builder.Property(x=>x.CreatedAt).IsRequired().HasDefaultValue(DateTime.Now) ;
        builder.Property(x=>x.UpdatedAt);
        builder.Property(x=>x.DeletedAt);
        builder.HasIndex(x => x.Username).IsUnique();
    }
}