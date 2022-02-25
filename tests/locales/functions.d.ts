/// <reference types="node" />
import fs from 'fs';
export declare function concat(...jsons: Record<string, any>[]): Record<string, any>;
export declare function filterJson(path: fs.Dirent): boolean;
/**
 * Synchronous function
 * @param paths from the current dir resolver
 * @returns string[]
 */
export declare function readJsonFileNamesSync(...paths: string[]): string[];
export declare function readJsonDirentFileNamesSync(...paths: string[]): any;
export declare function readJsonDirFileNamesSync(...paths: string[]): any;
/**
 * Asynchronous function
 * @param paths from the current dir resolver
 * @returns string[]
 */
export declare function readJsonFileNamesAsync(...paths: string[]): Promise<string[]>;
export declare function entour(json: string, _entour: string): string;
export declare function readJsonFileSync(json: string): string;
export declare function readJsonFileAsync(json: string): Promise<string>;
/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export declare function isObject(item: any): any;
/**
 * Performs a deep merge of objects and returns new object. Does not modify
 * objects (immutable) and merges arrays via concatenation.
 *
 * @param {...object} objects - Objects to merge
 * @returns {object} New object with merged key/values
 */
export declare function mergeDeep(...objects: any[]): any;
