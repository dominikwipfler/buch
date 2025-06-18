'use client';
import { useEffect, useState, ReactNode } from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, Box, Button } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Image from 'next/image';

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
              {/* Statt <img>: Next.js <Image /> verwenden */}
              <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <Image
                  src="/favicon.ico"
                  alt="Logo"
                  width={32}
                  height={32}
                  style={{ marginRight: 8 }}
                  priority
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
