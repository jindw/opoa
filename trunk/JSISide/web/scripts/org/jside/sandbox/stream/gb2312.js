/*
 * JavaScript Integration Framework
 * License LGPL(您可以在任何地方免费使用,但请不要吝啬您对框架本身的改进)
 * http://www.xidea.org/project/jsi/
 * @author jindw
 * @version $Id: fn.js,v 1.5 2008/02/24 08:58:15 jindw Exp $
 */

var buf = [];
for(var i = 0xA1;i<=0xF7;i++){
	for(var j = 0xA1;j<=0xFE;j++){
	    buf.push(i,j);
	}
}
var base64 = btoa(String.fromCharCode.apply(String,buf));

var xhr = new XMLHttpRequest();
xhr.open('GET', "data:text/plain;charset=GBK;base64,"+base64,false);
xhr.send('');

alert(xhr.responseText)
