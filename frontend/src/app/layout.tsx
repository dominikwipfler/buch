'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import BookIcon from '@mui/icons-material/Book';

import { ReactNode } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

interface RootLayoutProps {
  children: ReactNode;
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#d32f2f', // Rot
    },
    secondary: {
      main: '#f44336', // Optional: weiteres Rot
    },
  },
});
export default function RootLayout({ children }: RootLayoutProps) {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = () => setLoggedIn(!!localStorage.getItem('token'));
    checkLogin();
    window.addEventListener('storage', checkLogin);
    window.addEventListener('loginChanged', checkLogin);
    return () => {
      window.removeEventListener('storage', checkLogin);
      window.removeEventListener('loginChanged', checkLogin);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    window.dispatchEvent(new Event('loginChanged'));
    window.location.href = '/';
  };
}
