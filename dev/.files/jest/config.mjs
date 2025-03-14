#!/usr/bin/env node
/**
 * Jest config.
 *
 * Jest is not aware of this config file's location.
 *
 * @note PLEASE DO NOT EDIT THIS FILE!
 * @note This entire file will be updated automatically.
 * @note Instead of editing here, please review <https://github.com/clevercanyon/skeleton>.
 *
 * @see https://jestjs.io/docs/configuration
 */

import fs from 'node:fs';
import path from 'node:path';
import { $fs } from '../../../node_modules/@clevercanyon/utilities.node/dist/index.js';
import exclusions from '../bin/includes/exclusions.mjs';
import extensions from '../bin/includes/extensions.mjs';
import importAliases from '../bin/includes/import-aliases.mjs';
import u from '../bin/includes/utilities.mjs';

const __dirname = $fs.imuDirname(import.meta.url);
const projDir = path.resolve(__dirname, '../../..');

const srcDir = path.resolve(projDir, './src');
const srcDirExists = fs.existsSync(srcDir);

const testsDir = path.resolve(projDir, './tests');
const testsDirExists = fs.existsSync(testsDir);

const pkg = await u.pkg(); // From utilities.

/**
 * Defines Jest configuration.
 */
export default async () => {
    /**
     * Composition.
     */
    return {
        roots: [
            ...(srcDirExists ? [srcDir] : []), //
            ...(testsDirExists ? [testsDir] : []),
            ...(!srcDirExists && !testsDirExists ? [projDir] : []),
        ],
        testPathIgnorePatterns: exclusions.asRegExpStrings([
            ...new Set([
                ...exclusions.localIgnores,
                ...exclusions.logIgnores,
                ...exclusions.backupIgnores,
                ...exclusions.patchIgnores,
                ...exclusions.editorIgnores,
                ...exclusions.toolingIgnores,
                ...exclusions.pkgIgnores,
                ...exclusions.vcsIgnores,
                ...exclusions.osIgnores,
                ...exclusions.dotIgnores,
                ...exclusions.dtsIgnores,
                ...exclusions.configIgnores,
                ...exclusions.lockIgnores,
                ...exclusions.devIgnores,
                ...exclusions.distIgnores,
                ...exclusions.sandboxIgnores,
                ...exclusions.exampleIgnores,
                ...exclusions.docIgnores,
                ...exclusions.benchIgnores,
                ...exclusions.adhocExIgnores,
            ]),
        ]),
        // Configured to run JS tests only; not TypeScript tests.
        // To create and run TypeScript tests, use Vitest instead of Jest.
        testMatch: [
            '**/*.{test|tests|spec|specs}.' + extensions.asBracedGlob([...extensions.byDevGroup.allJavaScript]), //
            '**/{test,tests,spec,specs}/**/*.' + extensions.asBracedGlob([...extensions.byDevGroup.allJavaScript]),
        ],
        moduleNameMapper: importAliases.asRegExpStrings,
        moduleFileExtensions: extensions.noDot([...extensions.byDevGroup.allJavaScript]),
        extensionsToTreatAsEsm: [
            ...('module' === pkg.type
                ? [...extensions.byDevGroup.sJavaScript, ...extensions.byDevGroup.sJavaScriptReact, ...extensions.byDevGroup.mJavaScript, ...extensions.byDevGroup.mJavaScriptReact]
                : [...extensions.byDevGroup.mJavaScript, ...extensions.byDevGroup.mJavaScriptReact]),
        ].filter((e) => e !== '.mjs'), // Jest complains that `.mjs` is always treated as ESM, no matter, so we exclude it here.
    };
};
