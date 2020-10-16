/*
 * @Author: pwz
 * @Date: 2020-09-22 17:01:56
 * @LastEditors: pwz
 * @LastEditTime: 2020-10-14 16:26:27
 * @FilePath: \indexeddb-filter\src\ajax-filter.js
 */
import InitDBS from "./db.js";
import dbInterfas from "./dbInterfas.js";
import {
    proxy
} from "ajax-hook";

class Filter {
    constructor(option = {}) {
        this.nowPending = 0;
        this.maxPending = 0;
        this.init(option);
    }
    /**
     * @description: 拦截ajax请求的流程
     * @param {type} 
     * @return {type} 
     */
    async init(option) {
        let _this = this;
        let initDBS = await InitDBS.getDBInstance(option);
        proxy({
            //请求发起前进入
            onRequest: (config, handler) => {
                _this.nowPending += 1
                if (_this.maxPending < _this.nowPending) {
                    _this.maxPending = _this.nowPending
                }
                let url = handler.xhr.config.url;
                let tableName = InitDBS.getTableNameByUrl(url);
                if (tableName == undefined) {
                    //不在拦截范围，放过
                    return handler.next(config);
                }
                if (InitDBS.db == undefined) {
                    return handler.next(config);
                }

                //先查询数据库，确认数据是否存在
                var id = InitDBS.urlToId(url);
                dbInterfas.query(InitDBS.db, tableName, id).then(result => {
                    if (result) {
                        //存在的直接返回
                        _this.nowPending -= 1
                        handler.resolve({
                            config: config,
                            status: 200,
                            headers: result.headers,
                            response: result.value
                        })
                        return
                    }
                    handler.next(config)
                })
            },
            //请求发生错误时进入，比如超时；注意，不包括http状态码错误，如404仍然会认为请求成功
            onError: (err, handler) => {
                handler.next(err)
            },
            //请求成功后进入
            onResponse: (response, handler) => {
                _this.nowPending -= 1;
                //储存数据到浏览器缓存
                handler.next(response);
                let url = handler.xhr.config.url;
                let tableName = InitDBS.getTableNameByUrl(url);
                if (tableName == undefined) {
                    //不在拦截范围，不存
                    return
                }
                var id = InitDBS.urlToId(url);
                dbInterfas.add(InitDBS.db, tableName, {
                    id,
                    value: response.response,
                    headers: response.headers,
                    time: initDBS.setCaseTime()
                })

            }
        })
    }

}
export default Filter;
