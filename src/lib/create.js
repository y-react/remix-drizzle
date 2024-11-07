import {
  copy,
  execsh,
  execute,
  inlineEdit,
  mergeJSON,
  path,
  readJson,
  rm,
  writeJson,
} from './fs.js';

const currentFolder = process.cwd();
const templateFolder = path.resolve(
  import.meta.dirname,
  '../../templates/create/'
);
const editsFolder = path.resolve(
  import.meta.dirname,
  '../../templates/create.edits/'
);
const projectName = path.basename(currentFolder);

export const create = {
  doCheckUpdates: async () => {
    await execute`npx --yes npm-check-updates@latest --target minor --upgrade`;
  },

  doCustomise: async () => {
    await copy(path.resolve(templateFolder), path.resolve(currentFolder));

    await rm(path.resolve(currentFolder, 'load-context.ts'));
    await rm(path.resolve(currentFolder, 'public/logo-dark.png'));
    await rm(path.resolve(currentFolder, 'public/logo-light.png'));

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
    inlineEdit(
      './postcss.config.js',
      /(autoprefixer)/gim,
      "'postcss-nested': {},\n    $1"
    );
    inlineEdit(
      './tsconfig.json',
      /(\"vite\/client\")/i,
      `$1,"./app/@types/cloudflare.d.ts"`
    );
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

  doCreate: async () => {
    await execute`npx create-remix@latest ${currentFolder} --template remix-run/remix/templates/cloudflare --overwrite --no-install --no-git-init`;
  },

  doDelete: async () => {
    Promise.all([
      execsh`rm -rf ${currentFolder}/*`,
      execsh`rm -rf ${currentFolder}/.[a-za-Z0-9]*`,
    ]);
  },

  doEditPackage: async () => {
    try {
      const packageJsonPath = path.resolve(currentFolder, 'package.json');
      const changesJsonPath = path.resolve(editsFolder, 'package-changes.json');
      const packageJson = await readJson(packageJsonPath);
      const changesJson = await readJson(changesJsonPath);

      const updatedPackageJson = mergeJSON(packageJson, changesJson);

      await writeJson(packageJsonPath, updatedPackageJson, { spaces: 2 });

      await inlineEdit(
        path.resolve(currentFolder, 'package.json'),
        /#PROJECT_NAME#/gm,
        `${projectName}`
      );

      console.log('package.json has been updated successfully!');
    } catch (error) {
      console.error('Error updating package.json:', error);
    }
  },

  doEditWrangler: async () => {
    await execute`ls -al`;
    // wrangler.toml
    await inlineEdit(
      path.resolve(currentFolder, 'wrangler.toml'),
      /#PROJECT_NAME#/gm,
      `${projectName}`
    );
  },

  /**
   *
   * @param {string} message
   * @param {string} options
   */
  doGitCommit: async (message, options) => {
    await execute`git add .`;
    if (options) await execute`git commit ${options} -m "${message}"`;
    else await execute`git commit -m "${message}"`;
  },

  /**
   *
   * @param {string} email
   * @param {string} name
   */
  doGitInit: async (email, name) => {
    await execute`git config --global init.defaultBranch main`;
    await execute`git config --global user.email "${email}"`;
    await execute`git config --global user.name "${name}"`;
    await execute`git init`;
    await execute`git branch -m main`;
    await execute`git checkout -b production`;
    await execute`git checkout -b main`;
  },

  doInstall: async () => {
    await execute`npm install -y`;
  },

  doRun: async () => {
    await execute`npm run dev:types`;
    await execute`npm run dev:pretty`;
  },

  doSortPackage: async () => {
    await execute`npx --yes sort-package-json@latest`;
  },
};
