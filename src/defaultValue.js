/*
 * @Author: pwz
 * @Date: 2020-09-28 15:15:18
 * @LastEditors: pwz
 * @LastEditTime: 2020-10-14 16:27:11
 * @FilePath: \indexeddb-filter\src\defaultValue.js
 */

/**
 * Returns the first parameter if not undefined, otherwise the second parameter.
 * Useful for setting a default value for a parameter.
 *
 * @exports defaultValue
 *
 * @param {*} a
 * @param {*} b
 * @returns {*} Returns the first parameter if not undefined, otherwise the second parameter.
 *
 * @example
 * param = Cesium.defaultValue(param, 'default');
 */
function defaultValue(a, b) {
    if (a !== undefined && a !== null) {
        return a;
    }
    return b;
}

/**
 * A frozen empty object that can be used as the default value for options passed as
 * an object literal.
 * @type {Object}
 */
defaultValue.EMPTY_OBJECT = Object.freeze({});
export default defaultValue;
