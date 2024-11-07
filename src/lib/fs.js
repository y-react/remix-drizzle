import { cp, unlink, readFile, readFileSync, writeFileSync } from 'node:fs';
// import pkg from 'fs-extra';
// const { readJson, writeJson } = pkg;
import { readJson, writeJson } from 'fs-extra/esm';

import { execa } from 'execa';
export { default as path } from 'node:path';

export { execa, readFile, readFileSync, readJson, writeJson };

export const exec = async (...cmd) => {
  await execa({ stdout: process.stdout, stderr: process.stderr })(...cmd);
  return { stdout, stderr };
};

export const execute = async (...cmd) => {
  await execa({ stdout: process.stdout, stderr: process.stderr })(...cmd);
};

export const execsh = async (...cmd) => {
  await execa({ shell: true })(...cmd);
};

/**
 *
 * @param {string} fileName
 * @param {string} toFolder
 */
export const copy = async (fileName, toFolder) => {
  await cp(fileName, toFolder, { force: true, recursive: true }, (err) => {
    if (err) throw err;
    console.log(`Copy ${fileName} ${toFolder}`);
  });
};

/**
 *
 * @param {string} fileName
 */
export const rm = async (fileName) => {
  await unlink(fileName, (err) => {
    if (err) throw err;
    console.log(`Delete ${fileName}`);
  });
};

/**
 *
 * @param {string} fileName
 * @param {RegExp | RegExp[]} search
 * @param {string | string[]} replace
 */
export const inlineEdit = async (fileName, search, replace) => {
  if (!Array.isArray(search)) search = [search];
  if (!Array.isArray(replace)) replace = [replace];

  let fileContents = readFileSync(fileName, 'utf-8');

  for (let i = 0; i < search.length; i++) {
    const searchPattern = search[i];
    const replaceValue = replace[i] || '';
    fileContents = fileContents.replace(searchPattern, replaceValue);
  }

  writeFileSync(fileName, fileContents, 'utf-8');
  console.log(`Edit ${fileName}`);
};

/**
 *
 * @param {string[]} packageJson
 * @param {string[]} changesJson
 * @returns
 */
export const mergeJSON = (packageJson, changesJson) => {
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
};
