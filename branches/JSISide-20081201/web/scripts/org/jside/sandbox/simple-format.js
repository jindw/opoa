/*
 * 部分程序参考 trydofor.com 日期格式化程序 LGPL May.2007
 */


/**
 * 将日期或者数字格式化成设定的格式.
 * ===========================================================
 * <h3>日期模式说明</h3>
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
 * 
 * 
 * 
 * Pattern                       Sample
 * YYYY-MM-DD hh:mm:ss           2001-07-04 12:08:56
 * YYYY-MM-DDThh:mm:ss           2001-07-04T12:08:56
 * YYYY/MM/DDThh:mm:ss           2001/07/04T12:08:56
 * YYYY年MM月DD日,周w              2008年12月12日,周3
 * hh:mm                         12:08
 * 
 * 使用代码:
 * var dateText = format("YYYY-MM-DD",date)
 * </pre>
 * 
 * <h3>数字模式说明</h3>
 * 首先以“.”分割成整数部分和小数部分
 * 能后，可以对不同部分做分组，一般是三个数字一组（老外的习惯，中国好像是四个字）.','是分组位置。
 * 分组大小，整数和小数部分各有自己的设置，以离小数点最近位置的一个表示为准（javaFormat的做法）
 * 
 * 截断与补零：尽量不改变数值量，或少改动数值量
 * 整数部分向前补零，小数部分向后补零
 * 整数部分永远不截断，小数部分向后截断
 * <pre>
 * 符号说明：
 * 0 表示补0 的数字占位
 * . 表示小数点
 * , 数字分组符号 如123,456.123
 * # 表示不补0 的数字占位
 * 
 * Number                  Pattern     Result
 * 10000000000001124       #,###.###   10,000,000,000,001,124.000
 * 123.125                 ##,#.#,#    1,2,3.1,3
 * 123.125                 ###.#       123.1
 * 123.125                 00000       00123
 * 123.125                 .000        .125
 * 0.125                   0.0000      0.1250
 * 0.125                   00.0000     00.1250
 * 
 * 使用代码:
 * var numberText = format("##.#",123.456)//output 123.45
 * </pre>
 * @public 
 * @param <String> pattern 格式化模式字符串(参考上面说明)
 * @param <Date | Number> data 需要格式化的数据(目前支持日期和数值类型)
 * @author a9text May.2007
 * @author jindw 2008-07
 */
function format(pattern,data){
    if(data instanceof Date){
        function dl(data,format){//3
            format = format.length;
            data = data || 0;
            return format == 1 ? data : String(Math.pow(10,format)+data).slice(-format);
        }
        return pattern.replace(/([YMDhsm])\1*/g,function(format){
            switch(format.charAt()){
            case 'Y' :
                return dl(data.getFullYear(),format);
            case 'M' : 
                return dl(data.getMonth()+1,format);
            case 'D' : 
                return dl(data.getDate(),format);
            case 'w' :
                return data.getDay()+1;
            case 'h' :
                return dl(data.getHours(),format);
            case 'm' : 
                return dl(data.getMinutes(),format);
            case 's' : 
                return dl(data.getSeconds(),format);
            }
        });
    }else if('number' == typeof data){
        //hack:purePattern as floatPurePattern
        function trim(data,pattern,purePattern){
            if(pattern){
                if(purePattern){
                    if(purePattern.charAt() == '0'){
                        data = data + purePattern.substr(data.length);
                    }
                    if(purePattern!=pattern){
                        var pattern = new RegExp("(\\d{"+pattern.search(/[^\d#]/)+"})(\\d)");
                        while(data.length < (data = data.replace(pattern,'$1,$2')).length);
                    }
                    data =  '.' + data
                }else{
                    var purePattern = pattern.replace(/[^\d#]/g,'');
                    if(purePattern.charAt() == '0'){
                        data = purePattern.substr(data.length) + data;
                    }
                    if(purePattern!=pattern){
                        var pattern = new RegExp("(\\d)(\\d{"+(pattern.length-pattern.search(/[^\d#]/)-1)+"})\\b");
                        while(data.length < (data = data.replace(pattern,'$1,$2')).length);
                    }
                }
                return data;
            }else{
                return '';
            }
        }
        return pattern.replace(/(?:([#0,]+)\.?|\.)([#0,]+)?/,function(param,intPattern,floatPattern){
            var floatPurePattern = floatPattern.replace(/[^\d#]/g,'');
            data = data.toFixed(floatPurePattern.length).split('.');
            return trim(data[0] ,intPattern) + trim(data[1] || '',floatPattern,floatPurePattern);
        })
    }
}