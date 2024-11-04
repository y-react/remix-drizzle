import { copy, execute, path, rm, inlineEdit, execsh } from './fs.js';

const currentFolder = process.cwd();
const templateFolder = path.resolve(
  import.meta.dirname,
  '../../templates/create/'
);

export const create = {
  doCreate: async () => {
    await execute`npx create-remix@latest ${currentFolder} --template remix-run/remix/templates/cloudflare --overwrite --no-install --no-git-init`;
  },

  doDelete: async () => {
    Promise.all([
      await execsh`rm -rf ${currentFolder}/*`,
      await execsh`rm -rf ${currentFolder}/.[a-za-Z0-9]*`,
    ]);
  },

  doPrepare: async () => {
    await execute`npm install -y`;
  },

  doRun: async () => {
    await execute`npm run typegen`;
    await execute`npm run fix`;
  },

  doInstall: async () => {
    await execute`ncu --target minor --upgrade`;
    await execute`npm uninstall @cloudflare/workers-types`;
    await execute`npm install -y --progress=false @headlessui/react @heroicons/react @tsndr/cloudflare-worker-jwt clsx drizzle-orm framer-motion next-themes remix-auth remix-auth-totp remix-utils tiny-invariant`;
    await execute`npm install -y -D --progress=false @svgx/vite-plugin-react drizzle-kit eslint-plugin-simple-import-sort knip prettier-plugin-tailwindcss git+https://github.com/ycore/privatize remix-development-tools vite-env-only wrangler@latest`;
  },

  doCustomise: async () => {
    copy(path.resolve(templateFolder), path.resolve(currentFolder));
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

    // "scripts": {
    //   "dev": "remix vite:dev",
    //   "dev:lint": "eslint --fix --ignore-path .gitignore --cache --cache-location ./node_modules/.cache/eslint .",
    //   "dev:pretty": "prettier --write --ignore-path .gitignore --cache --cache-location ./node_modules/.cache/prettier .",
    //   "dev:knip": "knip",
    //   "dev:tsc": "tsc",
    //   "dev:types": "wrangler types --experimental-include-runtime='./app/@types/cloudflare.d.ts'",
    //   "db:check": "drizzle-kit check --config ./db/drizzle/drizzle.config.json",
    //   "db:generate": "drizzle-kit generate  --config ./db/drizzle/drizzle.config.json",
    //   "db:list": "wrangler d1 migrations list fontary_main_d1 --local",
    //   "db:apply": "wrangler d1 migrations apply fontary_main_d1 --local",
    //   "db:prev:info": "wrangler d1 info fontary_main_d1 --env preview",
    //   "db:prev:list": "wrangler d1 migrations list fontary_main_d1 --env preview --remote",
    //   "db:prev:apply": "wrangler d1 migrations apply fontary_main_d1 --env preview --remote",
    //   "db:prod:info": "wrangler d1 info fontary_main_d1 --env production",
    //   "db:prod:list": "wrangler d1 migrations list fontary_main_d1 --env production --remote",
    //   "db:prod:apply": "wrangler d1 migrations apply fontary_main_d1 --env production --remote",
    //   "preinstall": "privatize"
    // },

    // package.json scripts
    inlineEdit(
      './package.json',
      [
        /(wrangler.*? types)/i,
        /(eslint)[ ]*?(--ignore-path)/i,
        /(^.*?start[^:]*:)/gim,
        /(\")([\r\n].*?)(\},[\s\S]*?"dependencies":)/gim,
        /(\})([\r|\n]*?\})/gim,
      ],
      [
        `$1 --experimental-include-runtime='./app/@types/cloudflare.d.ts'`,
        `$1 --fix $2`,
        '    "fix": "prettier --write --ignore-path .gitignore --cache --cache-location ./node_modules/.cache/prettier .",\n$1',
        '$1,$2  "knip": "knip",\n    "db:generate": "drizzle-kit generate",\n    "db:check": "drizzle-kit check",\n    "d1:list": "wrangler d1 migrations list local-d1-dev --local",\n    "d1:apply": "wrangler d1 migrations apply local-d1-dev --local",\n    "preinstall": "privatize"\n  $3',
        '$1,\n  "overrides": {\n    "glob": "^9.0.0",\n    "rimraf": "^4.0.0"\n  }$2',
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
  },
};
