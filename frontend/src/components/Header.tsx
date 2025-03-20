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
            <AppBar
                position="static"
                sx={{
                    marginBottom: 4,
                    borderRadius: 2,
                    background: 'linear-gradient(45deg, #00ccff, #ffdd00)'
                }}
            >
                <Toolbar>
                    <Box sx={{ textAlign: 'center', flexGrow: 1 }}>
                        {/* Title */}
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{
                                fontWeight: 'bold',
                                textShadow: '3px 3px 5px rgba(0, 0, 0, 0.7)',
                                color: '#FFFFFF'
                            }}
                        >
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                Flag Demo App
                            </motion.span>
                        </Typography>
                        <motion.div
                            initial={{ scale: 0.8, rotate: -5 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ duration: 0.5, repeat: Infinity, repeatType: "mirror" }}
                            style={{
                                fontSize: '1.4rem',
                                fontWeight: 'bold',
                                marginTop: '5px',
                                textShadow: '4px 4px 10px #000, 0 0 20px #00ccff',
                                color: '#ffdd00',
                                fontFamily: '"Comic Sans MS", cursive, sans-serif',
                                background: 'linear-gradient(45deg, #ffdd00, #ff3300, #00ccff)',
                                WebkitBackgroundClip: 'text',
                                display: 'inline-block',
                                padding: '5px 10px',
                                border: '2px solid #ffffff',
                                borderRadius: '10px'
                            }}
                        >
                            ✨ GRAPHIC DESIGN IS MY PASSION ✨
                        </motion.div>
                    </Box>

                    <Box>
                        {currentView !== 'list' && (
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                    color="inherit"
                                    sx={{
                                        fontWeight: 'bold',
                                        color: '#FFFFFF',
                                        textShadow: '1px 1px 5px rgba(0, 0, 0, 0.8)'
                                    }}
                                    onClick={onBackToList}
                                >
                                    Back to List
                                </Button>
                            </motion.div>
                        )}
                        {currentView === 'list' && (
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                    variant="contained"
                                    sx={{
                                        backgroundColor: '#00ccff',
                                        color: '#000',
                                        fontWeight: 'bold',
                                        textShadow: '1px 1px 5px rgba(255, 255, 255, 0.7)',
                                        border: '2px solid #ffffff'
                                    }}
                                    onClick={onCreateNew}
                                >
                                    Create New User 🚀
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
