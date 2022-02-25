"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeDeep = exports.isObject = exports.readJsonFileAsync = exports.readJsonFileSync = exports.entour = exports.readJsonFileNamesAsync = exports.readJsonDirFileNamesSync = exports.readJsonDirentFileNamesSync = exports.readJsonFileNamesSync = exports.filterJson = exports.concat = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const process_1 = require("process");
const util_1 = require("util");
function concat(...jsons) {
    return jsons.reduce((prev, next) => {
        prev = { ...prev, ...next };
        return prev;
    });
}
exports.concat = concat;
function filterJson(path) {
    return path.isFile() && path_1.default.extname(path.name) === '.json';
}
exports.filterJson = filterJson;
/**
 * Synchronous function
 * @param paths from the current dir resolver
 * @returns string[]
 */
function readJsonFileNamesSync(...paths) {
    const _path = path_1.default.resolve((0, process_1.cwd)(), ...paths);
    const fileObjs = fs_1.default.readdirSync(_path, { withFileTypes: true });
    return fileObjs
        .filter(filterJson)
        .map(file => path_1.default.resolve(_path, file.name));
}
exports.readJsonFileNamesSync = readJsonFileNamesSync;
/**
 * Synchronous function
 * @param paths from the current dir resolver
 * @returns string[]
 */
const files = [];
function readJsonDirentFileNamesSync(...paths) {
    const _path = path_1.default.resolve((0, process_1.cwd)(), ...paths);
    const files = [];
    const fileObjs = fs_1.default.readdirSync(_path, { withFileTypes: true });
    fileObjs.forEach(file => {
        // console.log(readJsonDirFileNamesSync(...paths, file.name));
        files.push(...readJsonDirFileNamesSync(...paths, file.name));
    });
    return files;
}
exports.readJsonDirentFileNamesSync = readJsonDirentFileNamesSync;
function readJsonDirFileNamesSync(...paths) {
    const _path = path_1.default.resolve((0, process_1.cwd)(), ...paths);
    const fileObjs = fs_1.default.readdirSync(_path, { withFileTypes: true });
    return fileObjs
        .map(file => {
        if (file.isDirectory()) {
            return readJsonDirFileNamesSync(...paths, file.name);
        }
        if (filterJson(file))
            return path_1.default.resolve(_path.replace((0, process_1.cwd)(), ''), file.name);
    })
        .filter(file => !!file);
}
exports.readJsonDirFileNamesSync = readJsonDirFileNamesSync;
function recurseArray(args) {
    const obj = {};
    if (!Array.isArray(args)) {
        const len = Object.values(obj).length;
        const key = Math.max(len - 1, 0);
        Object.assign(obj, { [key]: args });
    }
    else {
        args.forEach((arg, i) => {
            if (Array.isArray(arg))
                recurseArray(arg);
            else
                obj[i] = arg;
        });
    }
    return obj;
}
function deepArrayToArray(arr) {
    const obj = {};
    // This does nothing useful
    //  if (arr !== []) {
    //    return obj;
    //  }{
    if (typeof arr === 'string') {
        const i = Object.keys(obj)[Object.keys(obj).length - 1];
        obj[i] = arr;
    }
    else {
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
async function readJsonFileNamesAsync(...paths) {
    const _path = path_1.default.resolve((0, process_1.cwd)(), ...paths);
    const _readdir = (0, util_1.promisify)(fs_1.default.readdir);
    const dir = await _readdir(_path, { withFileTypes: true });
    return dir.filter(filterJson).map(file => path_1.default.resolve(_path, file.name));
}
exports.readJsonFileNamesAsync = readJsonFileNamesAsync;
function entour(json, _entour) {
    const fileName = json.split('locales/')[1];
    const _entours = [...fileName.split('/'), _entour];
    const len = _entours.length - 1;
    let out = '{';
    out += _entours
        .map(ent => ent.replace(' ', '').replace('.json', ''))
        .reduce((prev, next, i) => {
        prev = `${prev.includes('"') ? prev : `"${prev}"`}${i === len ? ':' : ':{'}${next.includes('{') ? next : `"${next}"`}`;
        return prev;
    });
    for (let index = 0; index < _entours.length - 1; index++) {
        out += '}';
    }
    return out;
}
exports.entour = entour;
function readJsonFileSync(json) {
    return fs_1.default.readFileSync(json).toLocaleString();
}
exports.readJsonFileSync = readJsonFileSync;
async function readJsonFileAsync(json) {
    const _readFile = (0, util_1.promisify)(fs_1.default.readFile);
    const value = await _readFile(json);
    return value.toLocaleString();
}
exports.readJsonFileAsync = readJsonFileAsync;
/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
function isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
}
exports.isObject = isObject;
/**
 * Performs a deep merge of objects and returns new object. Does not modify
 * objects (immutable) and merges arrays via concatenation.
 *
 * @param {...object} objects - Objects to merge
 * @returns {object} New object with merged key/values
 */
function mergeDeep(...objects) {
    const isObject = (obj) => obj && typeof obj === 'object';
    return objects.reduce((prev, obj) => {
        Object.keys(obj).forEach(key => {
            const pVal = prev[key];
            const oVal = obj[key];
            if (Array.isArray(pVal) && Array.isArray(oVal)) {
                prev[key] = pVal.concat(...oVal);
            }
            else if (isObject(pVal) && isObject(oVal)) {
                prev[key] = mergeDeep(pVal, oVal);
            }
            else {
                prev[key] = oVal;
            }
        });
        return prev;
    }, {});
}
exports.mergeDeep = mergeDeep;
