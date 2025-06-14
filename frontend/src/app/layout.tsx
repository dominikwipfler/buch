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

  return (
    <html lang="de">
      <body>
        <ThemeProvider theme={theme}>
          <AppBar position="static" color="primary" elevation={2}>
            <Toolbar>
              {/* Statt BookIcon und Text: Dein Favicon als Bild */}
              <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <img
                  src="/logo.png"
                  alt="Logo"
                  style={{ width: 250, height: 60, marginRight: 8 }}
                />
              </Box>
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 2,
                }}
              >
                <Button color="inherit" component={Link} href="/">
                  Home
                </Button>
                {loggedIn && (
                  <>
                    <Button color="inherit" component={Link} href="/buecher">
                      Bücher
                    </Button>
                    <Button color="inherit" component={Link} href="/profil">
                      Profil
                    </Button>
                  </>
                )}
                {!loggedIn && (
                  <Button color="inherit" component={Link} href="/login">
                    Login
                  </Button>
                )}
                {loggedIn && (
                  <Button color="inherit" onClick={handleLogout}>
                    Logout
                  </Button>
                )}
              </Box>
            </Toolbar>
          </AppBar>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
