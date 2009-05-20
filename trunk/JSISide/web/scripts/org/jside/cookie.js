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
function Cookie(name,path,expires,domain,secure){
    this.name = name;
    this.expires = expires;
    this.domain = domain;
    this.path = path;
    this.secure = secure;
}
/**
 * 
 */
function buildPostfix(path,expires,domain,secure){
    return (path ? "; path=" + path : "" )+ 
      (expires ? "; expires=" + expires.toGMTString() : "" )+ 
      (domain ? "; domain=" + domain :"")+ 
      (secure?"; secure":'');
}
/**
 * 设值
 * @param <String> value
 */
Cookie.prototype.set = function (value){
  document.cookie = this.name + "=" + encodeURIComponent(value) 
     + buildPostfix(this.path,this.expires,this.domain,this.secure);
}
/**
 * 删除
 * @param <String> value 
 */
Cookie.prototype.remove = function (){
  document.cookie = this.name + "=" 
     + buildPostfix(this.path,new Date(0),this.domain,this.secure);
}
/**
 * 取值
 * @return <string>
 */
Cookie.prototype.get = function (){
    var exp = new RegExp("^(?:.*"+ this.name+ "=([^;]*))?.*");
    return (this.get = function(){
      var value = document.cookie.replace(exp,'$1');
      return value && decodeURIComponent(value);
    })();
}