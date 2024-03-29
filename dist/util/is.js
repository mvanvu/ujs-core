'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Is = void 0;
const datetime_1 = require("./datetime");
class Is {
    static emptyObject(obj) {
        return Is.object(obj) && !Object.keys(obj).length;
    }
    static date(d) {
        const date = datetime_1.DateTime.create(d);
        return date.valid ? date : false;
    }
    static asyncFunc(fn) {
        return fn instanceof (async () => { }).constructor;
    }
    static typeOf(value, type, each = false) {
        value = each ? (Array.isArray(value) ? value : [value]) : value;
        for (const val of each ? value : [value]) {
            const typeValue = typeof val;
            switch (type) {
                case 'string':
                case 'undefined':
                case 'boolean':
                case 'function':
                case 'symbol':
                    if (typeValue !== type) {
                        return false;
                    }
                    break;
                case 'int':
                case 'sint':
                case 'uint':
                    if (!Number.isInteger(val) || (type === 'sint' && val < 0) || (type === 'uint' && val >= 0)) {
                        return false;
                    }
                    break;
                case 'number':
                case 'snumber':
                case 'unumber':
                    if (!Number(val) || (type === 'snumber' && val < 0) || (type === 'unumber' && val >= 0)) {
                        return false;
                    }
                    break;
                case 'bigint':
                case 'sbigint':
                case 'ubigint':
                    if (typeValue !== 'bigint' || (type === 'sbigint' && val < 0) || (type === 'ubigint' && val >= 0)) {
                        return false;
                    }
                    break;
                case 'object':
                    if (!val || Array.isArray(val) || typeValue !== 'object') {
                        return false;
                    }
                    break;
                case 'array':
                    if (!Array.isArray(val)) {
                        return false;
                    }
                    break;
                case 'null':
                    if (val !== null) {
                        return false;
                    }
                    break;
                case 'NaN':
                    if (!Number.isNaN(val)) {
                        return false;
                    }
                    break;
                case 'map':
                    if (!(val instanceof Map)) {
                        return false;
                    }
                    break;
                case 'set':
                    if (!(val instanceof Set)) {
                        return false;
                    }
                    break;
                case 'regex':
                    if (!(val instanceof RegExp)) {
                        return false;
                    }
                    break;
                default:
                    return false;
            }
        }
        return true;
    }
    static equals(a, b) {
        if (a === b) {
            return true;
        }
        if ((a instanceof Date || a instanceof datetime_1.DateTime) && (b instanceof Date || b instanceof datetime_1.DateTime)) {
            return a.valueOf() === b.valueOf();
        }
        if (a !== null && b !== null && typeof a === 'object' && typeof b === 'object') {
            if (a.constructor !== b.constructor) {
                return false;
            }
            let length, i;
            if (a.constructor === Array) {
                length = a.length;
                if (length !== b.length) {
                    return false;
                }
                for (i = length; i-- !== 0;) {
                    if (Is.equals(a[i], b[i]) !== true) {
                        return false;
                    }
                }
                return true;
            }
            if (a.constructor === Map) {
                if (a.size !== b.size) {
                    return false;
                }
                let iter = a.entries();
                i = iter.next();
                while (i.done !== true) {
                    if (b.has(i.value[0]) !== true) {
                        return false;
                    }
                    i = iter.next();
                }
                iter = a.entries();
                i = iter.next();
                while (i.done !== true) {
                    if (Is.equals(i.value[1], b.get(i.value[0])) !== true) {
                        return false;
                    }
                    i = iter.next();
                }
                return true;
            }
            if (a.constructor === Set) {
                if (a.size !== b.size) {
                    return false;
                }
                const iter = a.entries();
                i = iter.next();
                while (i.done !== true) {
                    if (b.has(i.value[0]) !== true) {
                        return false;
                    }
                    i = iter.next();
                }
                return true;
            }
            if (a.buffer != null && a.buffer.constructor === ArrayBuffer) {
                length = a.length;
                if (length !== b.length) {
                    return false;
                }
                for (i = length; i-- !== 0;) {
                    if (a[i] !== b[i]) {
                        return false;
                    }
                }
                return true;
            }
            if (a.constructor === RegExp) {
                return a.source === b.source && a.flags === b.flags;
            }
            if (a.valueOf !== Object.prototype.valueOf) {
                return a.valueOf() === b.valueOf();
            }
            if (a.toString !== Object.prototype.toString) {
                return a.toString() === b.toString();
            }
            const keys = Object.keys(a).filter((key) => a[key] !== void 0);
            length = keys.length;
            if (length !== Object.keys(b).filter((key) => b[key] !== void 0).length) {
                return false;
            }
            for (i = length; i-- !== 0;) {
                const key = keys[i];
                if (Is.equals(a[key], b[key]) !== true) {
                    return false;
                }
            }
            return true;
        }
        return a !== a && b !== b;
    }
    static flatValue(value) {
        if ([null, undefined, NaN].includes(value)) {
            return true;
        }
        const flatTypes = ['string', 'boolean', 'number', 'bigint', 'ubigint', 'int', 'uint', 'number', 'unumber'];
        for (const flatType of flatTypes) {
            if (Is.typeOf(value, flatType)) {
                return true;
            }
        }
        return false;
    }
    static empty(value) {
        switch (typeof value) {
            case 'boolean':
                return value === false;
            case 'number':
            case 'bigint':
                return value === 0;
            case 'string':
                return !value.trim().length;
        }
        if (value instanceof Date || value instanceof datetime_1.DateTime) {
            return isNaN(+value);
        }
        if (value instanceof Map || value instanceof Set) {
            return !value.size;
        }
        if (Is.object(value)) {
            return !Object.keys(value).length;
        }
        if (Array.isArray(value) || Buffer.isBuffer(value)) {
            return !value.length;
        }
        return !Boolean(value);
    }
    static nothing(value) {
        return [null, undefined, NaN].includes(value);
    }
    static object(value) {
        return value !== null && !Array.isArray(value) && typeof value === 'object';
    }
    static validateObject(value, options) {
        const suitable = options?.suitable ?? true;
        const validate = (v, rules) => {
            if (!Is.object(v)) {
                throw false;
            }
            rules = rules ?? options?.rules;
            if (Is.object(rules)) {
                if (suitable) {
                    for (const key in v) {
                        if (!rules.hasOwnProperty(key)) {
                            throw false;
                        }
                    }
                }
                for (const key in rules) {
                    const isRuleObject = Is.object(rules[key]);
                    if (isRuleObject) {
                        validate(v[key], rules[key]);
                    }
                    else if (!v.hasOwnProperty(key) || !Is.typeOf(v[key], rules[key])) {
                        throw false;
                    }
                }
            }
        };
        validate(value);
    }
    static record(value, options) {
        try {
            Is.validateObject(value, options);
        }
        catch {
            return false;
        }
        return true;
    }
    static array(value, options) {
        if (!Array.isArray(value) || (options?.notEmpty && !value.length)) {
            return false;
        }
        const rules = options?.rules;
        if (rules) {
            for (const val of value) {
                if (Is.object(rules)) {
                    try {
                        Is.validateObject(val, { rules: rules, suitable: options?.suitable });
                    }
                    catch {
                        return false;
                    }
                }
                else if (!Is.typeOf(val, rules)) {
                    return false;
                }
            }
        }
        return true;
    }
}
exports.Is = Is;
//# sourceMappingURL=is.js.map