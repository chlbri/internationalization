import { isAbsolutePath } from './helpers';
import type { Args } from './types';
export default function makeCommandForUnix(argv: Args) {
  let command = 'find ';

  if (isAbsolutePath(argv.dir) !== true) {
    command += '.';
  }
  if (typeof argv.dir === 'string') {
    command += '/' + argv.dir.replace(/ /g, '\\ ');
  }
  if (typeof argv.extension === 'string') {
    command += ' -name "*.' + argv.extension + '"';
  }
  if (typeof argv.exclude === 'string') {
    command += ' -not -path "./' + argv.exclude + '/*"';
  }
  return command;
}
