// Copyright (C) 2025 - present Juergen Zimmermann, Hochschule Karlsruhe
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

// Tests mit
//  * Vitest    https://vitest.dev
//  * jest      https://jestjs.io
//  * Mocha     https://mochajs.org
//  * node:test ab Node 18 https://nodejs.org/download/rc/v18.0.0-rc.1/docs/api/test.html

// https://github.com/testjavascript/nodejs-integration-tests-best-practices
// axios: https://github.com/axios/axios

// Alternativen zu axios:
// https://github.com/request/request/issues/3143
// https://blog.bitsrc.io/comparing-http-request-libraries-for-2019-7bedb1089c83
//    got         https://github.com/sindresorhus/got
//    node-fetch  https://github.com/node-fetch/node-fetch
//                https://fetch.spec.whatwg.org
//                https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
//    needle      https://github.com/tomas/needle
//    ky          https://github.com/sindresorhus/ky

import { beforeAll, describe, expect, test } from 'vitest';
import { HttpStatus } from '@nestjs/common';
import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import { type Buch } from '../../src/buch/entity/buch.entity.js';
import { baseURL, httpsAgent } from '../constants.mjs';
import { type ErrorResponse } from './error-response.mjs';

// -----------------------------------------------------------------------------
// T e s t d a t e n
// -----------------------------------------------------------------------------
const idVorhanden = '1';
const idNichtVorhanden = '999999';
const idVorhandenETag = '1';
const idFalsch = 'xy';

// -----------------------------------------------------------------------------
// T e s t s
// -----------------------------------------------------------------------------
// Test-Suite
describe('GET /rest/:id', () => {
    let client: AxiosInstance;

    // Axios initialisieren
    beforeAll(async () => {
        const restUrl = `${baseURL}/rest`;
        client = axios.create({
            baseURL: restUrl,
            httpsAgent,
            validateStatus: (status) => status < 500,
        });
    });

    test.concurrent('Buch zu vorhandener ID', async () => {
        // given
        const url = `/${idVorhanden}`;

        // when
        const { status, headers, data }: AxiosResponse<Buch> =
            await client.get(url);

        // then
        expect(status).toBe(HttpStatus.OK);
        expect(headers['content-type']).toMatch(/json/iu);

        const { id } = data;

        expect(id?.toString()).toBe(idVorhanden);
    });

    test.concurrent('Kein Buch zu nicht-vorhandener ID', async () => {
        // given
        const url = `/${idNichtVorhanden}`;

        // when
        const { status, data }: AxiosResponse<ErrorResponse> =
            await client.get(url);

        // then
        expect(status).toBe(HttpStatus.NOT_FOUND);

        const { error, message, statusCode } = data;

        expect(error).toBe('Not Found');
        expect(message).toStrictEqual(expect.stringContaining(message));
        expect(statusCode).toBe(HttpStatus.NOT_FOUND);
    });

    test.concurrent('Kein Buch zu falscher ID', async () => {
        // given
        const url = `/${idFalsch}`;

        // when
        const { status, data }: AxiosResponse<ErrorResponse> =
            await client.get(url);

        // then
        expect(status).toBe(HttpStatus.NOT_FOUND);

        const { error, statusCode } = data;

        expect(error).toBe('Not Found');
        expect(statusCode).toBe(HttpStatus.NOT_FOUND);
    });

    test.concurrent('Buch zu vorhandener ID mit ETag', async () => {
        // given
        const url = `/${idVorhandenETag}`;

        // when
        const { status, data }: AxiosResponse<string> = await client.get(url, {
            headers: { 'If-None-Match': '"0"' },
        });

        // then
        expect(status).toBe(HttpStatus.NOT_MODIFIED);
        expect(data).toBe('');
    });
});
