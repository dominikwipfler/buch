-- Copyright (C) 2022 - present Juergen Zimmermann, Hochschule Karlsruhe
--
-- This program is free software: you can redistribute it and/or modify
-- it under the terms of the GNU General Public License as published by
-- the Free Software Foundation, either version 3 of the License, or
-- (at your option) any later version.
--
-- This program is distributed in the hope that it will be useful,
-- but WITHOUT ANY WARRANTY; without even the implied warranty of
-- MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
-- GNU General Public License for more details.
--
-- You should have received a copy of the GNU General Public License
-- along with this program.  If not, see <https://www.gnu.org/licenses/>.

-- (1) in .extras\compose\backend\postgres\compose.yml
--        auskommentieren:
--           Zeile mit "command:" und nachfolgende Listenelemente mit führendem "-"
--              damit der PostgreSQL-Server ohne TLS gestartet wird
--           bei den Listenelementen unterhalb von "volumes:" die Zeilen mit "read_only:" bei key.pem und certificate.crt
--              damit die Zugriffsrechte fuer den privaten Schluessel und das Zertifikat nachfolgend gesetzt werden koennen
--           Zeile mit "user:"
--              damit der PostgreSQL-Server implizit mit dem Linux-User "root" gestartet wird
--        Kommentar entfernen:
--           Zeile mit "#cap_add: [...]"
-- (2) PowerShell:
--     cd .extras\compose\backend\postgres
--     docker compose up db
-- (3) In Windows das Verzeichnis "C:/Zimmermann/volumes/postgres/tablespace/buch" anlegen
--     Siehe .extras\compose\postgres\compose.yml
-- (4) 2. PowerShell:
--     cd .extras\compose\backend\postgres
--     docker compose exec db bash
--        chown postgres:postgres /var/lib/postgresql/tablespace
--        chown postgres:postgres /var/lib/postgresql/tablespace/buch
--        chown postgres:postgres /var/lib/postgresql/key.pem
--        chown postgres:postgres /var/lib/postgresql/certificate.crt
--        chmod 400 /var/lib/postgresql/key.pem
--        chmod 400 /var/lib/postgresql/certificate.crt
--        exit
--     docker compose down
-- (5) in compose.yml die obigen Kommentare wieder entfernen, d.h.
--        PostgreSQL-Server mit TLS starten
--        key.pem und certificate.crt als readonly
--        den Linux-User "postgres" wieder aktivieren
--     in compose.yml die Zeile "cap_add: [...]" wieder auskommentieren
-- (6) 1. PowerShell:
--     docker compose up db
-- (7) 2. PowerShell:
--     docker compose exec db bash
--        psql --dbname=postgres --username=postgres --file=/sql/create-db-buch.sql
--        psql --dbname=buch --username=buch --file=/sql/create-schema-buch.sql
--        exit
--     ggf. docker compose down

-- TLS fuer den PostgreSQL-Server mit OpenSSL ueberpruefen:
--     cd .extras\compose\debug
--     docker compose up
-- In einer weiteren Powershell
--     cd .extras\compose\debug
--     docker compose exec netshoot bash
--         openssl s_client -tls1_3 -trace postgres:5432
--            Ausgabe u.a.:
--            * selbst-signiertes Zertifikat
--            * Subject, CN (Common Name), OU (Organizationl Unit), O(rganization), L(ocation), ST(ate), C(ountry)
--         exit
--     docker compose down

-- https://www.postgresql.org/docs/current/sql-createrole.html
CREATE ROLE buch LOGIN PASSWORD 'p';

-- https://www.postgresql.org/docs/current/sql-createdatabase.html
CREATE DATABASE buch;

GRANT ALL ON DATABASE buch TO buch;

-- https://www.postgresql.org/docs/10/sql-createtablespace.html
CREATE TABLESPACE buchspace OWNER buch LOCATION '/var/lib/postgresql/tablespace/buch';
