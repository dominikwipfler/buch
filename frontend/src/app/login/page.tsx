'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Wenn schon eingeloggt, direkt weiterleiten
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      router.replace('/buecher');
    }
  }, [router]);

  const handleLogin = async () => {
    try {
      const res = await fetch('https://localhost:3000/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error('Login fehlgeschlagen');
      const data = await res.json();
      localStorage.setItem('token', data.access_token);
      window.dispatchEvent(new Event('loginChanged'));
      setError(null);
      router.push('/buecher');
    } catch (e: any) {
      setError(e.message || 'Login fehlgeschlagen');
    }
  };
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
      }}
    >
      <Paper sx={{ p: 4, minWidth: 320 }}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        <TextField
          label="Benutzername"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          margin="normal"
          inputProps={{ 'aria-label': 'Benutzername' }}
        />    
     <TextField
          label="Passwort"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          inputProps={{ 'aria-label': 'Passwort' }}
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
          fullWidth
          sx={{ mt: 2 }}
        >
          Login
        </Button>
      </Paper>
    </Box>
  );
}
