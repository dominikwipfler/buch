'use client';
import Grid from '@mui/material/Grid';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
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

  // Buch-Dialog und neues Buch
  const [open, setOpen] = useState(false);
  const [newBook, setNewBook] = useState({
    isbn: '',
    rating: 1,
    art: '',
    preis: '',
    rabatt: '',
    lieferbar: false,
    datum: new Date().toISOString().slice(0, 10),
    homepage: '',
    schlagwoerter: '',
    titel: { titel: '', untertitel: '' },
    abbildungen: [{ beschriftung: '', contentType: '' }],
  });

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
        size: '2',
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

  // Buch anlegen
  const handleCreateBook = async () => {
    try {
      if (!newBook.isbn || !newBook.titel.titel || !newBook.datum) {
        alert('Bitte alle Pflichtfelder ausfüllen!');
        return;
      }
      if (
        !newBook.isbn ||
        !newBook.titel.titel ||
        !newBook.art ||
        !newBook.preis ||
        isNaN(parseFloat(newBook.preis)) ||
        !newBook.rabatt ||
        isNaN(parseFloat(newBook.rabatt)) ||
        !newBook.homepage ||
        !newBook.abbildungen[0].beschriftung ||
        !newBook.abbildungen[0].contentType
      ) {
        alert('Bitte alle Pflichtfelder korrekt ausfüllen!');
        return;
      }
      const res = await fetch('https://localhost:3000/rest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          isbn: newBook.isbn,
          rating: newBook.rating,
          art: newBook.art,
          preis: newBook.preis ? Number(newBook.preis) : 0,
          rabatt: newBook.rabatt ? Number(newBook.rabatt) : 0,
          lieferbar: newBook.lieferbar,
          datum: newBook.datum,
          homepage: newBook.homepage || 'https://example.com',
          schlagwoerter: newBook.schlagwoerter
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s.length > 0),
          titel: {
            titel: newBook.titel.titel,
            untertitel: newBook.titel.untertitel,
          },
          abbildungen: newBook.abbildungen
            .filter((a) => a.beschriftung && a.contentType)
            .map((a) => ({
              beschriftung: a.beschriftung,
              contentType: a.contentType,
            })),
        }),
      });
      if (res.status !== 201) throw new Error(`Fehler: ${res.status}`);
      setOpen(false);
      setNewBook({
        isbn: '',
        rating: 1,
        art: '',
        preis: '',
        rabatt: '',
        lieferbar: false,
        datum: new Date().toISOString().slice(0, 10),
        homepage: '',
        schlagwoerter: '',
        titel: { titel: '', untertitel: '' },
        abbildungen: [{ beschriftung: '', contentType: '' }],
      });
      handleSearch();
    } catch (e: any) {
      alert(e.message || 'Fehler beim Anlegen');
    }
  };

  // Initiale Suche beim ersten Laden
  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <Container sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container spacing={4}>
          {open ? (
            // Buch anlegen Formular
            <Grid item xs={12} {...({} as any)}>
              <Typography variant="h6">Neues Buch anlegen</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="ISBN"
                  value={newBook.isbn}
                  onChange={(e) =>
                    setNewBook({ ...newBook, isbn: e.target.value })
                  }
                  inputProps={{ 'aria-label': 'ISBN' }}
                />
                <TextField
                  label="Titel"
                  value={newBook.titel.titel}
                  onChange={(e) =>
                    setNewBook({
                      ...newBook,
                      titel: { ...newBook.titel, titel: e.target.value },
                    })
                  }
                  inputProps={{ 'aria-label': 'Buchtitel' }}
                />
                <TextField
                  label="Untertitel"
                  value={newBook.titel.untertitel}
                  onChange={(e) =>
                    setNewBook({
                      ...newBook,
                      titel: { ...newBook.titel, untertitel: e.target.value },
                    })
                  }
                  inputProps={{ 'aria-label': 'Buchuntertitel' }}
                />
                <TextField
                  select
                  label="Art"
                  value={newBook.art}
                  onChange={(e) =>
                    setNewBook({ ...newBook, art: e.target.value })
                  }
                  inputProps={{ 'aria-label': 'Art' }}
                >
                  <MenuItem value="EPUB">EPUB</MenuItem>
                  <MenuItem value="HARDCOVER">HARDCOVER</MenuItem>
                  <MenuItem value="PAPERBACK">PAPERBACK</MenuItem>
                </TextField>
                <TextField
                  label="Preis"
                  value={newBook.preis}
                  onChange={(e) =>
                    setNewBook({ ...newBook, preis: e.target.value })
                  }
                  inputProps={{ 'aria-label': 'Preis' }}
                />
                <TextField
                  label="Rabatt"
                  value={newBook.rabatt}
                  onChange={(e) =>
                    setNewBook({ ...newBook, rabatt: e.target.value })
                  }
                  inputProps={{ 'aria-label': 'Rabatt' }}
                />
                <TextField
                  label="Homepage"
                  value={newBook.homepage}
                  onChange={(e) =>
                    setNewBook({ ...newBook, homepage: e.target.value })
                  }
                  inputProps={{ 'aria-label': 'Homepage' }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={newBook.lieferbar}
                      onChange={(e) =>
                        setNewBook({ ...newBook, lieferbar: e.target.checked })
                      }
                    />
                  }
                  label="Lieferbar"
                />
                <TextField
                  label="Schlagwörter (Komma getrennt)"
                  value={newBook.schlagwoerter}
                  onChange={(e) =>
                    setNewBook({ ...newBook, schlagwoerter: e.target.value })
                  }
                />
                <TextField
                  label="Abbildung Beschriftung"
                  value={newBook.abbildungen[0]?.beschriftung || ''}
                  onChange={(e) =>
                    setNewBook({
                      ...newBook,
                      abbildungen: [
                        {
                          ...newBook.abbildungen[0],
                          beschriftung: e.target.value,
                          contentType:
                            newBook.abbildungen[0]?.contentType || '',
                        },
                      ],
                    })
                  }
                  inputProps={{ 'aria-label': 'Abbildung Beschriftung' }}
                />
                <TextField
                  label="Abbildung Content-Type"
                  value={newBook.abbildungen[0]?.contentType || ''}
                  onChange={(e) =>
                    setNewBook({
                      ...newBook,
                      abbildungen: [
                        {
                          ...newBook.abbildungen[0],
                          contentType: e.target.value,
                          beschriftung:
                            newBook.abbildungen[0]?.beschriftung || '',
                        },
                      ],
                    })
                  }
                  inputProps={{ 'aria-label': 'Abbildung Content-Type' }}
                />
                <Button variant="contained" onClick={handleCreateBook}>
                  Buch anlegen
                </Button>
                <Button onClick={() => setOpen(false)}>Abbrechen</Button>
              </Box>
            </Grid>
          ) : (
            <>
              {/* Linke Spalte: Suchformular */}
              <Grid item={12 as any} md={6 as any} {...({} as any)}>
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
              </Grid>
              {/* Rechte Spalte: Ergebnisse + Details */}
              <Grid item={12 as any} md={6 as any} sx={{ height: 600 } as any} {...({} as any)}>
                <Typography variant="h6" gutterBottom>
                  Ergebnisse
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item={selectedBook ? (6 as any) : (12 as any)} {...({} as any)}>
                    <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                      {(() => {
                        const gefilterteBuecher = books
                          .filter((book) => !searchVerfuegbar || book.lieferbar)
                          .filter(
                            (book) => !searchArt || book.art === searchArt,
                          );
                        if (gefilterteBuecher.length === 0) {
                          return (
                            <ListItem>
                              <ListItemText primary="Keine Ergebnisse." />
                            </ListItem>
                          );
                        }
                        return gefilterteBuecher.map((book) => (
                          <ListItem key={book.id} divider disablePadding>
                            <ListItemButton
                              onClick={() => setSelectedBook(book)}
                              selected={selectedBook?.id === book.id}
                            >
                              <ListItemText
                                primary={
                                  book.titel
                                    ? book.titel.titel +
                                      (book.titel.untertitel
                                        ? `: ${book.titel.untertitel}`
                                        : '')
                                    : 'Kein Titel'
                                }
                                secondary={
                                  <>
                                    <span>ISBN: {book.isbn}</span>
                                    <br />
                                    <span>Typ: {book.art}</span>
                                    <br />
                                    <span>
                                      Lieferbar:{' '}
                                      {book.lieferbar
                                        ? 'Verfügbar'
                                        : 'Nicht verfügbar'}
                                    </span>
                                  </>
                                }
                              />
                            </ListItemButton>
                          </ListItem>
                        ));
                      })()}
                    </List>
                  </Grid>
                  {selectedBook && (
                    <Grid item={6 as any} {...({} as any)}>
                      <Paper sx={{ p: 2, height: '100%' }}>
                        <Typography variant="h6">Details</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="body1">
                          <strong>ISBN:</strong> {selectedBook.isbn}
                          <br />
                          <strong>Art:</strong> {selectedBook.art}
                          <br />
                          <strong>Preis:</strong> {selectedBook.preis} €<br />
                          <strong>Rabatt:</strong> {selectedBook.rabatt} %<br />
                          <strong>Lieferbar:</strong>{' '}
                          {selectedBook.lieferbar ? 'Ja' : 'Nein'}
                          <br />
                          <strong>Datum:</strong>{' '}
                          {new Date(selectedBook.datum).toLocaleDateString()}
                          <br />
                          <strong>Homepage:</strong> {selectedBook.homepage}
                          <br />
                          <strong>Schlagwörter:</strong>{' '}
                          {selectedBook.schlagwoerter.join(', ')}
                          <br />
                        </Typography>
                        <Button
                          sx={{ mt: 2 }}
                          onClick={() => setSelectedBook(null)}
                        >
                          Schließen
                        </Button>
                      </Paper>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </>
          )}
        </Grid>
      </Paper>
    </Container>
  );
}
