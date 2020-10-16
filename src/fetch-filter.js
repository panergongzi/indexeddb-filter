/*
 * @Author: pwz
 * @Date: 2020-09-25 10:26:10
 * @LastEditors: pwz
 * @LastEditTime: 2020-10-14 15:39:37
 * @FilePath: \indexeddb-filter\src\fetch-filter.js
 */
import { CONTENT_TYPE } from "./config"
import dbInterfas from "./dbInterfas.js";
import InitDBS from "./db.js";
var oldFetchfn = fetch; //拦截原始的fetch方法
let initDBS;
class InitFetch {
    constructor(option) {
        this.init(option);
        this.nowPending = 0;
        this.maxPending = 0;
    }
    async init(option) {
        let _this = this;
        this.initDBS = await InitDBS.getDBInstance(option);
        initDBS = _this.initDBS;
        window.fetch = async function (url, opts) {
            _this.nowPending += 1
            if (_this.maxPending < _this.nowPending) {
                _this.maxPending = _this.nowPending
            }
            let tableName = InitDBS.getTableNameByUrl(url);
            //不在拦截范围，放过
            if (tableName == undefined || InitDBS.db == undefined) {
                return oldFetchfn(url, opts);
            }

            //先查询数据库，确认数据是否存在
            var id = InitDBS.urlToId(url);
            let result = await dbInterfas.query(InitDBS.db, tableName, id)
            if (result) {
                //console.log("从数据库返回", result);
                //存在的直接返回
                _this.nowPending -= 1
                return _this.response(result);
            } else {
                return _this.fetchPromise(url, opts, id, tableName);
            }

        }
        return window.fetch;
    }
    /**
     * @description: 请求发送之前
     * @param {type} 
     * @return {type} 
     */
    berforRequest() {
    }
    /**
     * @description: 自定义代理的响应，将数据返回
     * @param {type} 
     * @return {type} 
     */
    response(data) {
        let Body = InitFetch.responseStringify(data);
        let response = new Response(Body, {
            ok: true,
            statusText: "OK",
            status: 200
        })
        response.headers.set("Content-Type", data.contentType);
        return response
    }
    /**
     * @description: 对于特定请求，用原始fetch对象发送请求，然后缓存到indexedDB中
     * @param {type} 
     * @return {type} 
     */
    async fetchPromise(url, opts, id, tableName) {
        let _this = this, _data;
        let response = await oldFetchfn(url, opts);
        let contentType = response.headers.get("content-type");
        _data = await InitFetch.responseParse(response);
        dbInterfas.add(InitDBS.db, tableName, {
            id,
            value: _data,
            contentType,
            time: initDBS.setCaseTime()
        })
        return _this.response({
            value: _data,
            contentType,
        });
    }
    /**
     * @description: 根据请求请求头Content-Type 获取对应的数据
     * @param {type} 
     * @return {type} 
     */
    static async responseParse(response) {
        let result
        let contentType = response.headers.get("content-type");
        if (contentType.includes(CONTENT_TYPE["0"]) || contentType.includes(CONTENT_TYPE["1"])) {
            result = await response.json()
        } else if (contentType.includes(CONTENT_TYPE["2"]) || contentType.includes(CONTENT_TYPE["3"])) {
            result = await response.arrayBuffer()
        } else if (contentType.includes(CONTENT_TYPE["4"]) || contentType.includes(CONTENT_TYPE["5"])) {
            result = await response.blob()
        }
        return result;

    }
    /**
     * @description: 根据请求请求头Content-Type 将数据
     * @param {type} 
     * @return {type} 
     */
    static responseStringify(data) {
        let result
        let contentType = data.contentType;
        if (contentType.includes(CONTENT_TYPE["0"]) || contentType.includes(CONTENT_TYPE["1"])) {
            result = JSON.stringify(data.value)
        }
        return result;
    }

}
export default InitFetch;


