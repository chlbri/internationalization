import fs from 'fs';
import p from 'path';
import { cwd } from 'process';
import { promisify } from 'util';
import { isFile, mergeDeep, byString } from './functions';
import type { File } from './types';

export { File, isFile };

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

  /**
   * The method to return the desired element
   * @param key The key of the string
   * @returns array, object, string, number, boolean
   */
  getByKey(key: string): any {
    return byString(this.jsons, key);
  }

  private static entour(json: string, _entour: string) {
    const fileName = json.split('locales/')[1];
    const _entours = [...fileName.split('/'), _entour];
    const len = _entours.length - 1;
    let out = '{';
    out += _entours
      .map(ent => {
        return ent.replace('.json', '');
      })
      .reduce((prev, next, i) => {
        prev = `${prev.includes('"') ? prev : `"${prev}"`}${
          i === len ? ':' : ':{'
        }${next.includes('{') ? next : `"${next}"`}`;

        return prev;
      });

    //Ajouter un nombre correspondant d'accolades fermantes
    Array.from({ length: len }).forEach(() => {
      out += '}';
    });
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
