/*
 * JavaScript Integration Framework
 * License LGPL(您可以在任何地方免费使用,但请不要吝啬您对框架本身的改进)
 * http://www.xidea.org/project/jsi/
 * @author jindw
 * @version $Id: template.js,v 1.4 2008/02/28 14:39:06 jindw Exp $
 */

/**
 * 模板类
 * 起初base 的设计是表示，他是一个url还是一段文本。
 * 感觉没有必要，感觉需要简化。
 * 设计为接受两个参数？
 * <a href="http://code.google.com/p/jsiside/wiki/Template"> 模版基础指令说明</a>
 * @public
 */
function Template(data,parser){
    if("org.xidea.lite:compile"){
    	var impl = $import("org.xidea.lite:Template",{});
    	return new impl(data,parser);
    }
    /**
     * 模板数据
     * @private
     * @tyoeof string
     */
    this.data = data;
}

/**
 * 渲染模板
 * @public
 */
Template.prototype.render = function(context){
    var buf = [];
    var data = this.data;
    var context2 = {};
    for(var n in context){
        context2[n] = context[n];
    }
    data.call(context2,buf,xmlReplacer);
    return buf.join("");
}
function xmlReplacer(c){
    switch(c){
        case '<':
          return '&lt;';
        case '>':
          return '&gt;';
        case '&':
          return '&amp;';
        case "'":
          return '&#39;';
        case '"':
          return '&#34;';
    }
}
