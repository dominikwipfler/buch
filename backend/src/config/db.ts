// Copyright (C) 2020 - present Juergen Zimmermann, Hochschule Karlsruhe
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <https://www.gnu.org/licenses/>.

/**
 * Das Modul enthält die Konfiguration für das DB-System.
 * @packageDocumentation
 */
import { config } from './app.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const dbConfig = config.db;
console.debug('dbConfig: %o', dbConfig);

type DbType = 'postgres' | 'mysql' | 'sqlite';

// "Optional Chaining" ab ES2020
const type: DbType | undefined = dbConfig?.type; // eslint-disable-line @typescript-eslint/no-unsafe-assignment

// 'better-sqlite3' erfordert node-gyp zum Uebersetzen, wenn das Docker-Image gebaut wird
// ${env:LOCALAPPDATA}\node-gyp\Cache\<Node_Version>\include\node\v8config.h
// npm rebuild better-sqlite3 --update-binary
// npm i better-sqlite3
export const dbType =
    type === 'postgres' || type === 'mysql' || type === 'sqlite'
        ? type
        : 'postgres';

export const binaryType: 'bytea' | 'blob' =
    dbType === 'postgres' ? 'bytea' : 'blob';
console.debug('binaryType: %s', binaryType);
