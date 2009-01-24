/**
 * URL解析工具
 */
var URLParser = {
    /**
     * 获取当前URL查询参数集合(键值对)
     */
    getParameterMap:function(){
        var query = window.location.search;
        var params = query.substr(1).split('&');
        var parameterMap = {};
        for(var i=0;i<params.length;i++){
            var kv = params[i].split('=');
            parameterMap[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1]);
        }
        return parameterMap;
    }
}
