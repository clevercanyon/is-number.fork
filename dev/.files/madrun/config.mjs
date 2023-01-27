#!/usr/bin/env node
/**
 * Mad Run CLI config.
 *
 * @note PLEASE DO NOT EDIT THIS FILE!
 * @note This entire file will be updated automatically.
 * @note Instead of editing here, please review <https://github.com/clevercanyon/skeleton>.
 */
/* eslint-env es2021, node */

import fs from 'node:fs';
import path from 'node:path';
import { dirname } from 'desm';

const __dirname = dirname(import.meta.url);
const projDir = path.resolve(__dirname, '../../..');

export default {
	'envs': async () => ['./dev/.files/bin/envs.mjs {{@}}'],
	'envs:push': async () => ['./dev/.files/bin/envs.mjs push {{@}}'],
	'envs:pull': async () => ['./dev/.files/bin/envs.mjs pull {{@}}'],
	'envs:keys': async () => ['./dev/.files/bin/envs.mjs keys {{@}}'],
	'envs:encrypt': async () => ['./dev/.files/bin/envs.mjs encrypt {{@}}'],
	'envs:decrypt': async () => ['./dev/.files/bin/envs.mjs decrypt {{@}}'],
	'envs:install': async () => ['./dev/.files/bin/envs.mjs install {{@}}'],

	'dev': async (args) => ['npx vite dev' + (args.mode ? '' : ' --mode=dev') + ' {{@}}'],
	'preview': async (args) => ['npx vite preview' + (args.mode ? '' : ' --mode=dev') + ' {{@}}'],
	'build': async (args) => ['npx vite build' + (args.mode ? '' : ' --mode=prod') + ' {{@}}'],

	'install': async () => {
		if (fs.existsSync(path.resolve(projDir, './node_modules'))) {
			return ['./dev/.files/bin/install.mjs {{@}}'];
		}
		return ['npm ci', './dev/.files/bin/install.mjs {{@}}'];
	},
	'install:project': async () => {
		if (fs.existsSync(path.resolve(projDir, './node_modules'))) {
			return ['./dev/.files/bin/install.mjs project {{@}}'];
		}
		return ['npm ci', './dev/.files/bin/install.mjs project {{@}}'];
	},
	'update': async () => ['./dev/.files/bin/update.mjs {{@}}'],
	'update:dotfiles': async () => ['./dev/.files/bin/update.mjs dotfiles {{@}}'],
	'update:project': async (args) => {
		if (args.h || args.v || args.help || args.version) {
			return './dev/.files/bin/update.mjs project {{@}}';
		}
		return ['./dev/.files/bin/update.mjs dotfiles {{--dryRun}}', './dev/.files/bin/update.mjs project {{@}}'];
	},
	'update:projects': async () => ['./dev/.files/bin/update.mjs projects {{@}}'],

	'wrangler': async () => ['CLOUDFLARE_API_TOKEN="${USER_CLOUDFLARE_TOKEN}" npx wrangler {{@}}'],
};
