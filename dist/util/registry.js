'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Registry = void 0;
const transform_1 = require("./transform");
const func_1 = require("./func");
class Registry {
    constructor(data, noRef = true) {
        this.cached = {};
        this.parse(data, noRef);
    }
    static create(data, noRef = true) {
        return new Registry(data, noRef);
    }
    merge(data, noRef = true) {
        const obj = Registry.create(data, noRef).toObject();
        const deepMerge = (path, value) => {
            if (value !== null && (typeof value === 'object' || Array.isArray(value))) {
                if (Array.isArray(value)) {
                    for (let i = 0, n = value.length; i < n; i++) {
                        deepMerge(`${path}.${i}`, value[i]);
                    }
                }
                else {
                    for (const p in value) {
                        deepMerge(`${path}.${p}`, value[p]);
                    }
                }
            }
            else {
                this.set(path, value);
            }
        };
        for (const path in obj) {
            deepMerge(path, obj[path]);
        }
        return this;
    }
    parse(data, noRef = true) {
        if (data === undefined) {
            data = {};
        }
        else if (typeof data === 'string' && data[0] === '{') {
            try {
                data = JSON.parse(data);
            }
            catch { }
        }
        else if (typeof data === 'object' && data !== null && noRef) {
            data = (0, func_1.clone)(data);
        }
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid registry data, the data must be an Object<key, value> or a JSON string or an ARRAY');
        }
        this.data = data || {};
        return this;
    }
    isPathNum(path) {
        return /^\d+$/.test(path);
    }
    get(path, defaultValue, filter) {
        if (this.cached[path] === undefined) {
            if (path.indexOf('.') === -1) {
                this.cached[path] = this.data[path];
            }
            else {
                this.cached[path] = this.data;
                for (let key of path.split('.')) {
                    if (this.cached[path] === undefined) {
                        break;
                    }
                    this.cached[path] = this.cached[path][key];
                }
            }
        }
        if (this.cached[path] === undefined) {
            return defaultValue;
        }
        return (filter ? transform_1.Transform.clean(this.cached[path], filter) : this.cached[path]);
    }
    set(path, value) {
        for (const key in this.cached) {
            if (key.endsWith(path)) {
                delete this.cached[key];
            }
        }
        if (path.indexOf('.') === -1) {
            if (value === undefined) {
                if (this.isPathNum(path) && Array.isArray(this.data)) {
                    this.data.splice(Number(path), 1);
                }
                else {
                    delete this.data[path];
                }
            }
            else {
                this.data[path] = value;
            }
        }
        else {
            let data = this.data;
            const keys = path.split('.');
            const n = keys.length - 1;
            for (let i = 0; i < n; i++) {
                const key = keys[i];
                if (!data[key] || (typeof data[key] !== 'object' && !Array.isArray(data[key]))) {
                    if (value === undefined) {
                        if (this.isPathNum(key) && Array.isArray(data[key])) {
                            data.splice(Number(key), 1);
                        }
                        else {
                            delete data[key];
                        }
                        return this;
                    }
                    if (this.isPathNum(key)) {
                        data[key] = [];
                    }
                    else {
                        data[key] = {};
                    }
                }
                data = data[key];
            }
            const isArray = this.isPathNum(keys[n]);
            if (isArray && Array.isArray(data)) {
                data.splice(Number(keys[n]), 1);
            }
            else {
                delete data[keys[n]];
            }
            if (value !== undefined) {
                if (isArray && !Array.isArray(data)) {
                    data = [];
                }
                data[keys[n]] = value;
            }
        }
        return this;
    }
    has(path) {
        return this.get(path) !== undefined;
    }
    is(path, compareValue) {
        const value = this.get(path);
        if (compareValue === undefined) {
            return transform_1.Transform.toBoolean(value);
        }
        return value === compareValue;
    }
    remove(path) {
        return this.set(path, undefined);
    }
    toObject() {
        return this.data;
    }
    toString() {
        return JSON.stringify(this.data);
    }
    clone() {
        return Registry.create(this.toObject(), true);
    }
    pick(paths) {
        const registry = Registry.create();
        for (const path of Array.isArray(paths) ? paths : [paths]) {
            registry.set(path, this.get(path));
        }
        return registry;
    }
    omit(paths) {
        const registry = this.clone();
        for (const path of Array.isArray(paths) ? paths : [paths]) {
            registry.remove(path);
        }
        return registry;
    }
}
exports.Registry = Registry;
//# sourceMappingURL=registry.js.map