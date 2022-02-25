import fs from 'fs';
import p from 'path';
import { cwd } from 'process';
import { File } from '../tests/locales/types';
import { promisify } from 'util';
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

function isFile(value: any): value is File {
  return (
    !!value.absolute &&
    typeof value.absolute === 'string' &&
    !!value.direct &&
    typeof value.direct === 'string'
  );
}

export default class Internationalization {
  paths: string[];
  constructor(...paths: string[]) {
    this.paths = paths.length === 0 ? ['src', 'locales'] : paths;
    this.initFiles(
      Internationalization.readJsonDirFileNamesSync(...this.paths),
    );
  }
  private static filterJson(path: fs.Dirent) {
    return path.isFile() && p.extname(path.name) === '.json';
  }

  private _files: File[] = [];

  private initFiles(..._jsons: any[]): void {
    _jsons.forEach(file => {
      if (isFile(file)) {
        this._files.push(file);
      } else {
        this.initFiles(...file);
      }
    });
  }

  get files() {
    return this._files;
  }

  jsons: any[] = [];

  async init() {
    const promises = this.files.map(file => {
      return () =>
        Internationalization.readJsonFileAsync(file.absolute).then(
          value => {
            return Internationalization.entour(file.absolute, value);
          },
        );
    });
    this.jsons = await Promise.all(promises.map(prom => prom())).then(
      values => mergeDeep(...values),
    );
  }

  initSync() {
    this.jsons = mergeDeep(
      ...this.files.map(file => {
        return Internationalization.entour(
          file.absolute,
          Internationalization.readJsonFileSync(file.absolute),
        );
      }),
    );
  }

  // #region Static
  private static readJsonDirFileNamesSync(...paths: string[]): any[] {
    const _path = p.resolve(cwd(), ...paths);

    const fileObjs = fs.readdirSync(_path, { withFileTypes: true });
    return fileObjs
      .map(file => {
        if (file.isDirectory()) {
          return Internationalization.readJsonDirFileNamesSync(
            ...paths,
            file.name,
          );
        }
        if (Internationalization.filterJson(file))
          return {
            direct: p.resolve(_path.split('locales')[1], file.name),
            absolute: p.resolve(_path, file.name),
          };
      })
      .filter(file => !!file);
  }

  // private static concat(...jsons: Record<string, any>[]) {
  //   return jsons.reduce((prev, next) => {
  //     prev = { ...prev, ...next };
  //     return prev;
  //   });
  // }

  private static entour(json: string, _entour: string) {
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
    return JSON.parse(out);
  }

  static readJsonFileSync(json: string) {
    return fs.readFileSync(json).toLocaleString();
  }

  static async readJsonFileAsync(json: string) {
    const _readFile = promisify(fs.readFile);

    const value = await _readFile(json);
    return value.toLocaleString();
  }
  // #endregion
}
