/**
 * Import aliases config file.
 *
 * @note PLEASE DO NOT EDIT THIS FILE!
 * @note This entire file will be updated automatically.
 * @note Instead of editing here, please review <https://github.com/clevercanyon/skeleton>.
 */

import fs from 'node:fs';
import path from 'node:path';
import { $fs } from '../../../../node_modules/@clevercanyon/utilities.node/dist/index.js';
import { $is, $json, $str } from '../../../../node_modules/@clevercanyon/utilities/dist/index.js';

const __dirname = $fs.imuDirname(import.meta.url);
const projDir = path.resolve(__dirname, '../../../..');

const pkgFile = path.resolve(projDir, './package.json');
const pkg = $json.parse(fs.readFileSync(pkgFile).toString());

/**
 * Parses userland aliases.
 */
const userlandAliasesAsGlobs = {};
const userlandAliasesAsRegExpStrings = {};
const userlandAliasesAsFindReplaceRegExps = [];

for (const [glob, relPath] of Object.entries(pkg.imports || {})) {
    // We do not allow nesting and/or any subpath conditionals.
    if (!$is.string(relPath)) throw new Error('Invalid subpath imports.');

    let regExpRepCounter = 0; // e.g., `$1`, `$2`, `$3`, etc.
    // For some reason, Vite chooses not to resolve `url()` values in CSS whenever they begin with a `#`.
    // Unfortunate, because our import aliases use `#`. To fix, we prepend `url()` values starting with `#`, with `&#`.
    // For that reason, any glob pattern found here that begins with `#` will be updated to accept an optional leading `&`.
    // This only impacts Vite/PostCSS, and therefore we only need to alter the regular expression variants of our import aliases.
    // See also: `./dev/.files/postcss/config.mjs` for details regarding the way we automatically prepend CSS `url()`s with `&#`.
    const regExpString = '^' + (glob.startsWith('#') ? '&?' : '') + $str.escRegExp(glob).replace(/\\\*/gu, '(.+?)') + '$';

    userlandAliasesAsGlobs[glob] = path.resolve(projDir, relPath);
    userlandAliasesAsRegExpStrings[regExpString] = path.resolve(projDir, relPath).replace(/\*/gu, () => '$' + String(++regExpRepCounter));
    userlandAliasesAsFindReplaceRegExps.push({ find: new RegExp(regExpString, 'u'), replacement: userlandAliasesAsRegExpStrings[regExpString] });
}

/**
 * Defines import aliases.
 *
 * Userland aliases; i.e., node subpath imports, begin with `#` and are defined in `./package.json`, such that we can
 * easily customize on a per-project basis and attain native support for aliases in; e.g., dev-only scripts.
 *
 * Regarding precedence of userland aliases. Node’s algorithm gives longer pattern matching keys higher precedence.
 * However, key length is actually determined by where the `*` appears in each pattern. Please consult Node’s resolution
 * algorithm. What is very important is that while pattern declaration order doesn’t actually matter to Node; i.e.,
 * given what was just stated about the way Node determines precedence — it **does** matter to our build tools.
 *
 * - IMPORTANT: Always declare subpath imports in the descending order of their precedence in Node. This way Vite, Rollup,
 *   esBuild, and possibly other build tools or plugins can iterate these patterns using a first-to-match strategy.
 */
export default {
    asGlobs: {
        ...userlandAliasesAsGlobs, // In descending order of their precedence in Node.

        'react': path.resolve(projDir, './node_modules/preact/compat'),
        'react/jsx-runtime': path.resolve(projDir, './node_modules/preact/jsx-runtime'),

        'react-dom': path.resolve(projDir, './node_modules/preact/compat'),
        'react-dom/test-utils': path.resolve(projDir, './node_modules/preact/test-utils'),
    },
    asRegExpStrings: {
        ...userlandAliasesAsRegExpStrings, // In descending order of their precedence in Node.

        '^react$': path.resolve(projDir, './node_modules/preact/compat'),
        '^react/jsx-runtime$': path.resolve(projDir, './node_modules/preact/jsx-runtime'),

        '^react-dom$': path.resolve(projDir, './node_modules/preact/compat'),
        '^react-dom/test-utils$': path.resolve(projDir, './node_modules/preact/test-utils'),
    },
    asFindReplaceRegExps: [
        ...userlandAliasesAsFindReplaceRegExps, // In descending order of their precedence in Node.

        { find: /^react$/u, replacement: path.resolve(projDir, './node_modules/preact/compat') },
        { find: /^react\/jsx-runtime$/u, replacement: path.resolve(projDir, './node_modules/preact/jsx-runtime') },

        { find: /^react-dom$/u, replacement: path.resolve(projDir, './node_modules/preact/compat') },
        { find: /^react-dom\/test-utils$/u, replacement: path.resolve(projDir, './node_modules/preact/test-utils') },
    ],
};
