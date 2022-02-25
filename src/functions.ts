import type { File } from './types';

export function byString(o: any, s: string): any {
  s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
  s = s.replace(/^\./, ''); // strip a leading dot
  const a = s.split('.');
  for (let i = 0, n = a.length; i < n; ++i) {
    const k = a[i];
    if (k in o) {
      o = o[k];
    } else {
      return;
    }
  }
  return o;
}

/**
 * Performs a deep merge of objects and returns new object. Does not modify
 * objects (immutable) and merges arrays via concatenation.
 *
 * @param {...any} objects - Objects to merge
 * @returns {any} New object with merged key/values
 */
export function mergeDeep(...objects: any[]): any {
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

export function isFile(value: any): value is File {
  return (
    !!value.absolute &&
    typeof value.absolute === 'string' &&
    !!value.direct &&
    typeof value.direct === 'string'
  );
}

export function concat(...jsons: Record<string, any>[]) {
  return jsons.reduce((prev, next) => {
    prev = { ...prev, ...next };
    return prev;
  });
}
