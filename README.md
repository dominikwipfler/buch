# Bücher-App

Dies ist eine Fullstack-Anwendung zum Verwalten und Durchsuchen von Büchern. Das Projekt besteht aus einem Backend (NestJS) und einem Frontend (Next.js mit TypeScript und Material UI).

---

## Projektstruktur

```
buch/
├── backend/   # NestJS REST-API
└── frontend/  # Next.js Frontend
```

---

## Voraussetzungen

- Node.js (empfohlen: v18 oder neuer)
- npm

---

## Backend starten

1. In das Backend-Verzeichnis wechseln:
    ```bash
    cd backend
    ```
2. Abhängigkeiten installieren:
    ```bash
    npm install
    ```
3. Backend starten:
    ```bash
    npm run start:dev
    ```

---

## Frontend starten

1. In das Frontend-Verzeichnis wechseln:
    ```bash
    cd frontend
    ```
2. Abhängigkeiten installieren:
    ```bash
    npm install
    ```
3. Frontend im Entwicklungsmodus starten:
    ```bash
    npm run dev
    ```
   **Oder mit eigenem HTTPS-Server:**
    ```bash
    node server.js
    ```
   (Vorausgesetzt, du hast Zertifikate und Express installiert.)

---

## Linting und Formatierung

- **Code-Qualität prüfen (ESLint):**
  ```bash
  npm run lint
  ```
- **Code formatieren (Prettier):**
  ```bash
  npm run prettier
  ```

---

## Tests

- **Playwright-Tests ausführen:**
  ```bash
  npx playwright test
  ```

---

## Favicon & Theme

- Das Favicon liegt im Ordner `frontend/public/`.
- Das Farbschema kann in `frontend/src/app/layout.tsx` angepasst werden.

---

## Hinweise

- Das Frontend ist unter [http://localhost:3000](http://localhost:3000) (bzw. [https://localhost:3001](https://localhost:3001) bei eigenem Server) erreichbar.
- Das Backend läuft standardmäßig auf [http://localhost:3002](http://localhost:3002) (je nach Konfiguration).

---

## Lizenz

Siehe Lizenzhinweise in den jeweiligen Dateien.
