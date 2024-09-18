#!/usr/bin/env node

// const { createCommand } = require('commander');
// const program = createCommand();

// import { Command } from 'commander';
// const program = new Command();

import { createCommand } from 'commander';
// const fs = require('fs');
const program = createCommand();

program.name('init').version('1.0.0').description('Initilise the template');

program
  .description('Initilise the template')
  .argument('<string>', 'string to split')
  .option('--first', 'display just the first substring')
  .option('-s, --separator <char>', 'separator character', ',')
  .action((str, options) => {
    const limit = options.first ? 1 : undefined;
    console.log(str.split(options.separator, limit));
  });

program.parse();
