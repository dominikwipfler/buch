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

/// <reference types="vitest/config" />
import { defineConfig } from 'vite';

// https://vitest.dev/config
export default defineConfig({
    test: {
        name: 'Beispiel',
         // default ist ['**\/*.{test,spec}.?(c|m)[jt]s?(x)']
        include: ['test/**/*.test.mts'],
        globals: true,
        environment: 'node',
        // https://vitest.dev/config/#globalsetup
        globalSetup: './test/setup.global.mts',
        testTimeout: 10_000,
        // https://vitest.dev/guide/coverage
        // https://vitest.dev/config/#coverage
        coverage: {
            include: ['src/**'],
            exclude: ['src/config/resources/**'],
            extension: ['.mts', '.ts'],
            // default ist ['text', 'html', 'clover', 'json']
            reporter: ['text', 'html'],
            // default ist 'v8'
            // provider: 'istanbul',
        },
    },
})
