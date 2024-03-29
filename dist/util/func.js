'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.diff = exports.sort = exports.resetObject = exports.repeat = exports.chunk = exports.last = exports.first = exports.union = exports.truncate = exports.sum = exports.uuid = exports.hash = exports.debug = exports.toCamelCase = exports.toCapitalize = exports.lFirst = exports.uFirst = exports.snackToCamelCase = exports.camelToSnackCase = exports.callback = exports.excludeProps = exports.extendsObject = exports.clone = void 0;
const config_1 = require("../config");
const registry_1 = require("./registry");
const datetime_1 = require("./datetime");
const is_1 = require("./is");
const crypto = require("crypto");
function clone(src) {
    if (is_1.Is.flatValue(src)) {
        return src;
    }
    let newInst;
    if (src instanceof datetime_1.DateTime || src instanceof registry_1.Registry) {
        newInst = src.clone();
    }
    else if (src instanceof Date) {
        newInst = new Date(src);
    }
    else if (src instanceof RegExp) {
        newInst = new RegExp(src.source, src.flags);
    }
    else if (src instanceof Set) {
        newInst = new Set();
        src.forEach((val) => newInst.add(clone(val)));
    }
    else if (src instanceof Map) {
        newInst = new Map();
        src.forEach((val) => newInst.set(clone(val)));
    }
    else if (Array.isArray(src)) {
        newInst = [];
        src.forEach((val) => newInst.push(clone(val)));
    }
    else if (is_1.Is.object(src)) {
        newInst = {};
        Object.assign(newInst, ...Object.keys(src).map((key) => ({ [key]: clone(src[key]) })));
    }
    else if (typeof src?.constructor === 'function') {
        const val = typeof src.valueOf === 'function' ? src.valueOf() : undefined;
        if (val && Object(val) !== val) {
            newInst = new src.constructor(val);
        }
    }
    return newInst;
}
exports.clone = clone;
function extendsObject(target, ...sources) {
    for (const source of sources) {
        for (const key in source) {
            const data = source[key];
            if (is_1.Is.object(target[key]) && is_1.Is.object(data)) {
                extendsObject(target[key], data);
            }
            else {
                Object.assign(target, { [key]: is_1.Is.flatValue(data) ? data : clone(data) });
            }
        }
    }
    return target;
}
exports.extendsObject = extendsObject;
function excludeProps(obj, props) {
    for (const prop of Array.isArray(props) ? props : [props]) {
        delete obj[prop];
    }
    return obj;
}
exports.excludeProps = excludeProps;
async function callback(fn, params = [], inst) {
    if (fn instanceof Promise) {
        return await fn;
    }
    if (typeof fn === 'function') {
        return is_1.Is.asyncFunc(fn) ? await fn.apply(inst, params) : fn.apply(inst, params);
    }
    return fn;
}
exports.callback = callback;
function camelToSnackCase(str) {
    const output = [];
    for (let i = 0, n = str.length; i < n; i++) {
        const char = str[i];
        output.push(char === char.toUpperCase() ? `_${char}` : char);
    }
    return output.join('');
}
exports.camelToSnackCase = camelToSnackCase;
function snackToCamelCase(str) {
    const output = [];
    let upperNext = false;
    for (let i = 0, n = str.length; i < n; i++) {
        const char = str[i];
        if (char === '_') {
            upperNext = true;
            continue;
        }
        if (upperNext) {
            upperNext = false;
            output.push(char.toUpperCase());
        }
        else {
            output.push(char.toLowerCase());
        }
    }
    if (output[0]) {
        output[0] = output[0].toLowerCase();
    }
    return output.join('');
}
exports.snackToCamelCase = snackToCamelCase;
function uFirst(str) {
    return str.length > 1 ? `${str[0].toUpperCase()}${str.substring(1)}` : str;
}
exports.uFirst = uFirst;
function lFirst(str) {
    return str.length > 1 ? `${str[0].toLowerCase()}${str.substring(1)}` : str;
}
exports.lFirst = lFirst;
function toCapitalize(str) {
    return str
        .split(/[^a-z0-9]/i)
        .map((word) => uFirst(word))
        .filter((word) => !!word.trim())
        .join('');
}
exports.toCapitalize = toCapitalize;
function toCamelCase(str) {
    return lFirst(toCapitalize(str));
}
exports.toCamelCase = toCamelCase;
function debug(...args) {
    if (config_1.configDefault.mode === 'development') {
        console.debug(...args);
    }
}
exports.debug = debug;
function hash(str, type = 'sha256') {
    return crypto.createHash(type).update(str).digest('hex');
}
exports.hash = hash;
function uuid() {
    let buf, bufIdx = 0;
    const hexBytes = new Array(256);
    for (let i = 0; i < 256; i++) {
        hexBytes[i] = (i + 0x100).toString(16).substring(1);
    }
    const BUFFER_SIZE = 4096;
    if (buf === void 0 || bufIdx + 16 > BUFFER_SIZE) {
        bufIdx = 0;
        buf = crypto.randomBytes(BUFFER_SIZE);
    }
    const b = Array.prototype.slice.call(buf, bufIdx, (bufIdx += 16));
    b[6] = (b[6] & 0x0f) | 0x40;
    b[8] = (b[8] & 0x3f) | 0x80;
    return (hexBytes[b[0]] +
        hexBytes[b[1]] +
        hexBytes[b[2]] +
        hexBytes[b[3]] +
        '-' +
        hexBytes[b[4]] +
        hexBytes[b[5]] +
        '-' +
        hexBytes[b[6]] +
        hexBytes[b[7]] +
        '-' +
        hexBytes[b[8]] +
        hexBytes[b[9]] +
        '-' +
        hexBytes[b[10]] +
        hexBytes[b[11]] +
        hexBytes[b[12]] +
        hexBytes[b[13]] +
        hexBytes[b[14]] +
        hexBytes[b[15]]);
}
exports.uuid = uuid;
function sum(source, options) {
    const key = options?.key ?? '';
    let sum = 0;
    for (const rec of source) {
        if (typeof rec === 'number') {
            sum += rec;
        }
        else if (typeof rec === 'object' && typeof rec[key] === 'number') {
            sum += Number(rec[key]) || 0;
        }
    }
    return sum;
}
exports.sum = sum;
function truncate(str, maxLength = 50, pad = '...') {
    str = str.trim();
    const len = str.length;
    str = str.substring(0, maxLength);
    if (len > str.length) {
        str += pad;
    }
    return str;
}
exports.truncate = truncate;
function union(...elements) {
    const uniqueArray = [];
    const push = (array) => {
        for (const element of array) {
            if (Array.isArray(element)) {
                push(element);
            }
            else if (!uniqueArray.find((arr) => is_1.Is.equals(arr, element))) {
                uniqueArray.push(element);
            }
        }
    };
    push(elements);
    return uniqueArray;
}
exports.union = union;
function first(array) {
    return array.length ? array[0] : undefined;
}
exports.first = first;
function last(array) {
    return array.length ? array[array.length - 1] : undefined;
}
exports.last = last;
function chunk(array, size = 1) {
    const output = [];
    let index = 0;
    for (let i = 0, n = array.length; i < n; i++) {
        let chunk = output[index];
        if (chunk && chunk.length >= size) {
            chunk = output[++index];
        }
        if (!chunk) {
            output.push((chunk = []));
        }
        chunk.push(array[i]);
    }
    return output;
}
exports.chunk = chunk;
function repeat(char, level = 0) {
    level = parseInt(level.toString());
    if (level <= 0) {
        return '';
    }
    while (--level > 0) {
        char += `${char}`;
    }
    return char;
}
exports.repeat = repeat;
function resetObject(obj, newData) {
    for (const k in obj) {
        delete obj[k];
    }
    if (newData) {
        Object.assign(obj, newData);
    }
    return obj;
}
exports.resetObject = resetObject;
function sort(data, options) {
    const k = options?.key;
    const compare = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
    if (Array.isArray(data)) {
        if (k) {
            data.sort((a, b) => {
                if (is_1.Is.object(a) && is_1.Is.object(b)) {
                    return compare(a[k], b[k]);
                }
                return compare(a, b);
            });
        }
        else {
            data.sort(compare);
        }
    }
    else if (is_1.Is.object(data)) {
        const keys = Object.keys(data);
        const obj = {};
        keys.sort();
        for (const key of keys) {
            obj[key] = clone(data[key]);
        }
        resetObject(data, obj);
    }
    return data;
}
exports.sort = sort;
function diff(a, b) {
    if (Array.isArray(a) && Array.isArray(b)) {
        const output = [];
        for (const v of a) {
            if (!b.find((val) => is_1.Is.equals(val, v))) {
                output.push(v);
            }
        }
        for (const v of b) {
            if (!a.find((val) => is_1.Is.equals(val, v))) {
                output.push(v);
            }
        }
        return output;
    }
    return is_1.Is.equals(a, b) ? [] : [a, b];
}
exports.diff = diff;
//# sourceMappingURL=func.js.map