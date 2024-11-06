import {
  copy,
  execute,
  path,
  rm,
  inlineEdit,
  execsh,
  readJson,
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

  doInstall: async () => {
    await execute`npm install -y`;
  },

  doRun: async () => {
    await execute`npm run dev:types`;
    await execute`npm run dev:pretty`;
  },

  doCheckUpdates: async () => {
    await execute`npx --yes npm-check-updates@latest --target minor --upgrade`;
  },

  doEditPackage: async () => {
    try {
      const packageJsonPath = path.resolve(currentFolder, 'package.json');
      const changesJsonPath = path.resolve(editsFolder, 'package-changes.json');
      const packageJson = await readJson(packageJsonPath);
      const changesJson = await readJson(changesJsonPath);

      const updatedPackageJson = mergeJSON(packageJson, changesJson);

      await writeJson(packageJsonPath, updatedPackageJson, { spaces: 2 });

      console.log('package.json has been updated successfully!');
    } catch (error) {
      console.error('Error updating package.json:', error);
    }
  },

  doSortPackage: async () => {
    await execute`npx --yes sort-package-json@latest`;
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

/**
 *
 * @param {string[]} packageJson
 * @param {string[]} changesJson
 * @returns
 */
function mergeJSON(packageJson, changesJson) {
  // Iterate through each key in changesJson
  for (const key in changesJson) {
    if (changesJson.hasOwnProperty(key)) {
      const changeValue = changesJson[key];

      // Handle deletion: If the key starts with "-", remove it from packageJson
      if (key.startsWith('-')) {
        const keyToRemove = key.slice(1); // Remove the "-" from the key
        delete packageJson[keyToRemove];
      } else {
        // Otherwise, just update or add the key
        if (
          typeof changeValue === 'object' &&
          !Array.isArray(changeValue) &&
          changeValue !== null
        ) {
          // If the value is an object, recursively merge
          if (!packageJson[key]) {
            packageJson[key] = {};
          }
          mergeJSON(packageJson[key], changeValue);
        } else {
          // Otherwise, just overwrite or add the key directly
          packageJson[key] = changeValue;
        }
      }
    }
  }

  return packageJson;
}
