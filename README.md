# Buch-Management SPA

Dieses Projekt ist eine Single Page Application (SPA) zur Verwaltung von Büchern. Es besteht aus einem **Frontend** auf Basis von [Next.js](https://nextjs.org) und [Material UI (MUI)](https://mui.com/) sowie einem **Backend** mit [NestJS](https://nestjs.com/) und einer **PostgreSQL**-Datenbank. Die Anwendung bietet Login, Suche, Detailansicht, Neuanlage und verwendet ein REST-API-Backend. Das Projekt entstand im Rahmen einer Hochschulaufgabe.

---

## Features

- **Login** mit Fehlerbehandlung (Keycloak)
- **Suchformular** mit Textfeldern, Dropdowns, Radiobuttons, Checkboxen
- **Suchergebnis-Anzeige** mit Fehlerbehandlung
- **Detailansicht** eines Buchs
- **Neuanlage** mit Validierung
- **Routing** mit Next.js
- **REST-Client** für Backend-Kommunikation
- **HTTPS**-Unterstützung
- **ESLint** und **Prettier** für Codequalität
- **Playwright** für End-to-End-Tests

---

## Projektstruktur

- **/frontend** – Next.js SPA (Pages, Components, Styles)
- **/backend** – NestJS REST-API, TypeORM, DB-Anbindung, Authentifizierung
- **/.extras/db/postgres/sql** – SQL-Skripte für die Datenbank
- **/tests** – Playwright E2E-Tests

---

## Setup & Installation

### Voraussetzungen

- [Node.js](https://nodejs.org/) (empfohlen: LTS)
- [Docker](https://www.docker.com/) (für die Datenbank und Keycloak)
- [Git](https://git-scm.com/)

### 1. Repository klonen

```powershell
git clone https://github.com/<DEIN_GITHUB>/buch.git
cd buch
```

### 2. Abhängigkeiten installieren

```powershell
cd backend
npm install
cd ../frontend
npm install
```

### 3. Datenbank & Keycloak starten

```powershell
cd ../backend/.extras/compose
docker compose up
```

### 4. Datenbank initialisieren

In einem neuen Terminal:

```powershell
docker compose exec db bash
psql --dbname=postgres --username=postgres --file=/sql/create-db-buch.sql
psql --dbname=buch --username=buch --file=/sql/create-schema-buch.sql
exit
```

### 5. Entwicklung starten

Backend (NestJS):

```powershell
cd backend
npm run dev
```

Frontend (Next.js):

```powershell
cd frontend
npm run dev
```

Die Anwendung ist dann unter [https://localhost:3000](https://localhost:3000) erreichbar.

---

## Tests

### Linting & Formatting

```powershell
npm run lint
npm run format
```

### End-to-End-Tests mit Playwright

```powershell
npx playwright test
```

---

## Design & Dokumentation

- **Mockups:** [Figma/Balsamiq/Adobe XD Link hier einfügen]
- **Zustandsdiagramm:** siehe `/docs/state-diagram.puml`
- **Projektmanagement:** [GitHub Project Link hier einfügen]
- **Zeiterfassung:** siehe `/docs/zeiterfassung.xlsx`

---

## Lizenz

Dieses Projekt steht unter der [GNU GPLv3](https://www.gnu.org/licenses/gpl-3.0.de.html).

---

## Kontakt

Dominik Wipfler  
[GitHub-Profil](https://github.com/dominikwipfler)
