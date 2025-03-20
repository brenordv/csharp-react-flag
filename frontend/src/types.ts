export enum UserRoles {
    Anonymous = 1 << 0,
    PreMember = 1 << 1,
    Member = 1 << 2,
    SubscriberTier1 = 1 << 3,
    SubscriberTier2 = 1 << 4,
    SubscriberTier3 = 1 << 5,
    Admin = 1 << 6,
}

export enum UserPermissions {
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

export interface User {
    id: string;
    name: string;
    email: string;
    roles: UserRoles;
    permissions: UserPermissions;
    createdAt: string;
    updatedAt: string;
    lastLogin: string;
}

export interface UserCreateRequest {
    name: string;
    email: string;
    roles: UserRoles;
    permissions: UserPermissions;
}

export interface UserUpdateRequest {
    name?: string;
    email?: string;
    addRoles?: UserRoles;
    removeRoles?: UserRoles;
    addPermissions?: UserPermissions;
    removePermissions?: UserPermissions;
}