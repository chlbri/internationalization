import p from 'path';
import { cwd } from 'process';
import { byString, isFile, mergeDeep } from './functions';
import readDir from './read';
import type { File } from './types';

export { File, isFile, mergeDeep, byString };

export default class Internationalization {
  private paths: string[];
  constructor(...paths: string[]) {
    this.paths = paths.length === 0 ? ['src', 'locales'] : paths;
  }

  private _files: string[] = [];

  private initFiles = async (..._jsons: string[]) => {
    await Internationalization.readJsonDirFileNamesAsync(..._jsons).then(
      values => this._files.push(...values),
    );
  };

  get files() {
    return this._files;
  }

  private _locale = Internationalization.defaultLocale;

  changeLocale(locale: string) {
    this._locale = locale;
  }

  _jsons: any = {};

  get jsons() {
    return this._jsons;
  }

  init = async () => {
    await this.initFiles(...this.paths);
    const promises = this.files.map(file => {
      return () =>
        Internationalization.readJsonFileAsync(file).then(value => {
          return Internationalization.entour(file, value);
        });
    });
    this._jsons = await Promise.all(promises.map(prom => prom())).then(
      values => {
        return mergeDeep(...values);
      },
    );
  };

  /**
   * The method to return the desired element
   * @param key The key of the string
   * @returns array, object, string, number, boolean
   */
  getByKey = (key: string) => {
    return byString(this.jsons, `${this._locale}.${key}`);
  };

  // #region Static

  private static readJsonDirFileNamesAsync(...paths: string[]) {
    const dir = p.resolve(cwd(), ...paths);

    return readDir({ dir, extension: 'json' });
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

  static async readJsonFileAsync(json: string) {
    const value = await require(json);

    return JSON.stringify(value);
  }

  static defaultLocale = 'en';
  // #endregion
}
