import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { confirm } from '@inquirer/prompts';

/* ***
npx create-remix@latest ./ --yes --no-git-init --install --init-script --overwrite --template ../remix-drizzle
npx remix init
*** */

export default async function main({ rootDirectory }) {
  const currentFolder = path.resolve(rootDirectory);
  const templateFolder = path.resolve(import.meta.dirname, 'templates');
  const appName = path
    .basename(rootDirectory)
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .toLowerCase();

  const allowProceed = await confirm({ message: `Folder ${currentFolder} contents will be overwritten. Proceed?` });
  if (!allowProceed) return;

  // clear
  perform.clearFolder(rootDirectory);

  // install remix cloudflare template
  console.info('[✓] REMIX CLOUDFLARE INSTALL START');
  create.remoteTemplate(rootDirectory);
  perform.gitInit('y-core@outlook.com', 'Johan Meyer');
  perform.gitCommit('Install remote template', '--quiet');
  console.info('[✓] REMIX CLOUDFLARE INSTALL COMPLETE');

  // install template overwrites
  perform.remove(rootDirectory, [('load-context.ts', 'public/logo-dark.png', 'public/logo-light.png')]);
  create.localTemplate(path.join(templateFolder, 'create.overwrites'), rootDirectory);
  perform.gitCommit('Update local template', '--quiet');
  console.info('[✓] TEMPLATE OVERWRITE COMPLETE');

  // customise edits
  edit.inline(path.resolve(rootDirectory, 'postcss.config.js'), /(autoprefixer)/gim, "'postcss-nested': {},\n    $1");
  edit.inline(path.resolve(rootDirectory, 'tsconfig.json'), /(\"vite\/client\")/i, `$1,"./app/@types/cloudflare.d.ts"`);
  edit.inline(
    path.resolve(rootDirectory, '.eslintrc.cjs'),
    [/(plugins\:.*?@typescript-eslint.*?)(\])/gim, /(parser\:.*?@typescript-eslint\/parser.*?,)/gim],
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
  edit.inline(
    path.resolve(rootDirectory, './vite.config.ts'),
    [/(\}\)\;)/gim, /(import[ ]*?tsconfigPaths)/i, /(remixCloudflareDevProxy\(\))/i, /(tsconfigPaths\(\))/i, /(future\:)\s\{(.|\n)*?\}/m],
    [
      "  server: {\n    headers: { 'Cache-Control': 'public, max-age=0' },\n    watch: { usePolling: true },\n  },\n$1",
      "import svgx from '@svgx/vite-plugin-react';\n// import { remixDevTools } from 'remix-development-tools';\nimport { envOnlyMacros } from 'vite-env-only';\nimport { nestedRoutes } from './utils/nested-routes';\n$1",
      'svgx(),\n    // remixDevTools(),\n    $1',
      'envOnlyMacros(),\n    $1',
      'routes: nestedRoutes(__dirname),\n    $1 {\n        v3_fetcherPersist: true,\n        v3_relativeSplatPath: true,\n        v3_throwAbortReason: true,\n        v3_singleFetch: true,\n        v3_lazyRouteDiscovery: true,\n        unstable_optimizeDeps: true,\n      }',
    ]
  );
  edit.inline(path.resolve(rootDirectory, 'wrangler.toml'), /#PROJECT_NAME#/g, appName);

  perform.gitCommit('Customise app', '--quiet');
  console.info('[✓] TEMPLATE CUSTOMISATION COMPLETE');

  // customise package.json
  edit.packageJson(appName, path.join(rootDirectory, 'package.json'), path.join(templateFolder, 'create.edits', 'package-changes.json'));
  perform.sortPackage();
  perform.checkUpdates();
  perform.gitCommit('Update packages', '--quiet');
  console.info('[✓] UPDATE package.json COMPLETE');

  // npm install
  perform.install();
  perform.rundev();
  perform.gitCommit('Installation ready', '--quiet');

  console.log(
    `
Setup is complete.

  - Start development with \`npm run dev\`; run tests with \`npm run test\`
		`.trim()
  );
}

const perform = {
  clearFolder: (directory) => {
    execSync(`find . -maxdepth 1 -not -name '.' -not -name '..' -not -name 'remix.init' -exec rm -rf {} +`, { cwd: directory, stdio: 'inherit' });
  },
  checkUpdates: () => {
    execSync(`npx --yes npm-check-updates@latest --target minor --upgrade`, { stdio: 'inherit' });
  },
  install: () => {
    execSync(`npm install -y`, { stdio: 'inherit' });
  },
  remove: (folder, files) => {
    files.map((file) => {
      fs.rmSync(path.resolve(folder, file));
    });
  },
  sortPackage: () => {
    execSync(`npx --yes sort-package-json@latest`);
  },
  gitCommit: (message, options) => {
    execSync(`git add .`);
    if (options) execSync(`git commit ${options} -m "${message}"`, { stdio: 'inherit' });
    else execSync(`git commit -m "${message}"`, { stdio: 'inherit' });
  },
  gitInit: (email, name) => {
    [
      `git config --global init.defaultBranch main`,
      `git config --global user.email "${email}"`,
      `git config --global user.name "${name}"`,
      `git init`,
      `git branch -m main`,
      `git checkout -b production`,
      `git checkout -b main`,
    ].map((command) => {
      execSync(command, { stdio: 'inherit' });
    });
  },
  rundev: () => {
    [`npm run dev:types`, `npm run dev:pretty`].map((command) => {
      execSync(command, { stdio: 'inherit' });
    });
  },
};

const edit = {
  inline: async (fileName, search, replace) => {
    if (!Array.isArray(search)) search = [search];
    if (!Array.isArray(replace)) replace = [replace];

    let fileContents = fs.readFileSync(fileName, 'utf-8');

    for (let i = 0; i < search.length; i++) {
      const searchPattern = search[i];
      const replaceValue = replace[i] || '';
      fileContents = fileContents.replace(searchPattern, replaceValue);
    }

    fs.writeFileSync(fileName, fileContents, 'utf-8');
  },
  packageJson: (appName, packageName, changesName) => {
    const packageJson = JSON.parse(fs.readFileSync(packageName, 'utf-8'));
    const changesJson = JSON.parse(fs.readFileSync(changesName, 'utf-8'));

    packageJson.name = appName;
    const mergedPackageJson = mergeJSON(packageJson, changesJson);
    const updatedPackageJson = JSON.stringify(mergedPackageJson, null, 2).replace(/#PROJECT_NAME#/g, appName);

    fs.writeFileSync(packageName, updatedPackageJson);
  },
};

const create = {
  remoteTemplate: (directory) => {
    execSync('npx create-remix@latest ./ --yes --no-git-init --no-install --no-init-script --overwrite --template remix-run/remix/templates/cloudflare', { cwd: directory });
  },
  localTemplate: (fileName, toFolder) => {
    fs.cpSync(fileName, toFolder, { force: true, recursive: true });
  },
};

const mergeJSON = (packageJson, changesJson) => {
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
        if (typeof changeValue === 'object' && !Array.isArray(changeValue) && changeValue !== null) {
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
};
