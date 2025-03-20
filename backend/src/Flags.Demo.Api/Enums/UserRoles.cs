namespace Flags.Demo.Api.Enums;

[Flags]
public enum UserRoles
{
  Anonymous = 1 << 0,
  PreMember = 1 << 1,
  Member = 1 << 2,
  SubscriberTier1 = 1 << 3,
  SubscriberTier2 = 1 << 4,
  SubscriberTier3 = 1 << 5,
  Admin = 1 << 6,
}