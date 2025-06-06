// Copyright (C) 2016 - present Juergen Zimmermann, Hochschule Karlsruhe
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

/* eslint-disable max-classes-per-file */

import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Das Modul besteht aus den Klassen für die Fehlerbehandlung bei der Verwaltung
 * von Büchern, z.B. beim DB-Zugriff.
 * @packageDocumentation
 */

/**
 * Exception-Klasse für eine bereits existierende ISBN-Nummer.
 */
export class IsbnExistsException extends HttpException {
    readonly isbn: string | undefined;

    constructor(isbn: string | undefined) {
        super(
            `Die ISBN-Nummer ${isbn} existiert bereits.`,
            HttpStatus.UNPROCESSABLE_ENTITY,
        );
        this.isbn = isbn;
    }
}

/**
 * Exception-Klasse für eine ungültige Versionsnummer beim Ändern.
 */
export class VersionInvalidException extends HttpException {
    readonly version: string | undefined;

    constructor(version: string | undefined) {
        super(
            `Die Versionsnummer ${version} ist ungueltig.`,
            HttpStatus.PRECONDITION_FAILED,
        );
        this.version = version;
    }
}

/**
 * Exception-Klasse für eine veraltete Versionsnummer beim Ändern.
 */
export class VersionOutdatedException extends HttpException {
    readonly version: number;

    constructor(version: number) {
        super(
            `Die Versionsnummer ${version} ist nicht aktuell.`,
            HttpStatus.PRECONDITION_FAILED,
        );
        this.version = version;
    }
}

/* eslint-enable max-classes-per-file */
