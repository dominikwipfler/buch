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

-- (1) in .extras\compose\backend\mysql\compose.yml
--        auskommentieren:
--           Zeile mit "command:" und nachfolgende Listenelemente mit führendem "-"
--              damit der MySQL-Server ohne TLS gestartet wird
--           unterhalb von "volumes:" die kompletten Listenelemente mit server-key.pem,
--              server-cert.pem und ca.pem auskommentieren
--           Zeile mit "user:"
--              damit der MySQL-Server implizit mit dem Linux-User "root" gestartet wird
-- (2) PowerShell:
--     cd .extras\compose\backend\mysql
--     docker compose up db
-- (3) 2. PowerShell:
--     cd .extras\compose\backend\mysql
--     docker compose exec db bash
--        mysql --user=root --password=''
--           ALTER USER 'root'@'localhost' IDENTIFIED BY 'p';
--           UPDATE mysql.user SET host='%' WHERE user='root';
--           exit
--        exit
--     docker compose down
-- (4) in .extras\compose\backend\mysql\compose.yml
--        bei den Listenelementen mit server-key.pem, server-cert.pem und ca.pem
--           alle Kommentare entfernen *BIS AUF* die Zeilen mit "read_only"
--        den Linux-User "mysql" wieder aktivieren, d.h. Kommentar (s.o.) wieder entfernen
-- (5) PowerShell:
--     docker compose up db
-- (6) 2. PowerShell:
--     docker compose exec db bash
--        cd /var/lib/mysql
--        chmod 400 server-key.pem
--        chmod 400 server-cert.pem
--        chmod 400 ca.pem
--        exit
--     docker compose down
-- (7) in .extras\compose\backend\mysql\compose.yml
--        Kommentar entfernen in der Zeile mit "command:" und den nachfolgende Listenelemente mit führendem "-"
--        bei den Listenelementen mit server-key.pem, server-cert.pem und ca.pem
--           jeweils die Kommentare bei "read_only" entfernen
-- (8) PowerShell:
--     docker compose up
-- (9) 2. PowerShell:
--     docker compose exec db bash
--         mysql --user=root --password=p < /sql/create-db-buch.sql
--         exit
--     docker compose down
-- (10) in extras\compose\mysql\compose.yml
--         Beim Service "phpmyadmin" und dort beim Volume fur "phpmyadmin" die Zeile mit "read_only" auskommentieren
-- (11) PowerShell:
--      docker compose up
-- (12) 2. PowerShell:
--      docker compose exec phpmyadmin bash
--         cd /etc/phpmyadmin
--         chmod 644 config.*.php
--         exit
--      docker compose down
-- (13) in extras\compose\mysql\compose.yml
--         Beim Service "phpmyadmin" und dort beim Volume fur "phpmyadmin" den Kommentar bei "read_only" wieder entfernen

-- https://dev.mysql.com/doc/refman/9.2/en/mysql.html
--   mysqlsh ist *NICHT* im Docker-Image enthalten


-- https://dev.mysql.com/doc/refman/9.2/en/create-user.html
-- https://dev.mysql.com/doc/refman/9.2/en/role-names.html
CREATE USER IF NOT EXISTS buch IDENTIFIED BY 'p';
GRANT USAGE ON *.* TO buch;

-- https://dev.mysql.com/doc/refman/9.2/en/create-database.html
-- https://dev.mysql.com/doc/refman/9.2/en/charset.html
-- SHOW CHARACTER SET;
CREATE DATABASE IF NOT EXISTS buch CHARACTER SET utf8;

GRANT ALL PRIVILEGES ON buch.* to buch;

-- https://dev.mysql.com/doc/refman/9.2/en/create-tablespace.html
-- .idb-Datei innerhalb vom "data"-Verzeichnis
CREATE TABLESPACE `buchspace` ADD DATAFILE 'buchspace.ibd' ENGINE=INNODB;
