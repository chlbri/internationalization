import fs from 'fs';
import p from 'path';
import { cwd } from 'process';
import { promisify } from 'util';

export function concat(...jsons: Record<string, any>[]) {
  return jsons.reduce((prev, next) => {
    prev = { ...prev, ...next };
    return prev;
  });
}

export function filterJson(path: fs.Dirent) {
  return path.isFile() && p.extname(path.name) === '.json';
}

/**
 * Synchronous function
 * @param paths from the current dir resolver
 * @returns string[]
 */
export function readJsonFileNamesSync(...paths: string[]) {
  const _path = p.resolve(cwd(), ...paths);

  const fileObjs = fs.readdirSync(_path, { withFileTypes: true });
  return fileObjs
    .filter(filterJson)
    .map(file => p.resolve(_path, file.name));
}
/**
 * Synchronous function
 * @param paths from the current dir resolver
 * @returns string[]
 */
const files: string[] = [];
export function readJsonDirentFileNamesSync(...paths: string[]): any {
  const _path = p.resolve(cwd(), ...paths);
  const files: string[] = [];

  const fileObjs = fs.readdirSync(_path, { withFileTypes: true });
  fileObjs.forEach(file => {
    // console.log(readJsonDirFileNamesSync(...paths, file.name));
    files.push(...readJsonDirFileNamesSync(...paths, file.name));
  });

  return files;
}

export function readJsonDirFileNamesSync(...paths: string[]): any {
  const _path = p.resolve(cwd(), ...paths);

  const fileObjs = fs.readdirSync(_path, { withFileTypes: true });
  return fileObjs
    .map(file => {
      if (file.isDirectory()) {
        return readJsonDirFileNamesSync(...paths, file.name);
      }
      if (filterJson(file))
        return p.resolve(_path.replace(cwd(), ''), file.name);
    })
    .filter(file => !!file);
}

function recurseArray(args: any): any {
  const obj: any = {};
  if (!Array.isArray(args)) {
    const len = Object.values(obj).length;
    const key = Math.max(len - 1, 0);
    Object.assign(obj, { [key]: args });
  } else {
    args.forEach((arg, i) => {
      if (Array.isArray(arg)) recurseArray(arg);
      else obj[i] = arg;
    });
  }
  return obj;
}

function deepArrayToArray(arr: any[]): any {
  const obj: any = {};

  // This does nothing useful
  //  if (arr !== []) {
  //    return obj;
  //  }{
  if (typeof arr === 'string') {
    const i = Object.keys(obj)[Object.keys(obj).length - 1];
    obj[i] = arr;
  } else {
    for (let i = 0; i < arr.length; i++) {
      const value = arr[i];

      if (Array.isArray(value)) {
        deepArrayToArray(value);
      }
    }
  }
  return obj;
}

// JSON.stringify(readJsonDirentFileNamesSync('src'), null, 2); //?

/**
 * Asynchronous function
 * @param paths from the current dir resolver
 * @returns string[]
 */
export async function readJsonFileNamesAsync(...paths: string[]) {
  const _path = p.resolve(cwd(), ...paths);
  const _readdir = promisify(fs.readdir);

  const dir = await _readdir(_path, { withFileTypes: true });
  return dir.filter(filterJson).map(file => p.resolve(_path, file.name));
}

export function entour(json: string, _entour: string) {
  const fileName = json.split('locales/')[1];
  const _entours = [...fileName.split('/'), _entour];
  const len = _entours.length - 1;
  let out = '{';
  out += _entours
    .map(ent => ent.replace(' ', '').replace('.json', ''))
    .reduce((prev, next, i) => {
      prev = `${prev.includes('"') ? prev : `"${prev}"`}${
        i === len ? ':' : ':{'
      }${next.includes('{') ? next : `"${next}"`}`;

      return prev;
    });
  for (let index = 0; index < _entours.length - 1; index++) {
    out += '}';
  }
  return out;
}

export function readJsonFileSync(json: string) {
  return fs.readFileSync(json).toLocaleString();
}

export async function readJsonFileAsync(json: string) {
  const _readFile = promisify(fs.readFile);

  const value = await _readFile(json);
  return value.toLocaleString();
}

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item: any) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Performs a deep merge of objects and returns new object. Does not modify
 * objects (immutable) and merges arrays via concatenation.
 *
 * @param {...object} objects - Objects to merge
 * @returns {object} New object with merged key/values
 */
export function mergeDeep(...objects: any[]) {
  const isObject = (obj: any) => obj && typeof obj === 'object';

  return objects.reduce((prev, obj) => {
    Object.keys(obj).forEach(key => {
      const pVal = prev[key];
      const oVal = obj[key];

      if (Array.isArray(pVal) && Array.isArray(oVal)) {
        prev[key] = pVal.concat(...oVal);
      } else if (isObject(pVal) && isObject(oVal)) {
        prev[key] = mergeDeep(pVal, oVal);
      } else {
        prev[key] = oVal;
      }
    });

    return prev;
  }, {});
}
