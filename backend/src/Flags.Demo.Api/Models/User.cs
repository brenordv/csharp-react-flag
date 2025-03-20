using Flags.Demo.Api.Enums;

namespace Flags.Demo.Api.Models;

public class User
{
  public Guid Id { get; set; }
  public string Name { get; set; } = string.Empty;
  public string Email { get; set; } = string.Empty;
  public UserRoles Roles { get; set; }
  public UserPermissions Permissions { get; set; }
  public DateTime CreatedAt { get; set; }
  public DateTime UpdatedAt { get; set; }
  public DateTime LastLogin { get; set; }
}