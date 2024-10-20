import { cp, unlink, readFileSync, writeFileSync } from 'node:fs';
import { execa } from 'execa';
import path from 'node:path';
export { default as path } from 'node:path';

export const execute = async (...cmd) => {
  await execa({ stdout: process.stdout, stderr: process.stdout })(...cmd);
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
