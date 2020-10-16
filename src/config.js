/*
 * @Author: pwz
 * @Date: 2020-09-23 11:24:46
 * @LastEditors: pwz
 * @LastEditTime: 2020-10-14 16:25:15
 * @FilePath: \indexeddb-filter\src\config.js
 */
//需要拦截的请求设置，
export let FILTER = {
    "json": ["/tileset/country_index/cesium3dtiles", "localhost:8077/Tileset"],
    //  "b3dm": ["/tileset/country_index/cesium3dtiles"],
    "SceneServer": ["http://192.168.3.251/server/rest/services/Hosted/TianheBuildings_A/SceneServer"],
};
export let DBNAME = "ag_db"; //数据库名称
export let VERSION = 1.0; //数据库版本号
export let EXPIREDAYS = 24; //缓存过期时间 单位小时
export let AUTOCHECK = false; //是否自动更新数据库
export let AUTOCHECKDAYS = 0.5; //数据库自动更新的时间 单位小时
export const CONTENT_TYPE = {//Content-type类型
    0: "text/plain",
    1: "application/json",
    2: "application/octet-stream",
    3: "binary/octet-stream",
    4: "image/png",
    5: "image/jpeg",
}

