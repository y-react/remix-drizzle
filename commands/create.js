#!/usr/bin/env node

// npm exec github:y-react/remix-drizzle
// npm exec ../remix-drizzle/

import { createCommand } from 'commander';
import { execa, $ } from 'execa';
import { cp, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const currentFolder = process.cwd();
const templateFolder = path.resolve(import.meta.dirname, '../templates/');

const execute = async (...cmd) => {
  await execa({ stdout: process.stdout, stderr: process.stdout })(...cmd);
};

const copy = (fileName) => {
  cp(
    path.resolve(templateFolder, `${fileName}`),
    path.resolve(currentFolder, `${fileName}`),
    { force: true },
    (err) => {
      if (err) throw err;
      console.log(`Copy ${templateFolder}/${fileName} ${currentFolder}`);
    }
  );
};

const inlineEdit = (fileName, search, replace) => {
  if (!Array.isArray(search)) search = [search];
  if (!Array.isArray(replace)) replace = [replace];

  let fileContents = readFileSync(fileName, 'utf-8');

  for (let i = 0; i < search.length; i++) {
    const searchPattern = search[i];
    const replaceValue = replace[i] || '';
    fileContents = fileContents.replace(searchPattern, replaceValue);
  }

  writeFileSync(fileName, fileContents, 'utf-8');
  console.log(`Edited ${fileName}`);
};

const program = createCommand();
program.name('create').version('1.0.0').description('Create from templates');

program
  .description('Create base remix template')
  .option('-x, --no-delete', "don't delete")
  .option('-n, --no-custom', 'no customization')
  .action(async (str, options) => {
    if (!options.noDelete) {
      await execa({ shell: true })`rm -rf ${currentFolder}/*`;
      await execa({ shell: true })`rm -rf ${currentFolder}/.[a-z0-9]*`;
    }

    await execute`npx create-remix@latest ${currentFolder} --template remix-run/remix/templates/cloudflare --overwrite --no-install --no-git-init`;

    if (!options.noCustom) {
      await execute`npm install -y drizzle-orm @nextui-org/react framer-motion tiny-invariant`;
      await execute`npm install -y -D routes-gen @routes-gen/remix`;

      // .dev.vars
      copy('.dev.vars');
      // compose.yaml
      copy('compose.yaml');
      // tailwind.config.ts
      copy('tailwind.config.ts');
      // wrangler.toml
      copy('wrangler.toml');
      // _index.tsx
      copy('_index.tsx');

      // package.json scripts
      inlineEdit(
        './package.json',
        /(\")([\r\n].*?)(\},[\s\S]*?"dependencies":)/gim,
        '$1,$2  "routes:gen": "routes-gen -d @routes-gen/remix",\n    "preview": "npm run build && wrangler pages dev"\n  $3'
      );

      // postcss.config.js
      inlineEdit(
        './postcss.config.js',
        /(autoprefixer)/gim,
        "'postcss-nested': {},\n    $1"
      );

      // vite.config.ts
      inlineEdit(
        './vite.config.ts',
        /(\}\)\;)/gim,
        "  server: {\n    headers: { 'Cache-Control': 'public, max-age=0' },\n    host: true,\n    strictPort: true,\n    port: 8788,\n    watch: { usePolling: true },\n  },\n$1"
      );

      // app/root.tsx
      inlineEdit(
        './app/root.tsx',
        [
          /ScrollRestoration/i,
          /(@remix-run\/node)/gim,
          /(^.*?tailwind\.css)/gim,
          /App().*?{[^\}]*?(})/gim,
          /(fonts.googleapis.com).*?(swap)/gim,
        ],
        [
          'ScrollRestoration, useNavigate, useHref',
          '@remix-run/cloudflare',
          'import {NextUIProvider} from "@nextui-org/react";\n\n$1',
          '$1 App() {\n const navigate = useNavigate();\n\n return (\n <NextUIProvider navigate={navigate} useHref={useHref}>\n <Outlet />\n </NextUIProvider>\n );\n$2',
          '$1/css2?family=Quicksand:wght@300..700&display=$2',
        ]
      );
    }
  });

program.parse();
