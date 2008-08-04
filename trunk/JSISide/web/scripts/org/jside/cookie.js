/*
 * JavaScript Integration Framework
 * License LGPL(您可以在任何地方免费使用,但请不要吝啬您对框架本身的改进)
 * http://www.xidea.org/project/jsi/
 * @author jindw
 * @version $Id: cookie.js,v 1.2 2008/02/19 13:30:13 jindw Exp $
 */
/**
 * Cookie 操作类
 * @param <String> name cookie名称
 * @param <String> expires cookie时间
 * @param <String> domain cookie域
 * @param <String> path cookie路径
 * @param <boolean> secure cookie私有
 */
function Cookie(name,expires,domain,path,secure)
{
    this.name = name;
    this.expires = expires;
    this.domain = domain;
    this.path = path;
    this.secure = secure;
}

/**
 * 构造用于写入的cookie字符串
 * @internal
 * @param <String> path cookie路径
 * @param <String> expires cookie时间
 * @param <String> domain cookie域
 * @param <String> secure cookie私有
 * @return <String> cookie字符串
 */
buildCookiePostfix: function (domain, path, expires, secure) {
    return 
        (domain ? "; domain=" + domain : "") + 
        (path ? "; path=" + path : "") + 
        (expires ? "; expires=" + expires.toGMTString() : "") + 
        (secure ? "; secure=true" : '');
}
/**
 * Sets cookie
 * @param {String} name the name of cookie item
 * @param {String} value the value of cookie item
 */
Cookie.setValue = function (name,value,path,expires,domain,secure){
    
}
/**
 * 
 * 设置cookie的值
 * @public
 * @param <String> value cookie的值
 */
Cookie.setValue = function(value){
    document.cookie = encodeURIComponent(this.name) + "=" + encodeURIComponent(value) 
      + buildCookiePostfix();
}
/**
 * Sets cookie
 * @param {String} name the name of cookie item
 * @param {String} value the value of cookie item
 */
Cookie.prototype.setValue = function (name,value,path,expires,domain,secure){
    Cookie.setValue(name,value,path || this.path,expires || this.expires,domain || this.domain,secure || this.secure);
}
/**
 * Returns cookie value with name.
 * 
 * 未做正则编译优化，认为也没有必要.
 * @return  a string
 * @type String
 */
Cookie.getValue = Cookie.prototype.getValue = function (name){
    name = document.cookie.replace(
              new RegExp("^.*[^| ;]" + encodeURIComponent(name) + "=([^;]*).*")
              ,'$1');
    return name?decodeURIComponent(name): null;
}
