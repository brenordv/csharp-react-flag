using Flags.Demo.Api.Enums;

namespace Flags.Demo.Api.Models;

public record UserUpdateRequest(
  string Name, 
  string Email, 
  UserRoles? AddRoles = UserRoles.Anonymous, 
  UserRoles? RemoveRoles = UserRoles.Anonymous,
  UserPermissions? AddPermissions = UserPermissions.Read,
  UserPermissions? RemovePermissions = UserPermissions.Read
);