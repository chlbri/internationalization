import { isAbsolutePath } from './helpers';
import type { Args } from './types';

export default function makeCommandForWindows(argv: Args) {
  let command = 'find ';
  if (isAbsolutePath(argv.dir) !== true) {
    command += '.';
  }
  if (typeof argv.dir === 'string') {
    command += '/' + argv.dir;
  }
  if (typeof argv.extension === 'string') {
    command += '/*.' + argv.extension;
  }
  if (typeof argv.exclude === 'string') {
    console.log('exclude is not yet supported for windows');
  }
  command = command.replace(/\//g, '\\');
  command += ' /b/s';
  if (command.substring(0, 5) === 'dir \\') {
    //fix for C:\... cases
    command = command.substring(0, 4) + command.substring(5);
  }
  return command;
}
