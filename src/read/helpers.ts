export const isWindows = process.platform === 'win32';

export function fixResult(results: any[], dir: any) {
  return results.map(function (path) {
    const index = path.indexOf(dir);
    return '.\\' + path.substr(index);
  });
}

export function isAbsolutePath(dir: string) {
  return dir.startsWith('/') || dir[1] === ':' || dir[2] === '/';
}
