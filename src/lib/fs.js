import { cp, unlink, readFile, readFileSync, writeFileSync } from 'node:fs';
// import pkg from 'fs-extra';
// const { readJson, writeJson } = pkg;
import { readJson, writeJson } from 'fs-extra/esm';

import { execa } from 'execa';
import path from 'node:path';
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

export const copy = (fileName, toFolder) => {
  cp(fileName, toFolder, { force: true, recursive: true }, (err) => {
    if (err) throw err;
    console.log(`Copy ${fileName} ${toFolder}`);
  });
};

export const rm = (fileName) => {
  unlink(fileName, (err) => {
    if (err) throw err;
    console.log(`Delete ${fileName}`);
  });
};

export const inlineEdit = (fileName, search, replace) => {
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
