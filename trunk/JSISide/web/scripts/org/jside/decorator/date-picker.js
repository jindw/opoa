var template = new Template(this.scriptBase + "html/date-picker.xhtml#//body");
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

DatePicker.prototype.before = function(){
    //type 约束处理
    if(":debug"){
        if(this.type && !/^(?:inline|popup)$/.test(this.type)){
            $log.error("DataPicker 的type属性只能是 inline 或者 popup");
        }
    }
    
    this.type = this.type && this.type.toLowerCase() =='inline'?'inline':'popup'
}

DatePicker.prototype.decorate = function(){
    var el = E(this.id);
    var table = new Element('table');
    var div = new Element("div");
    var iframe = new Element("iframe");
    table.className = "jside-layout- jside-date-picker";
    el.parentNode.insertBefore(table,el);
    var row = table.insertRow(0);
    var cell = row.insertCell(0); 
    var ele = table.nextSibling;
    el.parentNode.removeChild(el);
    cell.appendChild(ele);
    cell = row.insertCell(1);
    cell.appendChild(div);
    //div.style.display = 'none'
    if(this.type == 'popup'){
        div.style.position = 'relative'
        div.style.left = '0px'
        var image = new Element('img');
        image.className = INLINE_CLASS_LAYOUT_
        image.onclick = buildPopup(this);
        //image.style.margin="2px";
        div.appendChild(image);
        var div2 = new Element('div');
        div2.style.position = 'absolute'
        div2.style.top = '20px';
        div2.style.left = '0px';
        div2.style.zIndex = 2;
        div2.style.display = 'none';
        div.appendChild(div2);
        div2.appendChild(iframe);
    }else{
        div.appendChild(iframe);
        cell.previousSibling.style.display = 'none'; 
    }
    
    iframe.contentWindow.decorator = this;
    iframe.contentWindow.document.write(template);
    alert(template)
    //iframe.src =  scriptBase+ "styles/date-picker.html";
    //alert(iframe.contentWindow)
    iframe.contentWindow.decorator = this;
    //alert(iframe.contentWindow.decorator)
//    iframe.border = 0;
    iframe.frameBorder = 0;
//    iframe.scrolling="no";
//    iframe.width = "140px"
//    iframe.height = "180px"
}
DatePicker.prototype.getDate = function(){
    var value = E(this.id).value;
    if(value){
        //TODO:DateFormat
        value = value.split(/\/|-/);
        return new Date(value[0],value[1]-1,value[2]);
    }
}
DatePicker.prototype.setDate = function(date){
    var input = E(this.id);
    if(date){
        //TODO:DateFormat
        input.value = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
    }else{
        input.value = '';
    }
    if(this.type == 'popup'){
        if(this.clickHidden){
            this.clickHidden();
        }
    }
}

DatePicker.prototype.type = "popup";

/**
 * @internal
 */
function getIFrame (picker){
    return E(picker.id).parentNode.parentNode.getElementsByTagName("iframe")[0];
}
/**
 * @internal
 */
function buildPopup(picker){
    function clickHidden(){
        //document.title = "ckick:"+(i++)
        getIFrame(picker).parentNode.style.display = 'none';
        E(document).attach('click',clickHidden);
        picker.clickHidden = null;
    }
    return function(){
        //可能有泄漏
        setTimeout(function(){
            getIFrame(picker).parentNode.style.display = ''
            if(picker.clickHidden == null){
                picker.clickHidden = clickHidden;
                E(document).attach('click',clickHidden);
            }
        },100);
        return false;
    }
}
