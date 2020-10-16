
indexedDB-Filter插件實現原理的對ajax,fetch原生對象進行代理攔截，然後將結果儲存到indexedDB數據庫中。

使用示例，非es6環境
<script src="../dist/indexed-filter.js"></script>
  <script>  
  if (window.indexedFilter) {
            //全部拦截，包括ajax，fetch发送的请求
            new window.indexedFilter.FetchHook({
                filter: {//"json"表示建表名称，"/tileset/country_index/cesium3dtiles"表示需要拦截的请求的公共部分
                    "json": ["localhost:8077/Tileset"],
                    "21187": ["/21187"]       
                },
            });
            //测试地址
            let textUrl = "https://js.arcgis.com/4.17/esri/widgets/Zoom/t9n/Zoom_zh-CN.json";
            let uri1 = 'http://localhost:8077/Tileset/tileset.json';
                //发送一个fetch 请求图片
                fetch(textUrl)
                    .then(function (response) {
                        response.json().then(data => {
                         console.log(data);
                        })
                    })
                //发送一个ajax
                $.get(uri1).then(da => {
                    da
                })
                }
    
    </script>
使用實例 es6環境下
<script>

</script>


