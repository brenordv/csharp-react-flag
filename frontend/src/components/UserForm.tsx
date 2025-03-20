import React, { useState } from 'react';
import {
    Box, Paper, Typography, TextField, Button, FormControl,
    FormGroup, FormControlLabel, Checkbox, CircularProgress, Alert
} from '@mui/material';
import { motion } from 'framer-motion';
import { createUser } from '../services/api';
import { UserCreateRequest, UserRoles, UserPermissions } from '../types';
import { getRoleOptions, getPermissionOptions } from '../utils/flag-utils';

interface UserFormProps {
    onComplete: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ onComplete }) => {
    const [formData, setFormData] = useState<UserCreateRequest>({
        name: 'Test User',
        email: 'test@example.com',
        roles: UserRoles.Member,
        permissions: UserPermissions.Read | UserPermissions.Write
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const roleOptions = getRoleOptions();
    const permissionOptions = getPermissionOptions();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRoleToggle = (roleValue: number) => {
        const newRoles = formData.roles ^ roleValue; // XOR to toggle bit
        setFormData({ ...formData, roles: newRoles });
    };

    const handlePermissionToggle = (permissionValue: number) => {
        const newPermissions = formData.permissions ^ permissionValue; // XOR to toggle bit
        setFormData({ ...formData, permissions: newPermissions });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await createUser(formData);
            setSuccess(true);
            setTimeout(() => {
                onComplete();
            }, 1500);
        } catch (err) {
            setError('Failed to create user');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Paper sx={{ p: 4, borderRadius: 2, maxWidth: 800, margin: '0 auto' }}>
                <Typography variant="h5" gutterBottom component="div">
                    Create New User
                </Typography>

                {success && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Alert severity="success" sx={{ mb: 2 }}>
                            User created successfully!
                        </Alert>
                    </motion.div>
                )}

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />

                    <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                        Roles
                    </Typography>
                    <FormControl component="fieldset">
                        <FormGroup row>
                            {roleOptions.map((role) => (
                                <motion.div
                                    key={role.value}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={(formData.roles & role.value) === role.value}
                                                onChange={() => handleRoleToggle(role.value)}
                                            />
                                        }
                                        label={role.label}
                                    />
                                </motion.div>
                            ))}
                        </FormGroup>
                    </FormControl>

                    <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                        Permissions
                    </Typography>
                    <FormControl component="fieldset">
                        <FormGroup row>
                            {permissionOptions.map((permission) => (
                                <motion.div
                                    key={permission.value}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={(formData.permissions & permission.value) === permission.value}
                                                onChange={() => handlePermissionToggle(permission.value)}
                                            />
                                        }
                                        label={permission.label}
                                    />
                                </motion.div>
                            ))}
                        </FormGroup>
                    </FormControl>

                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                type="button"
                                variant="outlined"
                                sx={{ mr: 2 }}
                                onClick={onComplete}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Create User'}
                            </Button>
                        </motion.div>
                    </Box>
                </Box>
            </Paper>
        </motion.div>
    );
};

export default UserForm;