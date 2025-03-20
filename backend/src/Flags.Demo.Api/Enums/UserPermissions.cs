namespace Flags.Demo.Api.Enums;

[Flags]
public enum UserPermissions
{
  Read = 1 << 0,
  Write = 1 << 1,
  DirectMessage = 1 << 2,
  CreateGroup = 1 << 3,
  InviteToGroup = 1 << 4,
  KickFromGroup = 1 << 5,
  BanFromGroup = 1 << 6,
  ModerateGroupMessages = 1 << 7,
  PromoteToAdmin = 1 << 8,
  GroupAdmin = InviteToGroup | KickFromGroup | BanFromGroup | ModerateGroupMessages,
  GroupOwner = GroupAdmin | PromoteToAdmin,
}