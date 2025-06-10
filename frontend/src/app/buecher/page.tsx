'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  Grid,
  Typography,
  Divider,
  Box,
  TextField,
  Button,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from '@mui/material';

type Book = {
  id: number;
  version: number;
  isbn: string;
  rating: number;
  art: string;
  preis: string;
  rabatt: string;
  lieferbar: boolean;
  datum: string;
  homepage: string;
  schlagwoerter: string[];
  titel: {
    id: number;
    titel: string;
    untertitel?: string | null;
  };
  erzeugt: string;
  aktualisiert: string;
};

export default function BuecherPage() {
  const router = useRouter();

  // Weiterleitung, falls nicht eingeloggt
  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) {
      router.replace('/login');
    }
  }, [router]);

  // Suchformular-Felder
  const [titel, setTitel] = useState('');
  const [schlagwoerter, setSchlagwoerter] = useState('');
  const [rating, setRating] = useState('');
  const [art, setArt] = useState('');
  const [verfuegbar, setVerfuegbar] = useState(false);

  // Filter-States für die Ergebnisliste
  const [searchArt, setSearchArt] = useState('');
  const [searchVerfuegbar, setSearchVerfuegbar] = useState(false);

  // Suchergebnisse und Fehler
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [token, setToken] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Token aus localStorage holen (wenn Login auf /login war)
  useEffect(() => {
    const t =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (t) setToken(t);
  }, []);

  // Suche
  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setSearchArt(art);
    setSearchVerfuegbar(verfuegbar);
    try {
      const params = new URLSearchParams({
        ...(titel && { titel }),
        ...(rating && { rating }),
        size: '1000',
        page: '0',
      });
      if (schlagwoerter) {
        schlagwoerter
          .split(',')
          .map((s) => s.trim().toLowerCase())
          .forEach((sw) => {
            if (sw) params.append(sw, 'true');
          });
      }
      const url = params.toString()
        ? `https://localhost:3000/rest?${params.toString()}`
        : `https://localhost:3000/rest`;

      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error(`Fehler: ${res.status}`);
      const data = await res.json();
      setBooks(data.content ?? []);
    } catch (e: any) {
      setBooks([]);
      setError(e.message || 'Unbekannter Fehler');
    }
    setLoading(false);
  };
  };)
}
