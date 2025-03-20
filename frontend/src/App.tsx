import React, { useState } from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { motion } from 'framer-motion';
import UserList from './components/UserList';
import Header from './components/Header';
import UserForm from './components/UserForm';
import UserDetails from './components/UserDetails';
import { User } from './types';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const App: React.FC = () => {
  const [view, setView] = useState<'list' | 'create' | 'details'>('list');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleUserSelected = (user: User) => {
    setSelectedUser(user);
    setView('details');
  };

  const handleCreateNew = () => {
    setSelectedUser(null);
    setView('create');
  };

  const handleBackToList = () => {
    setView('list');
  };

  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ minHeight: '100vh', padding: '20px' }}
        >
          <Header onCreateNew={handleCreateNew} onBackToList={handleBackToList} currentView={view} />

          {view === 'list' && <UserList onUserSelected={handleUserSelected} />}
          {view === 'create' && <UserForm onComplete={handleBackToList} />}
          {view === 'details' && selectedUser && <UserDetails user={selectedUser} onUpdate={handleBackToList} />}
        </motion.div>
      </ThemeProvider>
  );
};

export default App;