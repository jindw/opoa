/*
 * JavaScript Integration Framework
 * License LGPL(您可以在任何地方免费使用,但请不要吝啬您对框架本身的改进)
 * http://www.xidea.org/project/jsi/
 * @author jindw
 * @version $Id: fn.js,v 1.5 2008/02/24 08:58:15 jindw Exp $
 */

/*
 * JavaScript Integration Framework
 * License LGPL(您可以在任何地方免费使用,但请不要吝啬您对框架本身的改进)
 * http://www.xidea.org/project/jsi/
 * @author jindw
 * @version $Id: fn.js,v 1.5 2008/02/24 08:58:15 jindw Exp $
 */


function compressText(text){
    var result = [];
    var len = text.length;
    var nextTokenStart = 0;
    while(nextTokenStart<len){
        var previousText = text.substring(0,nextTokenStart);
        var searchEnd = nextTokenStart+1;
        var searchMatchStart=-1;
        while(searchEnd<len){
            var k = previousText.indexOf(text.substring(nextTokenStart,searchEnd))
            if(k<0){
                break;
            }else{
                searchMatchStart = k;
                searchEnd++;
            }
        }
        if(searchMatchStart>-1){
            var tokenLength = searchEnd-nextTokenStart-1;
            result.push([searchMatchStart,tokenLength,text.substr(searchMatchStart,tokenLength)]);
            nextTokenStart+=tokenLength;
        }else{
            result.push(text.substring(nextTokenStart,nextTokenStart+1));
            nextTokenStart++;
        }
    }
    return result;
}
function serialize(source){
    var result = [];
    for(var i=0;i<source.length;i++){
        var item = source[i];
        if(item instanceof Array){
            result.push('^'+item[0].toString(32)+item[1].toString(32));
        }else if(item == '^'){
            result.push('^^');
        }else{
            result.push(item);
        }
    }
    return result.join('')
}