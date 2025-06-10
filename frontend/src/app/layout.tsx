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
