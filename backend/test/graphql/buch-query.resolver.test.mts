/* eslint-disable @typescript-eslint/no-non-null-assertion */
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

import { type GraphQLRequest } from '@apollo/server';
import { beforeAll, describe, expect, test } from 'vitest';
import { HttpStatus } from '@nestjs/common';
import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import { type Buch, type BuchArt } from '../../src/buch/entity/buch.entity.js';
import { type GraphQLResponseBody } from './graphql.mjs';
import { baseURL, httpsAgent } from '../constants.mjs';

type BuchDTO = Omit<
    Buch,
    'abbildungen' | 'aktualisiert' | 'erzeugt' | 'rabatt'
> & {
    rabatt: string;
};

// -----------------------------------------------------------------------------
// T e s t d a t e n
// -----------------------------------------------------------------------------
const idVorhanden = '1';

const titelVorhanden = 'Alpha';
const teilTitelVorhanden = 'a';
const teilTitelNichtVorhanden = 'abc';

const isbnVorhanden = '978-3-897-22583-1';

const ratingMin = 3;
const ratingNichtVorhanden = 99;

// -----------------------------------------------------------------------------
// T e s t s
// -----------------------------------------------------------------------------
// Test-Suite
describe('GraphQL Queries', () => {
    let client: AxiosInstance;
    const graphqlPath = 'graphql';

    // Axios initialisieren
    beforeAll(async () => {
        const baseUrlGraphQL = `${baseURL}/`;
        client = axios.create({
            baseURL: baseUrlGraphQL,
            httpsAgent,
            // auch Statuscode 400 als gueltigen Request akzeptieren, wenn z.B.
            // ein Enum mit einem falschen String getestest wird
            validateStatus: () => true,
        });
    });

    test.concurrent('Buch zu vorhandener ID', async () => {
        // given
        const body: GraphQLRequest = {
            query: `
                {
                    buch(id: "${idVorhanden}") {
                        version
                        isbn
                        rating
                        art
                        preis
                        lieferbar
                        datum
                        homepage
                        schlagwoerter
                        titel {
                            titel
                        }
                        rabatt(short: true)
                    }
                }
            `,
        };

        // when
        const { status, headers, data }: AxiosResponse<GraphQLResponseBody> =
            await client.post(graphqlPath, body);

        // then
        expect(status).toBe(HttpStatus.OK);
        expect(headers['content-type']).toMatch(/json/iu);
        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();

        const { buch } = data.data! as { buch: BuchDTO };

        expect(buch.titel?.titel).toMatch(/^\w/u);
        expect(buch.version).toBeGreaterThan(-1);
        expect(buch.id).toBeUndefined();
    });

    test.concurrent('Buch zu nicht-vorhandener ID', async () => {
        // given
        const id = '999999';
        const body: GraphQLRequest = {
            query: `
                {
                    buch(id: "${id}") {
                        titel {
                            titel
                        }
                    }
                }
            `,
        };

        // when
        const { status, headers, data }: AxiosResponse<GraphQLResponseBody> =
            await client.post(graphqlPath, body);

        // then
        expect(status).toBe(HttpStatus.OK);
        expect(headers['content-type']).toMatch(/json/iu);
        expect(data.data!.buch).toBeNull();

        const { errors } = data;

        expect(errors).toHaveLength(1);

        const [error] = errors!;
        const { message, path, extensions } = error;

        expect(message).toBe(`Es gibt kein Buch mit der ID ${id}.`);
        expect(path).toBeDefined();
        expect(path![0]).toBe('buch');
        expect(extensions).toBeDefined();
        expect(extensions!.code).toBe('BAD_USER_INPUT');
    });

    test.concurrent('Buch zu vorhandenem Titel', async () => {
        // given
        const body: GraphQLRequest = {
            query: `
                {
                    buecher(suchkriterien: {
                        titel: "${titelVorhanden}"
                    }) {
                        art
                        titel {
                            titel
                        }
                    }
                }
            `,
        };

        // when
        const { status, headers, data }: AxiosResponse<GraphQLResponseBody> =
            await client.post(graphqlPath, body);

        // then
        expect(status).toBe(HttpStatus.OK);
        expect(headers['content-type']).toMatch(/json/iu);
        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();

        const { buecher } = data.data! as { buecher: BuchDTO[] };

        expect(buecher).not.toHaveLength(0);
        expect(buecher).toHaveLength(1);

        const [buch] = buecher;

        expect(buch!.titel?.titel).toBe(titelVorhanden);
    });

    test.concurrent('Buch zu vorhandenem Teil-Titel', async () => {
        // given
        const body: GraphQLRequest = {
            query: `
                {
                    buecher(suchkriterien: {
                        titel: "${teilTitelVorhanden}"
                    }) {
                        titel {
                            titel
                        }
                    }
                }
            `,
        };

        // when
        const { status, headers, data }: AxiosResponse<GraphQLResponseBody> =
            await client.post(graphqlPath, body);

        // then
        expect(status).toBe(HttpStatus.OK);
        expect(headers['content-type']).toMatch(/json/iu);
        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();

        const { buecher } = data.data! as { buecher: BuchDTO[] };

        expect(buecher).not.toHaveLength(0);

        buecher
            .map((buch) => buch.titel)
            .forEach((titel) =>
                expect(titel?.titel?.toLowerCase()).toStrictEqual(
                    expect.stringContaining(teilTitelVorhanden),
                ),
            );
    });

    test.concurrent('Buch zu nicht vorhandenem Titel', async () => {
        // given
        const body: GraphQLRequest = {
            query: `
                {
                    buecher(suchkriterien: {
                        titel: "${teilTitelNichtVorhanden}"
                    }) {
                        art
                        titel {
                            titel
                        }
                    }
                }
            `,
        };

        // when
        const { status, headers, data }: AxiosResponse<GraphQLResponseBody> =
            await client.post(graphqlPath, body);

        // then
        expect(status).toBe(HttpStatus.OK);
        expect(headers['content-type']).toMatch(/json/iu);
        expect(data.data!.buecher).toBeNull();

        const { errors } = data;

        expect(errors).toHaveLength(1);

        const [error] = errors!;
        const { message, path, extensions } = error;

        expect(message).toMatch(/^Keine Buecher gefunden:/u);
        expect(path).toBeDefined();
        expect(path![0]).toBe('buecher');
        expect(extensions).toBeDefined();
        expect(extensions!.code).toBe('BAD_USER_INPUT');
    });

    test.concurrent('Buch zu vorhandener ISBN-Nummer', async () => {
        // given
        const body: GraphQLRequest = {
            query: `
                {
                    buecher(suchkriterien: {
                        isbn: "${isbnVorhanden}"
                    }) {
                        isbn
                        titel {
                            titel
                        }
                    }
                }
            `,
        };

        // when
        const { status, headers, data }: AxiosResponse<GraphQLResponseBody> =
            await client.post(graphqlPath, body);

        // then
        expect(status).toBe(HttpStatus.OK);
        expect(headers['content-type']).toMatch(/json/iu);
        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();

        const { buecher } = data.data! as { buecher: BuchDTO[] };

        expect(buecher).not.toHaveLength(0);
        expect(buecher).toHaveLength(1);

        const [buch] = buecher;
        const { isbn, titel } = buch!;

        expect(isbn).toBe(isbnVorhanden);
        expect(titel?.titel).toBeDefined();
    });

    test.concurrent('Buecher mit Mindest-"rating"', async () => {
        // given
        const body: GraphQLRequest = {
            query: `
                {
                    buecher(suchkriterien: {
                        rating: ${ratingMin},
                        titel: "${teilTitelVorhanden}"
                    }) {
                        rating
                        titel {
                            titel
                        }
                    }
                }
            `,
        };

        // when
        const { status, headers, data }: AxiosResponse<GraphQLResponseBody> =
            await client.post(graphqlPath, body);

        // then
        expect(status).toBe(HttpStatus.OK);
        expect(headers['content-type']).toMatch(/json/iu);
        expect(data.errors).toBeUndefined();

        expect(data.data).toBeDefined();

        const { buecher } = data.data! as { buecher: BuchDTO[] };

        expect(buecher).not.toHaveLength(0);

        buecher.forEach((buch) => {
            const { rating, titel } = buch;

            expect(rating).toBeGreaterThanOrEqual(ratingMin);
            expect(titel?.titel?.toLowerCase()).toStrictEqual(
                expect.stringContaining(teilTitelVorhanden),
            );
        });
    });

    test.concurrent('Kein Buch zu nicht-vorhandenem "rating"', async () => {
        // given
        const body: GraphQLRequest = {
            query: `
                {
                    buecher(suchkriterien: {
                        rating: ${ratingNichtVorhanden}
                    }) {
                        titel {
                            titel
                        }
                    }
                }
            `,
        };

        // when
        const { status, headers, data }: AxiosResponse<GraphQLResponseBody> =
            await client.post(graphqlPath, body);

        // then
        expect(status).toBe(HttpStatus.OK);
        expect(headers['content-type']).toMatch(/json/iu);
        expect(data.data!.buecher).toBeNull();

        const { errors } = data;

        expect(errors).toHaveLength(1);

        const [error] = errors!;
        const { message, path, extensions } = error;

        expect(message).toMatch(/^Keine Buecher gefunden:/u);
        expect(path).toBeDefined();
        expect(path![0]).toBe('buecher');
        expect(extensions).toBeDefined();
        expect(extensions!.code).toBe('BAD_USER_INPUT');
    });

    test.concurrent('Buecher zur Art "EPUB"', async () => {
        // given
        const buchArt: BuchArt = 'EPUB';
        const body: GraphQLRequest = {
            query: `
                {
                    buecher(suchkriterien: {
                        art: ${buchArt}
                    }) {
                        art
                        titel {
                            titel
                        }
                    }
                }
            `,
        };

        // when
        const { status, headers, data }: AxiosResponse<GraphQLResponseBody> =
            await client.post(graphqlPath, body);

        // then
        expect(status).toBe(HttpStatus.OK);
        expect(headers['content-type']).toMatch(/json/iu);
        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();

        const { buecher } = data.data! as { buecher: BuchDTO[] };

        expect(buecher).not.toHaveLength(0);

        buecher.forEach((buch) => {
            const { art, titel } = buch;

            expect(art).toBe(buchArt);
            expect(titel?.titel).toBeDefined();
        });
    });

    test.concurrent('Buecher zur einer ungueltigen Art', async () => {
        // given
        const buchArt = 'UNGUELTIG';
        const body: GraphQLRequest = {
            query: `
                {
                    buecher(suchkriterien: {
                        art: ${buchArt}
                    }) {
                        titel {
                            titel
                        }
                    }
                }
            `,
        };

        // when
        const { status, headers, data }: AxiosResponse<GraphQLResponseBody> =
            await client.post(graphqlPath, body);

        // then
        expect(status).toBe(HttpStatus.BAD_REQUEST);
        expect(headers['content-type']).toMatch(/json/iu);
        expect(data.data).toBeUndefined();

        const { errors } = data;

        expect(errors).toHaveLength(1);

        const [error] = errors!;
        const { extensions } = error;

        expect(extensions).toBeDefined();
        expect(extensions!.code).toBe('GRAPHQL_VALIDATION_FAILED');
    });

    test.concurrent('Buecher mit lieferbar=true', async () => {
        // given
        const body: GraphQLRequest = {
            query: `
                {
                    buecher(suchkriterien: {
                        lieferbar: true
                    }) {
                        lieferbar
                        titel {
                            titel
                        }
                    }
                }
            `,
        };

        // when
        const { status, headers, data }: AxiosResponse<GraphQLResponseBody> =
            await client.post(graphqlPath, body);

        // then
        expect(status).toBe(HttpStatus.OK);
        expect(headers['content-type']).toMatch(/json/iu);
        expect(data.errors).toBeUndefined();
        expect(data.data).toBeDefined();

        const { buecher } = data.data! as { buecher: BuchDTO[] };

        expect(buecher).not.toHaveLength(0);

        buecher.forEach((buch) => {
            const { lieferbar, titel } = buch;

            expect(lieferbar).toBe(true);
            expect(titel?.titel).toBeDefined();
        });
    });
});

/* eslint-enable @typescript-eslint/no-non-null-assertion */
