import { exec } from 'child_process';
import { promisify } from 'util';
import { isAbsolutePath } from './helpers';
import { Args } from './types';
import unix from './unix';
import win from './win';
const _exec = promisify(exec);

const isWindows = process.platform === 'win32';

function fixResult(results: any[], dir: any) {
  return results.map(function (path) {
    const index = path.indexOf(dir);
    return '.\\' + path.substr(index);
  });
}

export default async function readDir({
  dir,
  extension,
  absolutify,
  exclude = './node_modules/*',
}: Args) {
  const commandMaker = isWindows ? win : unix;
  const command = commandMaker({
    dir,
    extension,
    exclude,
  });
  return await _exec(command).then(({ stdout, stderr }) => {
    let results = stdout.split('\n').filter(function (str) {
      return str !== '';
    });
    stderr && console.log(stderr);

    const isAbsolute = isAbsolutePath(dir);

    if (!isAbsolute && isWindows) {
      results = fixResult(results, dir);
    }

    return results
      .map(result => {
        return isAbsolute ? result : result.substring(4);
      })
      .map(result => {
        return absolutify ? `${process.cwd()}/${result}` : result;
      });
  });
}
