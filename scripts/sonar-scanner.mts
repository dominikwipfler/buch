/*
 * Copyright (C) 2023 - present Juergen Zimmermann, Hochschule Karlsruhe
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

// Aufruf:   node .\scripts\sonar-scanner.mts

import { exec } from 'node:child_process';
import { platform } from 'node:os';
import { resolve } from 'node:path';

let baseExecPath;
let baseScript = 'sonar-scanner';

// https://nodejs.org/api/os.html#osplatform
const betriebssystem = platform(); // win32, linux, ...
if (betriebssystem === 'win32') {
    baseExecPath = resolve('C:/', 'Zimmermann');
    baseScript += '.bat';
} else {
    baseExecPath = resolve('/', 'Zimmermann');
}

const script = resolve(baseExecPath, 'sonar-scanner', 'bin', baseScript);
console.log(`script=${script}`);
console.log('');

// https://nodejs.org/api/child_process.html#spawning-bat-and-cmd-files-on-windows
exec(script, (err, stdout, stderr) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(stdout);
});
