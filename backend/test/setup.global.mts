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

// https://vitest.dev/config/#globalsetup

import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import {
    type GraphQLQuery,
    type GraphQLResponseBody,
} from './graphql/graphql.mjs';
import { TestProject } from 'vitest/node';
import { baseURL, httpsAgent, tokenPath } from './constants.mjs';

const client = axios.create({
    baseURL,
    httpsAgent,
    validateStatus: (status) => status < 500,
});

type TokenResult = {
    access_token: string;
};

type DbPopulateResult = {
    db_populate: string;
};

const usernameDefault = 'admin';
const usernameUser = 'user';
const passwordDefault = 'p'; // NOSONAR

const tokenRest = async (
    axiosInstance: AxiosInstance,
    username = usernameDefault,
    password = passwordDefault,
) => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/x-www-form-urlencoded',
    };
    const response: AxiosResponse<TokenResult> = await axiosInstance.post(
        tokenPath,
        `username=${username}&password=${password}`,
        { headers, httpsAgent },
    );

    const { access_token } = response.data;
    if (access_token === undefined || typeof access_token !== 'string') {
        throw new Error('Der Token fuer REST ist kein String');
    }
    console.log(`REST: access_token=${access_token}`);
    return access_token;
};

const tokenGraphQL = async (
    axiosInstance: AxiosInstance,
    username: string = usernameDefault,
    password: string = passwordDefault,
): Promise<string> => {
    const body: GraphQLQuery = {
        query: `
            mutation {
                token(
                    username: "${username}",
                    password: "${password}"
                ) {
                    access_token
                }
            }
        `,
    };

    const response: AxiosResponse<GraphQLResponseBody> =
        await axiosInstance.post('graphql', body, { httpsAgent });

    const data = response.data.data!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    const { access_token } = data.token;
    if (access_token === undefined || typeof access_token !== 'string') {
        throw new Error('Der Token fuer GraphQL ist kein String');
    }
    console.log(`GraphQL: access_token=${access_token}`);
    return access_token;
};

const dbPopulate = async (axiosInstance: AxiosInstance, token: string) => {
    const headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
    };

    const response: AxiosResponse<DbPopulateResult> = await axiosInstance.post(
        '/dev/db_populate',
        '',
        { headers },
    );
    const { db_populate } = response.data;
    if (db_populate !== 'success') {
        throw new Error('Fehler bei POST /dev/db_populate');
    }
    console.log('DB wurde neu geladen');
};

// https://vitest.dev/config/#globalsetup
export default async function setup(project: TestProject) {
    const accessTokenRest = await tokenRest(client);
    project.provide('tokenRest', accessTokenRest);

    const accessTokenRestUser = await tokenRest(client, usernameUser);
    project.provide('tokenRestUser', accessTokenRestUser);

    const accessTokenGraphql = await tokenGraphQL(client);
    project.provide('tokenGraphql', accessTokenGraphql);

    const accessTokenGraphqlUser = await tokenGraphQL(client, usernameUser);
    project.provide('tokenGraphqlUser', accessTokenGraphqlUser);

    await dbPopulate(client, accessTokenRest);
}

// https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
declare module 'vitest' {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    export interface ProvidedContext {
        tokenRest: string;
        tokenRestUser: string;
        tokenGraphql: string;
        tokenGraphqlUser: string;
    }
}
