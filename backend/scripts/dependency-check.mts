// Copyright (C) 2023 - present Juergen Zimmermann, Hochschule Karlsruhe
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
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

// Aufruf:      cd scripts
//              node dependency-check.mts
// ggf. z.B.    npm ls express

// TODO dset https://github.com/lukeed/dset/issues/44#issuecomment-2122866311
// TODO graphql https://nvd.nist.gov/vuln/detail/CVE-2024-50312

import { exec } from 'node:child_process';
import { platform } from 'node:os';
import { resolve } from 'node:path';

const nvdApiKey = '47fbc0a4-9240-4fda-9a26-d7d5624c16bf';
const project = 'buch';

let baseExecPath;
let baseScript = 'dependency-check';
let baseDataPath;

// https://nodejs.org/api/os.html#osplatform
const betriebssystem = platform(); // win32, linux, ...
if (betriebssystem === 'win32') {
    baseExecPath = resolve('C:/', 'Zimmermann');
    baseDataPath = resolve('C:/', 'Zimmermann');
    baseScript += '.bat';
} else {
    baseExecPath = resolve('/', 'Zimmermann');
    baseDataPath = resolve('/', 'Zimmermann');
}
const script = resolve(baseExecPath, 'dependency-check', 'bin', baseScript);
console.log(`script=${script}`);

const dataPath = resolve(baseDataPath, 'dependency-check-data');
const packageLockPath = resolve('..', 'package-lock.json');
const reportPath = '.';

let options = `--nvdApiKey ${nvdApiKey} --project ${project} `.concat(
    `--scan ${packageLockPath} --suppression suppression.xml `,
    `--out ${reportPath} --data ${dataPath} `,
    // dependency-check.bat --advancedHelp
    '--nodeAuditSkipDevDependencies ',
    '--disableArchive ',
    '--disableAssembly ',
    '--disableAutoconf ',
    '--disableBundleAudit ',
    '--disableCarthageAnalyzer ',
    '--disableCentral ',
    '--disableCentralCache ',
    '--disableCmake ',
    '--disableCocoapodsAnalyzer ',
    '--disableComposer ',
    '--disableCpan ',
    '--disableDart ',
    '--disableGolangDep ',
    '--disableGolangMod ',
    '--disableJar ',
    '--disableMavenInstall ',
    '--disableMSBuild ',
    '--disableNugetconf ',
    '--disableNuspec ',
    '--disablePip ',
    '--disablePipfile ',
    '--disablePnpmAudit ',
    '--disablePoetry ',
    '--disablePyDist ',
    '--disablePyPkg ',
    '--disableRubygems ',
    '--disableSwiftPackageManagerAnalyzer ',
    '--disableSwiftPackageResolvedAnalyzer ',
    '--disableYarnAudit',
);
console.log(`options=${options}`);
console.log('');

// https://nodejs.org/api/child_process.html#spawning-bat-and-cmd-files-on-windows
exec(`${script} ${options}`, (err, stdout, stderr) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(stdout);
});
