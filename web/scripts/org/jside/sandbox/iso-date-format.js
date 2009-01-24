/*
 * 部分程序参考 trydofor.com 日期格式化程序 LGPL May.2007
 */


/**
 * 将日期格式化成设定的格式.
 * ===========================================================
 * <pre>
 * like the ISO 8895
 * also see Java's SimpleDateFormat.
 * 
 * Letter  Date or Time Component  Presentation    Examples          UserDic
 * Y       Year                    Year            1996; 96
 * M       Month in year           Month           July; Jul; 07     *
 * D       Day in month            Number          10
 * w       Day in week             Text            Tuesday; Tue; 2   *
 * h       Hour in day (0-23)      Number          0
 * m       Minute in hour          Number          30
 * s       Second in minute        Number          55
 * s.ss    Second in minute(带小数) Number          55.04(55秒零40毫秒)
 * 
 * 
 * 
 * Pattern                       Sample
 * YYYY-MM-DDThh:mm:ss           2001-07-04T12:08:56
 * YYYY-MM-DD 'T' hh:mm:ss       2001-07-04 at 12:08:56
 * YYYY/MM/DD 'T' hh:mm:ss       2001/07/04 at 12:08:56
 * YYYY年MM月DD日,周w              2008年12月12日,周3
 * hh:mm                         12:08
 * hh点mm分ss.s秒                 12点08分12.4秒
 * hh点mm分ss.ss秒                12点08分12.44秒
 * hh点mm分ss.sss秒               12点08分12.448秒
 * YYYYMMDDhhmmss.s             010704120856.0
 * YYYYMMDDhhmmss.ss             010704120856.09
 * YYYYMMDDhhmmss.sss            010704120856.099
 * 
 * 
 * 
 * Example:
 * var formater = new DateFormat(&lt;pattern&gt;);
 * formater.format(date)
 * </pre>
 *    
 * @public 
 * @param <pattern> 格式化字符串(参考上面说明)
 * @author a9text May.2007
 * @author jindw 2008-07
 */
function ISODateFormat(pattern){
    var match;
    var result = [];
    var keys = ["s+[\.,]s+|"];
    for(var n in this.replacerMap){
        keys.push(n);
        keys.push('+|');
    }
    keys.push("'(?:''|[^'])*'|(..*?)");  
    keys = new RegExp(keys.join(''),'g');
    while(match = keys.exec(pattern)){
        var item = match[0];
        if(this.replacerMap[item.charAt()]){
            result.unshift([item])
        }else{
            item = item.replace(/^'|(')'|'$/g,'$1');
            result.unshift(item);
        }
    }
    this.template = result;
    //alert(result)
}

ISODateFormat.prototype = {
    /**
     * 格式化函数
     * @public
     * @param <Date>date 需要格式化的日期
     * @return <String> 格式化日期字符串
     */
    format:function(date){
        var template = this.template;
        var result = [];
        var i = template.length;
        while(i--){
            var item = template[i];
            if(item instanceof Array){
                item = item[0];
                result.push(this.replacerMap[item.charAt()].call(this,date,item) || item)
            }else{
                result.push(item);
            }
        }
        return result.join('')
    },
    /**
     * 日期解析函数
     * @public
     * @param <String>text 格式化的日期字符串
     * @return <Date> 解析的日期
     */
    parse:function(text){
        var template = this.template;
        var date = new Date(0);
        var i = template.length;
        while(text && i--){
            var item = template[i];
            if(item instanceof Array){
                item = item[0];
                var fn = this.parserMap[item.charAt()];
                if(fn){
                    text = text.substr((fn.call(this,text,item,date) || text).length);
                    continue;
                }
            }
            text = text.substr(item.length);
        }
        return date
    },
    /**
     * @private
     */
    replacerMap : {
        'Y' : function(date,format){
            return formatNumber(date.getFullYear(),format);
        },
        'M' : function(date,format){
            return formatNumber(date.getMonth()+1,format);
        },
        'D' : function(date,format){
            return formatNumber(date.getDate(),format);
        },
        'w' : function(date,format){
            return date.getDay()+1;
        },
        'h' : function(date,format){
            return formatNumber(date.getHours(),format);
        },
        'm' : function(date,format){
            return formatNumber(date.getMinutes(),format);
        },
        's' : function(date,format){
            if("com.baidu.ue.text:ISODateFormat#ms"){
                var index = format.search(/[,\.]/);
                if(index>0){
                    return formatNumber(date.getSeconds(),format.substr(0,index))
                           + format.charAt(index)
                           + String(1000 +date.getMilliseconds()).substr(1,format.length-index-1);
                }
            }
            return formatNumber(date.getSeconds(),format);
        }
    },
    /**
     * @private
     */
    parserMap : {
        'Y' : function(text,format,date){
            text = parseNumber(text,format);
            date.setFullYear(parseInt(text,10))
            return text;
        },
        'M' : function(text,format,date){
            text = parseNumber(text,format);
            date.setMonth(parseInt(text,10)-1)
            return text;
        },
        'D' : function(text,format,date){
            text = parseNumber(text,format);
            date.setDate(parseInt(text,10))
            return text;
        },
        'h' : function(text,format,date){
            text = parseNumber(text,format);
            date.setHours(parseInt(text,10))
            return text;
        },
        'm' : function(text,format,date){
            text = parseNumber(text,format);
            date.setMinutes(parseInt(text,10))
            return text;
        },
        's' : function(text,format,date){
            if("com.baidu.ue.text:ISODateFormat#ms"){
                var index = format.search(/[,\.]/);
                if(index>0){
                    text =text.match(/(\d+)[,\.](\d+)/);
                    date.setSeconds(parseInt(text[1],10));
                    date.setMilliseconds(1000*parseFloat("0."+text[2],10));
                    return text[0];
                }
            }
            text = parseNumber(text,format);
            date.setSeconds(parseInt(text,10))
            return text;
        }
    }
}
function formatNumber(data,format){//3
    format = format.length;
    data = data || 0;
    return format == 1 ? data : String(Math.pow(10,format)+data).substr(1);
}
function parseNumber(text,format){
    format = format.length;
    text =  text.replace(/[^\d][\d\D]*$/,''); ///^\d+/.exec(text)[0]
    return format ==  1 ? text : text.substr(0,format)
}
var defaultTimeFormat = new ISODateFormat("YYYY-MM-DDThh:mm:ss");
var defaultDateFormat = new ISODateFormat("YYYY-MM-DD");

ISODateFormat.format = function(date){
    return defaultDateFormat.format(date)
}

ISODateFormat.parse = function(text){
    return defaultTimeFormat.parse(text)
}
