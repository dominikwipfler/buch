// Copyright (C) 2021 - present Juergen Zimmermann, Hochschule Karlsruhe
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

// https://github.com/tc39/proposal-type-annotations
// NICHT: Enum, Parameter Properties, Namespace
// https://devblogs.microsoft.com/typescript/a-proposal-for-type-syntax-in-javascript

// Modul in JS = Datei
// Pfad innerhalb von Packages in node_modules ("nicht-relative Imports")
import { type INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
    DocumentBuilder,
    type SwaggerCustomOptions,
    SwaggerModule,
} from '@nestjs/swagger';
import compression from 'compression';
// relativer Import
import { AppModule } from './app.module.js';
import { corsOptions } from './config/cors.js';
import { nodeConfig } from './config/node.js';
import { paths } from './config/paths.js';
import { helmetHandlers } from './security/http/helmet.handler.js';

// Destructuring ab ES 2015
const { httpsOptions, port } = nodeConfig;

// "Arrow Function" ab ES 2015
const setupSwagger = (app: INestApplication) => {
    const config = new DocumentBuilder()
        .setTitle('Buch')
        .setDescription('Beispiel für Software Engineering')
        .setVersion('2025.4.1')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    const options: SwaggerCustomOptions = { customSiteTitle: 'SWE 24/25' };
    SwaggerModule.setup(paths.swagger, app, document, options);
};

// Promise ab ES 2015, vgl: Future in Java
// async/await ab ES 2017, vgl: C#
const bootstrap = async () => {
    // https://expressjs.com/en/advanced/best-practice-security.html#use-tls
    const app = await NestFactory.create(AppModule, { httpsOptions }); // "Shorthand Properties" ab ES 2015

    // Beispiele fuer "Middleware" bei Express:
    //  * Authentifizierung und Autorisierung
    //  * CSP (= Content Security Policy), XSS (= Cross-site scripting attacks) Protection ... durch Helmet
    //  * (De-) Komprimierung durch GZip oder Brotli
    //  * Logging, z.B. von Requests
    //  * Rumpf bei POST- und PUT-Requests einlesen
    // d.h. "Middleware" ist eine Variation der Patterns
    //  * Filter (Interceptoren) und
    //  * Chain of Responsibility

    // https://expressjs.com/en/advanced/best-practice-security.html#use-helmet
    // https://docs.nestjs.com/security/helmet
    // compression von Express fuer GZip-Komprimierung
    // Default "Chunk Size" ist 16 KB: https://github.com/expressjs/compression#chunksize
    app.use(helmetHandlers, compression());

    // https://docs.nestjs.com/techniques/validation
    // https://docs.nestjs.com/techniques/validation#transform-payload-objects
    // https://docs.nestjs.com/exception-filters
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    setupSwagger(app);

    // cors von Express fuer CORS (= cross origin resource sharing)
    app.enableCors(corsOptions);

    await app.listen(port);
};

// Top-level await ab ES 2020
await bootstrap();

// IIFE  = Immediately Invoked Function Expression
// IIAFE = Immediately Invoked Asynchronous Function Expression
// (async () => {
//     await bootstrap(); // ab ES 2017
// })();

// Promise mit then() ab ES 2015
// bootstrap()
//     .then(() => console.log(`Server gestartet auf Port ${port}`)) // eslint-disable-line security-node/detect-crlf
//     .catch((err) => console.error('Fehler bei bootstrap():', err));
