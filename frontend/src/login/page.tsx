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
  }, [router]); }