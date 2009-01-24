/*
 * JavaScript Integration Framework
 * License LGPL(您可以在任何地方免费使用,但请不要吝啬您对框架本身的改进)
 * http://www.xidea.org/project/jsi/
 * @author jindw
 * @author ShiRongjiu(TryDoFor)[trydofor.com]
 * @version $Id: chinese-calendar.js,v 1.2 2008/02/19 13:30:12 jindw Exp $
 */

//from ShiRongjiu(TryDoFor)[trydofor.com]
// chinese lunar
var TG      = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
var DZ      = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
var SX      = ["鼠","牛","虎","兔","龙","蛇","马","羊","猴","鸡","狗","猪"];
var DATE_CN  = ["一","二","三","四","五","六","七","八","九","十"];
var MON_CN  = ["正","二","三","四","五","六","七","八","九","十","冬","腊"];
//var DAY_CN  = ["日","一","二","三","四","五","六"];
var DAY_TIME = 24*3600*1000;

var LUNAR_DATA = [
    0xA4B,0x5164B,0x6A5,0x6D4,0x415B5,0x2B6,0x957,0x2092F,0x497,0x60C96,    // 1921(2-7)-1930
    0xD4A,0xEA5,0x50DA9,0x5AD,0x2B6,0x3126E, 0x92E,0x7192D,0xC95,0xD4A,     // 1931-1940
    0x61B4A,0xB55,0x56A,0x4155B, 0x25D,0x92D,0x2192B,0xA95,0x71695,0x6CA,   // 1941-1950
    0xB55,0x50AB5,0x4DA,0xA5B,0x30A57,0x52B,0x8152A,0xE95,0x6AA,0x615AA,    // 1951-1960
    0xAB5,0x4B6,0x414AE,0xA57,0x526,0x31D26,0xD95,0x70B55,0x56A,0x96D,      // 1961-1970
    0x5095D,0x4AD,0xA4D,0x41A4D,0xD25,0x81AA5, 0xB54,0xB6A,0x612DA,0x95B,   // 1971-1980
    0x49B,0x41497,0xA4B,0xA164B, 0x6A5,0x6D4,0x615B4,0xAB6,0x957,0x5092F,   // 1981-1990
    0x497,0x64B, 0x30D4A,0xEA5,0x80D65,0x5AC,0xAB6,0x5126D,0x92E,0xC96,     // 1991-2000
    0x41A95,0xD4A,0xDA5,0x20B55,0x56A,0x7155B,0x25D,0x92D,0x5192B,0xA95,    // 2001-2010
    0xB4A,0x416AA,0xAD5,0x90AB5,0x4BA,0xA5B, 0x60A57,0x52B,0xA93,0x40E95    // 2011-2020
];
var TIME_BEGIN = new Date(1921,1,7)*1;
function ChineseDate(date){
    this.date = date;
}
ChineseDate.prototype = {
    getData:function(){
        var date = this.date;
        if(this.time != date.getTime()){
            this.time = date.getTime();
            this.data = findChineseDateInfo(date.getFullYear(),date.getMonth(),date.getDate());
        }
        return this.data;
    },
    getYear:function(){
        return this.getData().year;
    },
    getMonth:function(){
        return this.getData().month;
    },
    getDate:function(){
        return this.getData().date;
    },
    toString:function(){
        var year = this.getYear();
        var month = this.getMonth();
        var date = this.getDate();
        
        var buf =[TG[(year-4)%10]];   //年干
        buf.push(DZ[(year-4)%12]);   //年支
        buf.push("["+SX[(year-4)%12]+"] 年\n");
    
        if(month<1) {
            buf.push("[闰]"); buf.push(MON_CN[-month-1]);
        } else {
            buf.push(MON_CN[month-1]);
        }
    
        buf.push("月 ");
        buf.push(date<11?
                      "初"
                     :date<20?
                           "十"
                          :date<30?
                                 "廿"
                                :"三十");
        if (date!=20 && date!=30){
            buf.push(DATE_CN[(date-1)%10]);
        }
        return buf.join('');
    }
}

function findChineseDateInfo(year,month,date){
    var offset = (new Date(year,month,date) - TIME_BEGIN)/DAY_TIME
    var yOffset = 0;
    var mOffset;
    var data;
    var leapMonth;
    if(offset < 1){
        throw new Error("越界日期"+new Date(year,month,date));
    }
    yearLoop:
    while(true){
        data = LUNAR_DATA[yOffset];
        leapMonth = data>>16;
        mOffset=leapMonth?13:12;//闰年多一月
        while(mOffset--){
            if(offset<=29+(data>>mOffset & 1)){
                break yearLoop;
            }
            offset -= (29+(data>>mOffset & 1));
        }
        yOffset++;
    }
    
    yOffset += 1921;
    //我承认这里比较诡异,自己好好看吧:)
    mOffset= 12 - mOffset;
    if(leapMonth){
        if(mOffset == leapMonth){
            mOffset=-mOffset;
        }else if(mOffset < leapMonth){
            mOffset++;
        }
    }
    return {
        year:yOffset,
        month:mOffset,
        date:offset
    }
}