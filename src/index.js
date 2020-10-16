/*
 * @Author: pwz
 * @Date: 2020-09-22 17:01:56
 * @LastEditors: pwz
 * @LastEditTime: 2020-10-14 16:27:46
 * @FilePath: \indexeddb-filter\src\index.js
 */

import InitDBS from "./db.js";
import FetchHook from "./fetch-filter.js";
import AjaxHook from "./ajax-filter";
let Hooks = {};
class HookAll {
    constructor(option = {}) {
        InitDBS.getDBInstance(option).then(() => {
            new AjaxHook();
            new FetchHook();
        });
    }
}
export default Hooks = { HookAll, FetchHook, AjaxHook }
