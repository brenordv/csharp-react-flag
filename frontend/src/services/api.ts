import { UserRoles, UserPermissions } from '../types';

/**
 * Checks if a given flag is present within a bitmask value.
 *
 * @param {number} value - The bitmask value representing roles or permissions.
 * @param {number} flag - The specific role or permission flag to check.
 * @returns {boolean} - Returns `true` if the flag is present in the value, otherwise `false`.
 *
 * @example
 * hasFlag(UserRoles.Admin | UserRoles.Member, UserRoles.Admin); // true
 * hasFlag(UserRoles.Member, UserRoles.Admin); // false
 */
export const hasFlag = (value: number, flag: number): boolean => (value & flag) === flag;

/**
 * Converts a bitmask representing user roles into an array of role names.
 *
 * @param {UserRoles} roles - The bitmask representing a combination of user roles.
 * @returns {string[]} - An array of role names that the user has.
 *
 * @example
 * getUserRolesArray(UserRoles.Admin | UserRoles.Member);
 * // Returns: ["Admin", "Member"]
 */
export const getUserRolesArray = (roles: UserRoles): string[] => {
    const result: string[] = [];

    Object.entries(UserRoles).forEach(([key, value]) => {
        if (typeof value === 'number' && hasFlag(roles, value)) {
            result.push(key);
        }
    });

    return result;
};

/**
 * Converts a bitmask representing user permissions into an array of permission names.
 *
 * @param {UserPermissions} permissions - The bitmask representing a combination of user permissions.
 * @returns {string[]} - An array of permission names that the user has.
 *
 * @example
 * getUserPermissionsArray(UserPermissions.Read | UserPermissions.Write);
 * // Returns: ["Read", "Write"]
 */
export const getUserPermissionsArray = (permissions: UserPermissions): string[] => {
    const result: string[] = [];

    Object.entries(UserPermissions).forEach(([key, value]) => {
        if (typeof value === 'number' && hasFlag(permissions, value)) {
            result.push(key);
        }
    });

    return result;
};

/**
 * Retrieves a list of all possible user roles as an array of objects with labels and values.
 *
 * @returns {Array<{ label: string; value: number }>} - An array of role objects.
 *
 * @example
 * getRoleOptions();
 * // Returns:
 * // [
 * //   { label: "Anonymous", value: 1 },
 * //   { label: "PreMember", value: 2 },
 * //   { label: "Member", value: 4 },
 * //   { label: "SubscriberTier1", value: 8 },
 * //   ...
 * // ]
 */
export const getRoleOptions = (): { label: string; value: number }[] => {
    return Object.entries(UserRoles)
        .filter(([_, value]) => typeof value === 'number')
        .map(([key, value]) => ({
            label: key,
            value: value as number
        }));
};

/**
 * Retrieves a list of all possible user permissions as an array of objects with labels and values.
 *
 * @returns {Array<{ label: string; value: number }>} - An array of permission objects.
 *
 * @example
 * getPermissionOptions();
 * // Returns:
 * // [
 * //   { label: "Read", value: 1 },
 * //   { label: "Write", value: 2 },
 * //   { label: "DirectMessage", value: 4 },
 * //   { label: "CreateGroup", value: 8 },
 * //   ...
 * // ]
 */
export const getPermissionOptions = (): { label: string; value: number }[] => {
    return Object.entries(UserPermissions)
        .filter(([_, value]) => typeof value === 'number')
        .map(([key, value]) => ({
            label: key,
            value: value as number
        }));
};
