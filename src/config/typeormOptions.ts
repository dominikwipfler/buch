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
 * Das Modul enthält die Konfiguration für den Zugriff auf die DB.
 * @packageDocumentation
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { type DataSourceOptions } from 'typeorm';
import { Buch } from '../buch/entity/buch.entity.js';
import { entities } from '../buch/entity/entities.js';
import { RESOURCES_DIR, config } from './app.js';
import { dbType } from './db.js';
import { logLevel } from './logger.js';
import { nodeConfig } from './node.js';
import { SnakeNamingStrategy } from './typeormNamingStrategy.js';

const { db } = config;

if (db !== undefined) {
    if (db.name !== undefined && typeof db.name !== 'string') {
        throw new TypeError(
            `Der konfigurierte DB-Name ist kein String: ${db.name}`,
        );
    }
    if (db.host !== undefined && typeof db.host !== 'string') {
        throw new TypeError(
            `Der konfigurierte Rechnername für den DB-Server ist kein String: ${db.host}`,
        );
    }
    if (db.username !== undefined && typeof db.username !== 'string') {
        throw new TypeError(
            `Der konfigurierte username für die DB ist kein String: ${db.username}`,
        );
    }
    if (db.password !== undefined && typeof db.password !== 'string') {
        throw new TypeError('Das konfigurierte DB-Passwort ist kein String');
    }
    if (
        db.passwordAdmin !== undefined &&
        typeof db.passwordAdmin !== 'string'
    ) {
        throw new TypeError(
            'Das konfigurierte Administrations-Passwort für die DB ist kein String',
        );
    }
}

// "Optional Chaining" und "Nullish Coalescing" ab ES2020
const database = (db?.name as string | undefined) ?? Buch.name.toLowerCase();

const host = (db?.host as string | undefined) ?? 'localhost';
const username =
    (db?.username as string | undefined) ?? Buch.name.toLowerCase();
const pass = (db?.password as string | undefined) ?? 'p';
const passAdmin = (db?.passwordAdmin as string | undefined) ?? 'p';

// https://github.com/tonivj5/typeorm-naming-strategies/blob/master/src/snake-naming.strategy.ts
// https://github.com/typeorm/typeorm/blob/master/src/naming-strategy/DefaultNamingStrategy.ts
// https://github.com/typeorm/typeorm/blob/master/sample/sample12-custom-naming-strategy/naming-strategy/CustomNamingStrategy.ts
const namingStrategy = new SnakeNamingStrategy();

// logging bei TypeORM durch console.log()
const logging =
    (nodeConfig.nodeEnv === 'development' || nodeConfig.nodeEnv === 'test') &&
    logLevel === 'debug';
const logger = 'advanced-console';

export const dbDir = path.resolve(nodeConfig.resourcesDir, dbType);
console.debug('dbDir = %s', dbDir);

// TODO records als "deeply immutable data structure" (Stage 2)
// https://github.com/tc39/proposal-record-tuple
let dataSourceOptions: DataSourceOptions;
switch (dbType) {
    case 'postgres': {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        const cert = readFileSync(
            path.resolve(dbDir, 'certificate.cer'), // eslint-disable-line sonarjs/no-duplicate-string
        );
        dataSourceOptions = {
            type: 'postgres',
            host,
            port: 5432,
            username,
            password: pass,
            database,
            schema: username,
            poolSize: 10,
            entities,
            namingStrategy,
            logging,
            logger,
            ssl: { cert },
            extra: { ssl: { rejectUnauthorized: false } },
        };
        break;
    }
    case 'mysql': {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        const cert = readFileSync(path.resolve(dbDir, 'certificate.cer'));
        dataSourceOptions = {
            type: 'mysql',
            host,
            port: 3306,
            username,
            password: pass,
            database,
            poolSize: 10,
            entities,
            namingStrategy,
            supportBigNumbers: true,
            logging,
            logger,
            ssl: { cert },
            extra: { ssl: { rejectUnauthorized: false } },
        };
        break;
    }
    // 'better-sqlite3' erfordert node-gyp zum Uebersetzen, wenn das Docker-Image gebaut wird
    // ${env:LOCALAPPDATA}\node-gyp\Cache\<Node_Version>\include\node\v8config.h
    // npm rebuild better-sqlite3 --update-binary
    // npm i better-sqlite3
    case 'sqlite': {
        const sqliteDatabase = path.resolve(
            RESOURCES_DIR,
            `${database}.sqlite`,
        );
        dataSourceOptions = {
            type: 'sqlite',
            // type: 'better-sqlite3',
            database: sqliteDatabase,
            entities,
            namingStrategy,
            logging,
            logger,
        };
        break;
    }
}
Object.freeze(dataSourceOptions);
export const typeOrmModuleOptions = dataSourceOptions;

if (logLevel === 'debug') {
    // "rest properties" ab ES 2018: https://github.com/tc39/proposal-object-rest-spread
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { password, ssl, ...typeOrmModuleOptionsLog } =
        typeOrmModuleOptions as any;
    console.debug('typeOrmModuleOptions = %o', typeOrmModuleOptionsLog);
}

export const dbPopulate = db?.populate === true;
let adminDataSourceOptionsTemp: DataSourceOptions | undefined;
if (dbType === 'postgres') {
    const cert = readFileSync(path.resolve(dbDir, 'certificate.cer')); // eslint-disable-line security/detect-non-literal-fs-filename
    adminDataSourceOptionsTemp = {
        type: 'postgres',
        host,
        port: 5432,
        username: 'postgres',
        password: passAdmin,
        database,
        schema: database,
        namingStrategy,
        logging,
        logger,
        ssl: { cert },
        extra: { ssl: { rejectUnauthorized: false } },
    };
} else if (dbType === 'mysql') {
    const cert = readFileSync(path.resolve(dbDir, 'certificate.cer')); // eslint-disable-line security/detect-non-literal-fs-filename
    adminDataSourceOptionsTemp = {
        type: 'mysql',
        host,
        port: 3306,
        username: 'root',
        password: passAdmin,
        database,
        namingStrategy,
        supportBigNumbers: true,
        logging,
        logger,
        ssl: { cert },
        extra: { ssl: { rejectUnauthorized: false } },
    };
}
export const adminDataSourceOptions = adminDataSourceOptionsTemp;
