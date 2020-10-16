/*
 * @Author: pwz
 * @Date: 2020-10-11 22:46:40
 * @LastEditors: pwz
 * @LastEditTime: 2020-10-11 23:50:55
 * @FilePath: \indexeddb-filter\test\q.js
 */
console.time("time")
for (var i = 0; i < 100000000; i++) {
    document.querySelector("p")
}
console.timeEnd("time")