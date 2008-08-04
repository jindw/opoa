/**
 * 文件内数据
 */

var dayList = ['日','一','二','三','四','五','六'];
var monthList = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
if(window.decorator){
    //alert(window.parent.$JSI.getComponent)
    //var decorator = window.parent.$JSI.getComponent((window.location+"").replace(/.*#(.*)/,"$1"));
    var sourceDate = decorator.getDate()||new Date();
}else{
    var sourceDate = new Date();
}
//alert(window.decorator)
var displayYear = sourceDate.getFullYear()
var displayMonth = sourceDate.getMonth();
function changeYear(arg){
    if(arg == 1){
        displayYear++;
    }else if(arg == -1){
        displayYear--;
    }else{
        displayYear = parseInt(arg.value,10);
    }
    repaint();
}
function changeMonth(arg){
    if(arg == 1){
        displayMonth++;
    }else if(arg == -1){
        displayMonth--;
    }else{
        displayMonth = parseInt(arg.value,10);
    }
    while(displayMonth>11){
        displayYear++;
        displayMonth -= 12;
    }
    while(displayMonth<0){
        displayYear--;
        displayMonth += 12;
    }
    repaint();
}
var moveTimer;
function setupMoveTimer(offset){
    clearMoveTimer()
    moveTimer = window.setTimeout(function(){
        moveTimer = window.setInterval(function(){
            changeMonth(offset)
        },100);
        },500)
    
}
function clearMoveTimer(){
    if(moveTimer){
        window.clearInterval(moveTimer);
        moveTimer = null;
    }
}
function stopEdit(){
    document.getElementById("yearContainer").className='';
    document.getElementById("monthContainer").className='';
}
function getDateOffset(dest,src){
    var offset = new Date(dest.getFullYear(),dest.getMonth(),dest.getDate())
        -new Date(src.getFullYear(),src.getMonth(),src.getDate());
    return offset/86400000;//(24*60*60*1000)
}
var dateList = null;
function buildDateList(year,month){
    var date = new Date(year,month,1);
    var dateList = new Array(42);
    var begin = date.getDay();
    dateList[begin] = 1;
    dateList.begin = begin;
    dateList.currentIndex = begin + getDateOffset(sourceDate,date);
    dateList.todayIndex = begin + getDateOffset(new Date(),date);
    if(begin>0){
        var preDate = new Date(date);
        preDate.setDate(0);
        dateList[0] = preDate.getDate()-begin+1;
    }
    var date = new Date(date);
    date.setDate(31);
    date = date.getDate();
    if(date == 31){
        dateList[dateList.end = begin+31] = 1
    }else{
        dateList[dateList.end = 31+begin-date] = 1
    }
    return dateList;
}
function repaint(){
    var yearContainer = document.getElementById("yearContainer");
    var monthContainer = document.getElementById("monthContainer");
    yearContainer.getElementsByTagName("div")[0].innerHTML = displayYear;
    yearContainer.getElementsByTagName("input")[0].value = displayYear;
    monthContainer.getElementsByTagName("div")[0].innerHTML = monthList[displayMonth];
    var options = monthContainer.getElementsByTagName("select")[0];
    for(var i = options.length-1;i>=0;i--){
        options[i].selected = options[i].value == displayMonth;
    }
    var content = document.getElementById("content").getElementsByTagName("tbody")[0];
    dateList = buildDateList(displayYear,displayMonth);
    for(var i=0,k=0,p;i<6;i++){
        var row = content.rows[i];
        for(var j = 0;j<7;j++,k++){
            var cell = row.cells[j];
            p = dateList[k] = dateList[k]||p+1;
            cell.innerHTML = p;
            var classNames = [];
            if(k<dateList.begin || k>=dateList.end){
                classNames.push("outer-date");
            }
            if(dateList.currentIndex == k){
                classNames.push("current-date");
            }
            if(dateList.todayIndex == k){
                classNames.push("today-date");
            }
            cell.className = classNames.join(" ");
        }
    }
}
function clickDateCell(index){
    if(index<dateList.begin){
        displayMonth--;
        if(displayMonth<0){
            displayMonth = 11;
            displayYear--;
        }
        var date = new Date(displayYear,displayMonth,dateList[index])
    }else if(index<dateList.end){
        var date = new Date(displayYear,displayMonth,dateList[index])
    }else {
        displayMonth++;
        if(displayMonth>11){
            displayMonth = 0;
            displayYear++;
        }
        var date = new Date(displayYear,displayMonth,dateList[index])
    }
    sourceDate = date;
    repaint();
    decorator.setDate(date);
}






function doSelect(date){
    sourceDate = date;
    displayYear = sourceDate.getFullYear()
    displayMonth = sourceDate.getMonth();
    repaint();
}

function selectToday(){
    sourceDate = new Date();
    displayYear = sourceDate.getFullYear();
    displayMonth = sourceDate.getMonth();
    repaint();
    decorator.setDate(sourceDate);
}

var monthSelect = document.getElementsByTagName("select")[0];
for(var i = 0; i<monthList.length;i++){
    var option = document.createElement("option");
    option.text = monthList[i];
    option.value = i;
    if(monthSelect.options.add){
         monthSelect.options.add(option);
    }else{
        //w3c is a group of pigs
        monthSelect.add(option,null);
    }
}

function initializeContent(){
    var buf = ['<table cellspacing="0" cellpadding="0" border="0">']
    buf.push('<thead><tr>')
    for(var i = 0;i<7;i++){
        buf.push('<th>'+dayList[i]+'</th>')
    }
    buf.push('</tr></thead>')
    buf.push('<tbody>')
    for(var i=0,k=0;i<6;i++){
        buf.push('<tr>')
        for(var j = 0;j<7;j++,k++){
            buf.push('<td onclick="clickDateCell('+k+')"></td>')
        }
        buf.push('</tr>')
    }
    buf.push('</tbody>')
    buf.push('</table>')
    document.getElementById("content").innerHTML = buf.join('');
}
initializeContent()
repaint();
