import { UserCreateRequest, UserUpdateRequest, User } from '../types';

const API_URL = 'http://localhost:5076';

export const fetchUsers = async (): Promise<User[]> => {
    const response = await fetch(`${API_URL}/users`);
    return response.json();
};

export const fetchUser = async (id: string): Promise<User> => {
    const response = await fetch(`${API_URL}/users/${id}`);
    if (!response.ok) throw new Error('User not found');
    return response.json();
};

export const createUser = async (user: UserCreateRequest): Promise<User> => {
    const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });
    return response.json();
};

export const updateUser = async (id: string, user: UserUpdateRequest): Promise<User> => {
    const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });
    return response.json();
};

export const deleteUser = async (id: string): Promise<void> => {
    await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
};

export const checkUserRole = async (id: string, role: number): Promise<{ hasRole: boolean }> => {
    const response = await fetch(`${API_URL}/users/${id}/has-role/${role}`);
    return response.json();
};

export const checkUserPermission = async (id: string, permission: number): Promise<{ hasPermission: boolean }> => {
    const response = await fetch(`${API_URL}/users/${id}/has-permission/${permission}`);
    return response.json();
};