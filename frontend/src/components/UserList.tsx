import React, { useState, useEffect } from 'react';
import {
    Box, Paper, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, IconButton, Chip, CircularProgress
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchUsers, deleteUser } from '../services/api';

import { getUserRolesArray, getUserPermissionsArray } from '../utils/flag-utils';
import {User} from "../types";

interface UserListProps {
    onUserSelected: (user: User) => void;
}

const UserList: React.FC<UserListProps> = ({ onUserSelected }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const MotionTableRow = motion(TableRow);


    const loadUsers = async () => {
        try {
            setLoading(true);
            const loadedUsers = await fetchUsers();
            setUsers(loadedUsers);
            setError('');
        } catch (err) {
            setError('Failed to load users');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await deleteUser(id);
            setUsers(users.filter(user => user.id !== id));
        } catch (err) {
            setError('Failed to delete user');
            console.error(err);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={3} textAlign="center">
                <Typography variant="h6" color="error">{error}</Typography>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <IconButton onClick={loadUsers} color="primary">
                        Retry
                    </IconButton>
                </motion.div>
            </Box>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Paper sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Users ({users.length})
                </Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Roles</TableCell>
                                <TableCell>Permissions</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <AnimatePresence>
                                {users.map(user => (
                                    <MotionTableRow
                                        key={user.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => onUserSelected(user)}
                                    >
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Box display="flex" flexWrap="wrap" gap={0.5}>
                                                {getUserRolesArray(user.roles).map(role => (
                                                    <Chip key={role} label={role} size="small" color="primary" />
                                                ))}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box display="flex" flexWrap="wrap" gap={0.5}>
                                                {getUserPermissionsArray(user.permissions).map(permission => (
                                                    <Chip key={permission} label={permission} size="small" color="secondary" />
                                                ))}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                <IconButton
                                                    color="error"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(user.id);
                                                    }}
                                                >
                                                    Delete
                                                </IconButton>
                                            </motion.div>
                                        </TableCell>
                                    </MotionTableRow>
                                ))}
                            </AnimatePresence>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </motion.div>
    );
};

export default UserList;