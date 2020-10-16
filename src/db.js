/*
 * @Author: pwz
 * @Date: 2020-09-24 21:48:47
 * @LastEditors: pwz
 * @LastEditTime: 2020-10-14 16:32:44
 * @FilePath: \indexeddb-filter\src\db.js
 */
import {
    FILTER,
    DBNAME,
    VERSION,
    EXPIREDAYS,
    AUTOCHECKDAYS,
    AUTOCHECK
} from "./config.js";
import initTable from "./dbInterfas.js";
import defaultValue from "./defaultValue.js"
import md5 from "js-md5";

//请求队列
class initDBS {
    constructor(option = {}) {
        initDBS.instance = this;
        this.filter = defaultValue(option.filter, FILTER);
        this.dbName = defaultValue(option.dbName, DBNAME);
        this.version = defaultValue(option.version, VERSION);
        //是否自动更新数据库
        this.autoCheck = defaultValue(option.autoCheck, AUTOCHECK);
        //设置单挑记录的缓存时间
        this.expireDays = defaultValue(option.expireDays, EXPIREDAYS);
        //数据库自动更新的时间
        this.autoCheckDays = defaultValue(option.autoCheckDays, AUTOCHECKDAYS);
        //创建数据库
        this.db = initDBS.init(this.dbName, this.version, this.filter);
        //定期更新数据库，检查是否有过期数据
        this.autoUpdateDB();
    }

    /**
        * @description: 设置缓存过期时间
        * @param {Number} expireDays:过期时间，单位为天 默认1天
        * @return {type} 
        */
    setCaseTime(expireDays) {
        if (expireDays) this.expireDays = expireDays;
        return Date.now() + this.expireDays * 3600 * 1000 + Math.floor(Math.random() * 2 * 3600 * 1000)
    }

    /**
     * @description: 定期更新缓存，清除过期数据
     * @param {type} 
     * @return {type} 
     */
    autoUpdateDB() {
        if (!this.autoCheck) {
            return
        }
        setInterval(() => {
            initTable.autoUpdateTables(initDBS.db, Object.keys(initDBS.instance.filter));
        }, 1000 * 60 * 60 * this.autoCheckDays)
    }

    /**
     * @description: 创建数据库,创建表
     * @param {type} 
     * @return {type} 
     */
    static init(dbName, version, filter) {
        return new Promise((res, rej) => {
            if (initDBS.db) {
                res(initDBS.db);
                return;
            }
            let request = initTable.createDB(dbName, version);
            request.onerror = event => {
                rej(undefined);
                throw new Error(event);
            };
            request.onupgradeneeded = event => {
                initDBS.db = event.target.result;
                initTable.createTables(initDBS.db, Object.keys(filter), "id");
                res(initDBS.db);
            };
            request.onsuccess = event => {
                initDBS.db = event.target.result;
                res(initDBS.db);
            };
            request.onblocked = function (event) {
                rej(undefined);
                throw new Error(event);
            };
        })
    }

    /**
     * @description:处理url 
     * @param {type} 
     * @return {type} 
     */
    static urlToId(url) {
        return md5(url);
    }

    /**
     * @description: 通过url获取tableName 表名
     * @param {type} 
     * @return {type} 
     */
    static getTableNameByUrl(url) {
        if (!url) {
            return undefined
        }
        for (let item in initDBS.instance.filter) {
            if (url.includes(item)) {
                var valueList = initDBS.instance.filter[item]
                if (Array.isArray(valueList)) {
                    if (valueList.find(value => {
                        return url.includes(value)
                    }) != undefined) {
                        return item
                    }
                } else {
                    return item;
                }
            }
        }
        return undefined;
    }
    /**
     * @description: 获取数据库示例
     * @param {type} 
     * @return {type} 
     */
    static async getDBInstance(option = {}) {
        if (initDBS.db) return initDBS.instance;
        let instance = new initDBS(option);
        let data = await instance.db;
        instance.db = instance;
        return instance;
    }
}

export default initDBS;
