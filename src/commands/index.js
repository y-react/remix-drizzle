#!/usr/bin/env node

// npx github:y-react/remix-drizzle create | cf-local
// npx ../remix-drizzle create | cf-local
// https://developers.cloudflare.com/workers/wrangler/commands/

import { createCommand } from 'commander';
import { create } from '../lib/create.js';
import { sync } from '../lib/sync.js';

const CLOUDFLARE_API_URL = 'https://api.cloudflare.com/client/v4';

const cfApi = {
  headers: {
    Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
    'X-Auth-Key': `${process.env.CLOUDFLARE_API_TOKEN}`,
    'Content-Type': 'application/json',
  },
  project: `${CLOUDFLARE_API_URL}/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/pages/projects`,
  kv_namespace: `${CLOUDFLARE_API_URL}/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces`,
  d1_database: `${CLOUDFLARE_API_URL}/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/d1/database`,
  secrets: `${CLOUDFLARE_API_URL}/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/d1/database`,
};

// PUT https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/${scriptName}/secrets
// Content-Type: application/json
// { "name", "${secretName}", "text", "${secretValue}", "type", "secret_text" }

process.on('SIGINT', () => process.exit());
process.on('SIGTERM', () => process.exit());

const program = createCommand();
program.name('remix-drizzle').version('1.0.0');

program
  .command('cf-sync')
  .description('Sync cloudflare details')
  .action(async (cmdAndOptions) => {
    const dev = await sync.checkLocal();
    const preview = await sync.checkLocal('preview');
    const production = await sync.checkLocal('production');
    console.log(dev.env, preview.env, production.env);
    process.exit(0);
  });

program
  .command('cf-local')
  .description('Sync cloudflare details')
  .action(async (cmdAndOptions) => {
    await sync.checkLocal();
    await sync.checkLocal('preview');
    await sync.checkLocal('production');
    process.exit(0);
  });

program
  .command('cf-wrangler')
  .description('List wrangler config')
  .action(async (cmdAndOptions) => {
    await sync.checkWrangler('./wrangler.toml');
    process.exit(0);
  });

program
  .command('cf-remote')
  .description('List remote cloudflare config')
  .action(async (cmdAndOptions) => {
    sync.checkRemote('d3-pages', cfApi);
  });

program
  .command('create')
  .description('Create a project from remix-drizzle template')
  .option('-x, --no-delete', "don't delete")
  .option('--no-custom', 'no base customization')
  .option('--no-install', 'no npm install')
  .option('--no-run', 'no npm run scripts')
  .action(async (cmdAndOptions) => {
    if (cmdAndOptions.delete) await create.doDelete();
    await create.doCreate();
    await create.doGitInit('y-core@outlook.com', 'Johan Meyer');
    await create.doGitCommit('Initial Create', '--quiet');
    await create.doEditPackage();
    await create.doSortPackage();
    await create.doCheckUpdates();
    await create.doGitCommit('Update packages', '--quiet');
    if (cmdAndOptions.custom) await create.doCustomise();
    if (cmdAndOptions.install) {
      await create.doInstall();
      if (cmdAndOptions.run) {
        await create.doRun();
      }
    }
    await create.doGitCommit('Overlay template', '--quiet');
  });

program.parse();
