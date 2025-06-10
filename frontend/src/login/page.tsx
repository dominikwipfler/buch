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
}
