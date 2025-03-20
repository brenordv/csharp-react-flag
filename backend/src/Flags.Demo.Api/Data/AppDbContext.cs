using Flags.Demo.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Flags.Demo.Api.Data;

public class AppDbContext : DbContext
{
  public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
  {
  }

  public DbSet<User> Users { get; set; } = null!;

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    modelBuilder.Entity<User>(entity =>
    {
      entity.HasKey(e => e.Id);
      entity.Property(e => e.Roles).HasConversion<int>();
      entity.Property(e => e.Permissions).HasConversion<int>();
    });
  }
}