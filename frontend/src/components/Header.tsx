import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { motion } from 'framer-motion';

interface HeaderProps {
    onCreateNew: () => void;
    onBackToList: () => void;
    currentView: 'list' | 'create' | 'details';
}

const Header: React.FC<HeaderProps> = ({ onCreateNew, onBackToList, currentView }) => {
    return (
        <motion.div
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, type: 'spring' }}
        >
            <AppBar position="static" sx={{ marginBottom: 4, borderRadius: 2 }}>
                <Toolbar>
                    <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            Flag Demo App
                        </motion.span>
                    </Typography>
                    <Box>
                        {currentView !== 'list' && (
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button color="inherit" onClick={onBackToList}>
                                    Back to List
                                </Button>
                            </motion.div>
                        )}
                        {currentView === 'list' && (
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={onCreateNew}
                                >
                                    Create New User
                                </Button>
                            </motion.div>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
        </motion.div>
    );
};

export default Header;