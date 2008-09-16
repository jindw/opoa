var contentTemplate = new Template(this.scriptBase + "html/date-picker.xhtml#//*[@id='content']/*");
var popupTemplate = new Template(this.scriptBase + "html/date-picker.xhtml#//*[@id='popup']/*");
var inlineTemplate = new Template(this.scriptBase + "html/date-picker.xhtml#//*[@id='inline']/*");

/**
 * @public
 * @decorator datepicker
 * @attribute type popup|inline
 * @attribute value eg:2004/12/12
 * @attribute pattern eg:yyyy/MM/dd
 */
function DatePicker(engine){
    this.engine = engine;
}

DatePicker.prototype = {
    type : "popup",
    prepare : function(){
        //type 约束处理
        if(":debug"){
            if(this.type && !/^(?:inline|popup)$/.test(this.type)){
                $log.error("DataPicker 的type属性只能是 inline 或者 popup");
            }
        }
        this.format = new ISODateFormat(this.pattern || 'Y-M-D');
        this.type = this.type && this.type.toLowerCase() =='inline'?'inline':'popup'
    },
    decorate : function(){
    	var wrapTemplate = this.type == 'inline'?inlineTemplate:popupTemplate;
        var el = E(this.id);
        var content = new Element("div");
        applyTemplate(
            el,
            wrapTemplate.render({
	            action:this.engine.action({
	                popup : buildPopupListener(this)
	            })
	        }),el,content,content);
        this.contentId = content.uid();
        this.actionMap = {
            decorator:this,
            today:createDateItem(new Date()),
            action:this.engine.action({
                pick:buildPickListener(this),
                overDate:Function.prototype,
                outDate:Function.prototype,
                out:buildPickListener(this),
                repaint : buildRepaintListener(this)
            })
        }
        el.attach("change",buildInputChangeListener(this));
        content.onclick = stopPropagation;
        try{
        	if(el.value){
                this.selectedDate = this.format.parse(el.value);
        	}
            if(this.type == "inline"){
                this.refresh();
            }
        }catch(e){
          	 throw e;
        }
    },
    refresh : function(){
        var content = E(this.contentId);
        var selectedDate = this.selectedDate|| new Date();
        var actionMap = this.actionMap;
        actionMap.selectedDate = createDateItem(selectedDate);
        actionMap.dateList = createDateList(selectedDate);
        content.innerHTML = contentTemplate.render(actionMap);
        //alert(content.innerHTML)
    }
};
function buildInputChangeListener(picker){
     return function(){
          var input = E(picker.id);
          try{
               picker.selectedDate = picker.format.parse(input.value);
               picker.refresh();
          }catch(e){
          	  $log.error(e);
          	  throw e;
          }
     }
}
function buildRepaintListener(picker){
     return function(event,year,month,date){
          try{
              picker.selectedDate = new Date(year,month-1,date);
              picker.refresh();
          }catch(e){}
     }
}
function buildPickListener(picker){
    return function(event,year,month,date){
        var input = E(picker.id);
        if(year+month+date>0){
            try{
                picker.selectedDate = new Date(year,month-1,date);
                input.value = picker.format.format(picker.selectedDate);
                if(picker.type == 'inline'){
                    picker.refresh();
                }
            }catch(e){
            	return
            }
        }else{
            picker.selectedDate = null;
            input.value = '';
        }
        if(picker.clickHidden){
             picker.clickHidden();
        }
    }
}
/**
 * @internal
 */
function buildPopupListener(picker){
    function clickHidden(){
        //document.title = "ckick:"+(i++)
        getPopup(picker).style.display = 'none';
        E(document).detach('click',clickHidden);
        picker.clickHidden = null;
    }
    return function(event){
        //可能有泄漏
        getPopup(picker).style.display = 'block'
        if(picker.clickHidden == null){
            picker.clickHidden = clickHidden;
            E(document).attach('click',clickHidden);
        }
        picker.refresh();
	    stopPropagation(event);
    }
}
function getPopup(picker){
	return E(E(picker.contentId).parentNode.parentNode);
}

function createDateList(date){
    var list = [];
    var begin = new Date( date.getFullYear(),date.getMonth(),date.getDate());
    var selectedTime = begin.getTime();
    var todayTime = new Date((date = new Date()).getFullYear(),date.getMonth(),date.getDate()).getTime();
    var selectedItem;
    var i = 1;
    begin.setDate(1);
    begin.setDate(1-begin.getDay());
    while(true){
    	var item = createDateItem(begin);
    	var date = begin.getDate();
        list.push(item);
        if(begin.getTime() == selectedTime){
            item.className = "selected-";
        }else if(begin.getTime() == todayTime){
            item.className = "today-";
        }else if(date>i || i>28 && date<15 ){
        	item.className = "disabled-";
        }
        begin.setDate(date+1);
        if(i == 42 
              //|| i==35 && begin.getDate()<10
              ){
            break;
        }
        i++
    }
    return list;
}

function createDateItem(date){
    date = {year:date.getFullYear(),month:date.getMonth()+1,date:date.getDate(),day:date.getDay()};
    date.key = [date.year,date.month,date.date].join('-');
    return date;
}

