import React, { useState } from 'react';
import {
    Box, Paper, Typography, TextField, Button, Chip,
    Grid, Divider, FormControl, FormGroup, FormControlLabel,
    Checkbox, CircularProgress, Alert
} from '@mui/material';
import { motion } from 'framer-motion';
import { updateUser } from '../services/api';
import { User, UserRoles, UserPermissions, UserUpdateRequest } from '../types';
import { getUserRolesArray, getUserPermissionsArray, getRoleOptions, getPermissionOptions } from '../utils/flag-utils';
import { keyframes } from "@mui/system";

interface UserDetailsProps {
    user: User;
    onUpdate: () => void;
}

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const UserDetails: React.FC<UserDetailsProps> = ({ user, onUpdate }) => {
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
    });

    const [roleChanges, setRoleChanges] = useState<Record<number, 'add' | 'remove' | null>>({});
    const [permissionChanges, setPermissionChanges] = useState<Record<number, 'add' | 'remove' | null>>({});
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
        const hasRole = (user.roles & roleValue) === roleValue;

        setRoleChanges(prev => {
            // If role is currently active
            if (hasRole) {
                return { ...prev, [roleValue]: prev[roleValue] === 'remove' ? null : 'remove' };
            } else {
                // If role is currently inactive
                return { ...prev, [roleValue]: prev[roleValue] === 'add' ? null : 'add' };
            }
        });
    };

    const handlePermissionToggle = (permValue: number) => {
        const hasPermission = (user.permissions & permValue) === permValue;

        setPermissionChanges(prev => {
            if (hasPermission) {
                return { ...prev, [permValue]: prev[permValue] === 'remove' ? null : 'remove' };
            } else {
                return { ...prev, [permValue]: prev[permValue] === 'add' ? null : 'add' };
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const updateRequest: UserUpdateRequest = {
            name: formData.name !== user.name ? formData.name : undefined,
            email: formData.email !== user.email ? formData.email : undefined,
        };

        // Calculate roles to add/remove
        const addRoles = Object.entries(roleChanges)
            .filter(([_, action]) => action === 'add')
            .reduce((acc, [value]) => acc | Number(value), 0);

        const removeRoles = Object.entries(roleChanges)
            .filter(([_, action]) => action === 'remove')
            .reduce((acc, [value]) => acc | Number(value), 0);

        // Calculate permissions to add/remove
        const addPermissions = Object.entries(permissionChanges)
            .filter(([_, action]) => action === 'add')
            .reduce((acc, [value]) => acc | Number(value), 0);

        const removePermissions = Object.entries(permissionChanges)
            .filter(([_, action]) => action === 'remove')
            .reduce((acc, [value]) => acc | Number(value), 0);

        if (addRoles > 0) updateRequest.addRoles = addRoles;
        if (removeRoles > 0) updateRequest.removeRoles = removeRoles;
        if (addPermissions > 0) updateRequest.addPermissions = addPermissions;
        if (removePermissions > 0) updateRequest.removePermissions = removePermissions;

        try {
            await updateUser(user.id, updateRequest);
            setSuccess(true);
            setTimeout(() => {
                onUpdate();
            }, 1500);
        } catch (err) {
            setError('Failed to update user');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Preview calculated roles and permissions
    const previewRoles = roleOptions.reduce((acc, role) => {
        const hasRole = (user.roles & role.value) === role.value;
        const action = roleChanges[role.value];

        if ((hasRole && action !== 'remove') || (!hasRole && action === 'add')) {
            return acc | role.value;
        }
        return acc;
    }, 0);

    const previewPermissions = permissionOptions.reduce((acc, perm) => {
        const hasPerm = (user.permissions & perm.value) === perm.value;
        const action = permissionChanges[perm.value];

        if ((hasPerm && action !== 'remove') || (!hasPerm && action === 'add')) {
            return acc | perm.value;
        }
        return acc;
    }, 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Paper sx={{ p: 4, borderRadius: 2, maxWidth: 800, margin: '0 auto' }}>
                <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Typography variant="h5" gutterBottom component="div">
                        User Details
                    </Typography>
                </motion.div>

                {success && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Alert severity="success" sx={{ mb: 2 }}>
                            User updated successfully!
                        </Alert>
                    </motion.div>
                )}

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
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
                        </Grid>
                    </Grid>

                    <Box mt={3} mb={2}>
                        <Divider />
                    </Box>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                            User Roles
                        </Typography>

                        <Box mb={2} display="flex" flexWrap="wrap" gap={1}>
                            <Typography variant="subtitle2" sx={{ width: '100%', mb: 1 }}>
                                Current:
                            </Typography>
                            {getUserRolesArray(previewRoles).map(role => (
                                <Chip
                                    key={role}
                                    label={role}
                                    color="primary"
                                    variant="filled"
                                    sx={{
                                        animation: roleChanges[UserRoles[role as keyof typeof UserRoles]] === 'add'
                                            ? `${pulse} 1.5s infinite` : undefined
                                    }}
                                />
                            ))}
                        </Box>

                        <FormControl component="fieldset" sx={{ width: '100%' }}>
                            <FormGroup row>
                                {roleOptions.map((role) => {
                                    const action = roleChanges[role.value];

                                    return (
                                        <motion.div
                                            key={role.value}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={(previewRoles & role.value) === role.value}
                                                        onChange={() => handleRoleToggle(role.value)}
                                                        color={action ? (action === 'add' ? 'success' : 'error') : 'primary'}
                                                    />
                                                }
                                                label={
                                                    <Box component="span">
                                                        {role.label}
                                                        {action && (
                                                            <Typography
                                                                component="span"
                                                                color={action === 'add' ? 'success.main' : 'error.main'}
                                                                sx={{ ml: 1, fontSize: '0.75rem' }}
                                                            >
                                                                ({action === 'add' ? 'Adding' : 'Removing'})
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                }
                                            />
                                        </motion.div>
                                    );
                                })}
                            </FormGroup>
                        </FormControl>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                            User Permissions
                        </Typography>

                        <Box mb={2} display="flex" flexWrap="wrap" gap={1}>
                            <Typography variant="subtitle2" sx={{ width: '100%', mb: 1 }}>
                                Current:
                            </Typography>
                            {getUserPermissionsArray(previewPermissions).map(permission => (
                                <Chip
                                    key={permission}
                                    label={permission}
                                    color="secondary"
                                    variant="filled"
                                    sx={{
                                        animation: permissionChanges[UserPermissions[permission as keyof typeof UserPermissions]] === 'add'
                                            ? `${pulse} 1.5s infinite` : undefined
                                    }}
                                />
                            ))}
                        </Box>

                        <FormControl component="fieldset" sx={{ width: '100%' }}>
                            <FormGroup row>
                                {permissionOptions.map((permission) => {
                                    const action = permissionChanges[permission.value];

                                    return (
                                        <motion.div
                                            key={permission.value}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={(previewPermissions & permission.value) === permission.value}
                                                        onChange={() => handlePermissionToggle(permission.value)}
                                                        color={action ? (action === 'add' ? 'success' : 'error') : 'secondary'}
                                                    />
                                                }
                                                label={
                                                    <Box component="span">
                                                        {permission.label}
                                                        {action && (
                                                            <Typography
                                                                component="span"
                                                                color={action === 'add' ? 'success.main' : 'error.main'}
                                                                sx={{ ml: 1, fontSize: '0.75rem' }}
                                                            >
                                                                ({action === 'add' ? 'Adding' : 'Removing'})
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                }
                                            />
                                        </motion.div>
                                    );
                                })}
                            </FormGroup>
                        </FormControl>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <Box sx={{ mt: 5, display: 'flex', justifyContent: 'flex-end' }}>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    type="button"
                                    variant="outlined"
                                    sx={{ mr: 2 }}
                                    onClick={onUpdate}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                            </motion.div>

                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={loading}
                                    sx={{ position: 'relative', overflow: 'hidden' }}
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Update User'}
                                    {!loading && (
                                        <Box
                                            component={motion.div}
                                            animate={{
                                                background: [
                                                    'linear-gradient(45deg, rgba(66,165,245,0) 0%, rgba(66,165,245,0.5) 50%, rgba(66,165,245,0) 100%)'
                                                ],
                                                left: ['100%', '-100%']
                                            }}
                                            transition={{
                                                duration: 1.5,
                                                repeat: Infinity,
                                                repeatDelay: 0.5
                                            }}
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                width: '100%',
                                                height: '100%',
                                                transform: 'translateX(-100%)'
                                            }}
                                        />
                                    )}
                                </Button>
                            </motion.div>
                        </Box>
                    </motion.div>
                </Box>
            </Paper>
        </motion.div>
    );
};

export default UserDetails;