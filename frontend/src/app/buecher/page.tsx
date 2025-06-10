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
  };

    return (
    <Container sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container spacing={4}>
          {open ? () : (
            <>
              {/* Linke Spalte: Suchformular */}
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom>
                  Bücher suchen
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box
                  component="form"
                  sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                >
                  <TextField
                    label="Buchtitel"
                    value={titel}
                    onChange={(e) => setTitel(e.target.value)}
                    fullWidth
                    inputProps={{ 'aria-label': 'Buchtitel' }}
                  />
                  <TextField
                    label="Schlagwörter"
                    value={schlagwoerter}
                    onChange={(e) => setSchlagwoerter(e.target.value)}
                    fullWidth
                    inputProps={{ 'aria-label': 'Schlagwörter' }}
                  />
                  <TextField
                    select
                    label="Rating"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    fullWidth
                    inputProps={{ 'aria-label': 'Rating' }}
                  >
                    <MenuItem value="">Alle</MenuItem>
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                    <MenuItem value="3">3</MenuItem>
                    <MenuItem value="4">4</MenuItem>
                    <MenuItem value="5">5</MenuItem>
                  </TextField>
                  <RadioGroup
                    row
                    value={art}
                    onChange={(e) => setArt(e.target.value)}
                  >
                    <FormControlLabel
                      value=""
                      control={<Radio />}
                      label="Alle"
                    />
                    <FormControlLabel
                      value="EPUB"
                      control={<Radio />}
                      label="EPUB"
                    />
                    <FormControlLabel
                      value="HARDCOVER"
                      control={<Radio />}
                      label="Hardcover"
                    />
                    <FormControlLabel
                      value="PAPERBACK"
                      control={<Radio />}
                      label="Paperback"
                    />
                  </RadioGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={verfuegbar}
                        onChange={(e) => setVerfuegbar(e.target.checked)}
                      />
                    }
                    label="Nur verfügbare Bücher"
                  />
                  <Button
                    variant="contained"
                    onClick={handleSearch}
                    disabled={loading}
                  >
                    {loading ? 'Suche läuft...' : 'Suchen'}
                  </Button>
                  {error && <Typography color="error">{error}</Typography>}
                </Box>
                <Button
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={() => setOpen(true)}
                >
                  Neues Buch anlegen
                </Button>
            </>
          )}
        </Grid>
      </Paper>
    </Container>
  );
}
