#!/usr/bin/env node

// npm exec github:y-react/remix-drizzle
// npm exec ../remix-drizzle/

import { createCommand } from 'commander';
import { copy, execsh, execute, path, rm, inlineEdit } from '../lib/fs.js';

const currentFolder = process.cwd();
const templateFolder = path.resolve(import.meta.dirname, '../templates/');

const program = createCommand();
program.name('create').version('1.0.0').description('Create from templates');

program
  .description('Create base remix template')
  .option('-x, --no-delete', "don't delete")
  .option('--no-custom', 'no base customization')
  .option('--no-install', 'no npm install')
  .option('--no-run', 'no npm run scripts')
  .action(async (cmdAndOptions) => {
    if (cmdAndOptions.delete) {
      await execsh`rm -rf ${currentFolder}/*`;
      await execsh`rm -rf ${currentFolder}/.[a-z0-9]*`;
    }

    await execute`npx create-remix@latest ${currentFolder} --template remix-run/remix/templates/cloudflare --overwrite --no-install --no-git-init`;

    if (cmdAndOptions.install) {
      await execute`npm uninstall @cloudflare/workers-types`;
      await execute`npm install -y @headlessui/react @heroicons/react clsx drizzle-orm framer-motion next-themes remix-auth remix-auth-totp remix-utils tiny-invariant`;
      await execute`npm install -y -D @svgx/vite-plugin-react drizzle-kit eslint-plugin-simple-import-sort prettier-plugin-tailwindcss git+https://github.com/ycore/privatize remix-development-tools vite-env-only wrangler@latest`;
    }

    if (cmdAndOptions.custom) {
      copy(
        path.resolve(templateFolder, '.dev.vars'),
        path.resolve(currentFolder, '.dev.vars')
      );
      copy(
        path.resolve(templateFolder, '.prettierrc'),
        path.resolve(currentFolder, '.prettierrc')
      );
      copy(
        path.resolve(templateFolder, 'README.md'),
        path.resolve(currentFolder, 'README.md')
      );
      copy(
        path.resolve(templateFolder, 'privatize.json'),
        path.resolve(currentFolder, 'privatize.json')
      );
      copy(
        path.resolve(templateFolder, 'tailwind.config.ts'),
        path.resolve(currentFolder, 'tailwind.config.ts')
      );
      copy(
        path.resolve(templateFolder, 'wrangler.toml'),
        path.resolve(currentFolder, 'wrangler.toml')
      );
      copy(
        path.resolve(templateFolder, 'app/root.tsx'),
        path.resolve(currentFolder, 'app/root.tsx')
      );
      copy(
        path.resolve(templateFolder, 'app/tailwind.css'),
        path.resolve(currentFolder, 'app/tailwind.css')
      );
      copy(
        path.resolve(templateFolder, 'app/common'),
        path.resolve(currentFolder, 'app/common')
      );
      copy(
        path.resolve(templateFolder, 'app/components'),
        path.resolve(currentFolder, 'app/components')
      );
      copy(
        path.resolve(templateFolder, 'app/config'),
        path.resolve(currentFolder, 'app/config')
      );
      copy(
        path.resolve(templateFolder, 'app/routes'),
        path.resolve(currentFolder, 'app/routes')
      );
      copy(
        path.resolve(templateFolder, 'public/assets'),
        path.resolve(currentFolder, 'public/assets')
      );
      copy(
        path.resolve(templateFolder, 'utils'),
        path.resolve(currentFolder, 'utils')
      );
      rm(path.resolve(currentFolder, 'load-context.ts'));
      rm(path.resolve(currentFolder, 'public/logo-dark.png'));
      rm(path.resolve(currentFolder, 'public/logo-light.png'));

      // .eslintrc.cjs
      inlineEdit(
        './.eslintrc.cjs',
        [
          /(plugins\:.*?@typescript-eslint.*?)(\])/gim,
          /(parser\:.*?@typescript-eslint\/parser.*?,)/gim,
        ],
        [
          "$1, 'simple-import-sort'$2",
          `$1
      rules: {
        'simple-import-sort/exports': 'warn',
        'simple-import-sort/imports': [
          'warn',
          { groups: [ ['^react', '^@?\\\\w'], ['^(@remix-run)(/.*|$)'], ['^(@env)(/.*|$)'], ['^\\\\.\\\\./?'], ['^\\\\./?'], ["\\\\.?(css)$"], ], },
        ],
      },`,
        ]
      );

      // package.json scripts
      inlineEdit(
        './package.json',
        [
          /(wrangler.*? types)/i,
          /(eslint)[ ]*?(--ignore-path)/i,
          /(^.*?start[^:]*:)/gim,
          /(\")([\r\n].*?)(\},[\s\S]*?"dependencies":)/gim,
        ],
        [
          `$1 --experimental-include-runtime='./app/@types/cloudflare.d.ts'`,
          `$1 --fix $2`,
          '    "fix": "prettier --write --ignore-path .gitignore --cache --cache-location ./node_modules/.cache/prettier .",\n$1',
          '$1,$2  "drizzle:generate": "drizzle-kit generate",\n    "drizzle:up": "drizzle-kit up",\n    "drizzle:check": "drizzle-kit check",\n    "drizzle:drop": "drizzle-kit drop",\n    "d1:migrate:list": "wrangler d1 migrations list local-d1-dev --local",\n    "d1:migrate:apply": "wrangler d1 migrations apply local-d1-dev --local",\n    "preview": "npm run build && wrangler pages dev",\n    "tunnel": "cloudflared tunnel --url http://localhost:8788",\n    "preinstall": "privatize"\n  $3',
        ]
      );
      // postcss.config.js
      inlineEdit(
        './postcss.config.js',
        /(autoprefixer)/gim,
        "'postcss-nested': {},\n    $1"
      );
      // tsconfig.json
      inlineEdit(
        './tsconfig.json',
        /(\"vite\/client\")/i,
        `$1,"./app/@types/cloudflare.d.ts"`
      );
      // vite.config.ts
      inlineEdit(
        './vite.config.ts',
        [
          /(\}\)\;)/gim,
          /(import[ ]*?tsconfigPaths)/i,
          /(remixCloudflareDevProxy\(\))/i,
          /(tsconfigPaths\(\))/i,
          /(future\:)\s\{(.|\n)*?\}/m,
        ],
        [
          "  server: {\n    headers: { 'Cache-Control': 'public, max-age=0' },\n    host: true,\n    strictPort: true,\n    port: 8788,\n    watch: { usePolling: true },\n  },\n$1",
          "import svgx from '@svgx/vite-plugin-react';\n// import { remixDevTools } from 'remix-development-tools';\nimport { envOnlyMacros } from 'vite-env-only';\nimport { nestedRoutes } from './utils/nested-routes';\n$1",
          'svgx(),\n    // remixDevTools(),\n    $1',
          'envOnlyMacros(),\n    $1',
          'routes: nestedRoutes(__dirname),\n    $1 {\n        v3_fetcherPersist: true,\n        v3_relativeSplatPath: true,\n        v3_throwAbortReason: true,\n        v3_singleFetch: true,\n        v3_lazyRouteDiscovery: true,\n        unstable_optimizeDeps: true,\n      }',
        ]
      );
    }

    if (cmdAndOptions.run && cmdAndOptions.install) {
      await execute`npm run typegen`;
      await execute`npm run fix`;
      // await execute`npm run lint`;
    }
  });

program.parse();
