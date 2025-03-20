using Flags.Demo.Api.Enums;

namespace Flags.Demo.Api.Models;

public record UserCreateRequest(string Name, string Email, UserRoles Roles, UserPermissions Permissions);