/*
 * @Author: pwz
 * @Date: 2020-09-24 21:48:47
 * @LastEditors: pwz
 * @LastEditTime: 2020-10-14 16:22:24
 * @FilePath: \indexeddb-filter\src\dbInterfas.js
 */

class dbInterfas {
    constructor() { }

    /**
     * @description: 创建数据库
     * @param {type} 
     * @return {type} 
     */
    createDB(dbName, version) {
        var indexedDB = window.indexedDB || window.msIndexedDB || window.mozIndexedDB || window.webkitIndexedDB;
        return indexedDB.open(dbName, version);
    }

    /**
     * @description: 批量创建表
     * @param {type} 
     * @return {type} 
     */
    createTables(db, tableNames, index) {
        tableNames.map((item) => this.createTable(db, item, index))
    }

    /**
     * @description: 创建表
     * @param {type} 
     * @return {type} 
     */
    createTable(db, tableName, index) {
        if (!db.objectStoreNames.contains(tableName)) {
            var objectStore = db.createObjectStore(tableName, {
                keyPath: index
            });
            return objectStore
        }
    }

    /**
     * @description: 遍历数据库里是的所有表,自动更新过期数据
     * @param {type} 
     * @return {type} 
     */
    autoUpdateTables(db, tableNames, _callBack) {
        let _this = this;
        tableNames.map(item => {
            _this.autoUpdateTable(db, item, _callBack)
        })

    }

    /**
     * @description: 遍历数据库中的单张表，自动更新数据
     * @param {type} 
     * @return {type} 
     */
    autoUpdateTable(db, tableName) {
        let _this = this;
        try {
            var store = db.transaction(tableName, "readwrite").objectStore(tableName);
            var cursorReq = store.openCursor();
            cursorReq.onsuccess = function (event) {
                var cursor = event.target.result; //取得存储空间的下一个对象
                if (cursor) {
                    if (_this.check(cursor.value)) {
                        _this.delete(db, tableName, cursor.value.id);
                    }
                    cursor.continue(); //移动到结果集的下一项，即遍历下一项，触发一次请求
                }
            };
            cursorReq.onerror = function (event) {
                event
                // log("错误信息为：" + event.target.errorCode);
            };
        } catch (err) {
            // log(err);
        }

    }

    /**
     * @description: 删除表
     * @param {type} 
     * @return {type} 
     */
    deleteTable(db, tableName) {
    }

    /**
     * @description: 更新表
     * @param {type} 
     * @return {type} 
     */
    updata(db, tableName) { }

    /**
     * @description:检查单条数据是否过期
     * @param {type} 
     * @return {type} 
     */
    check(data) {
        let indexTime = new Date().getTime();
        if (!data || !data.time) {
            return false
        }
        if (indexTime > data.time) {
            return true
        }
        return false;
    }

    /**
     * @description: 查询表返回数据 如果数据时间失效则删除缓存数据，
     * @param {type} 
     * @return {type} 
     */
    async query(db, tableName, id) {
        let transaction = this.transaction(db, tableName);
        if (transaction) {
            let result = await this.createNomalCallback(transaction.get(id));
            return result.result;
        }
    }

    /**
     * @description: 快速查询
     * @param {type} 
     * @return {type} 
     */
    async faseQuery(db, tableName, idList) {
        let resultList = [];
        // try {
        var store = db.transaction(tableName).objectStore(tableName);
        for (var i = 0, len = idList.length; i < len; i++) {
            let result = await this.createNomalCallback(store.get(idList[i]));
            let re = result.result
            resultList.push(re ? re : {
                id: idList[i],
                value: undefined
            })
        }
        return resultList;
        // } catch (err) {
        //     throw err;
        // }
    }

    /**
     * @description: 添加记录
     * @param {type} 
     * @return {type} 
     */
    async add(db, tableName, option) {
        let transaction = this.transaction(db, tableName);
        if (transaction) {
            let result = await this.createNomalCallback(transaction.add(option));
            return result.result
        }
    }

    /**
     * @description:删除记录id 
     * @param {type} 
     * @return {type} 
     */
    async delete(db, tableName, id) {
        let transaction = this.transaction(db, tableName);
        if (transaction) {
            let result = await this.createNomalCallback(transaction.delete(id));
            return result.readyState
        }
    }

    /**
     * @description: 增删改查回调
     * @param {type} 
     * @return {type} 
     */
    createNomalCallback(request) {
        return new Promise((res, rej) => {
            request.onsuccess = result => {
                res(result.target)
            }
            request.onerror = result => {
                rej(result)
            }
        })
    }
    /**
     * @description: 发起事务
     * @param {type} 
     * @return {type} 
     */
    transaction(db, tableName, operating = "readwrite") {
        try {
            return db.transaction(tableName, operating).objectStore(tableName)
        } catch (err) {
            // log(err);
            return undefined;
        }
    }
}
export default new dbInterfas();
