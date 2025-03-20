import { UserRoles, UserPermissions } from '../types';

export const hasFlag = (value: number, flag: number): boolean => (value & flag) === flag;

export const getUserRolesArray = (roles: UserRoles): string[] => {
    const result: string[] = [];

    Object.entries(UserRoles).forEach(([key, value]) => {
        if (typeof value === 'number' && hasFlag(roles, value)) {
            result.push(key);
        }
    });

    return result;
};

export const getUserPermissionsArray = (permissions: UserPermissions): string[] => {
    const result: string[] = [];

    Object.entries(UserPermissions).forEach(([key, value]) => {
        if (typeof value === 'number' && hasFlag(permissions, value)) {
            result.push(key);
        }
    });

    return result;
};

export const getRoleOptions = (): { label: string; value: number }[] => {
    return Object.entries(UserRoles)
        .filter(([_, value]) => typeof value === 'number')
        .map(([key, value]) => ({
            label: key,
            value: value as number
        }));
};

export const getPermissionOptions = (): { label: string; value: number }[] => {
    return Object.entries(UserPermissions)
        .filter(([_, value]) => typeof value === 'number')
        .map(([key, value]) => ({
            label: key,
            value: value as number
        }));
};