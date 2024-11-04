export function exec(...cmd: any[]): Promise<{
    stdout: any;
    stderr: any;
}>;
export function execute(...cmd: any[]): Promise<void>;
export function execsh(...cmd: any[]): Promise<void>;
export function copy(fileName: any, toFolder: any): void;
export function rm(fileName: any): void;
export function inlineEdit(fileName: any, search: any, replace: any): void;
import { execa } from 'execa';
import { readFile } from 'node:fs';
import { readFileSync } from 'node:fs';
export { execa, readFile, readFileSync };
