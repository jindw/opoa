/**
 * @public
 * @decorator spinner
 * @attribute start
 * @attribute end 
 * @attribute step
 */
function Spinner(){
}

Spinner.prototype.prepare = function(engine){
    this.start = parseInt(this.start)
    this.end = parseInt(this.end);
    this.step = parseInt(this.step)||1;
}

Spinner.prototype.decorate = function(){
    var el = E(this.id);
    var table = new Element('table');
    var outerDiv = new Element("div");
    var upDiv = new Element("div");
    var downDiv = new Element("div");
    table.className = INLINE_CLASS_LAYOUT_ +' ' +INLINE_CLASS_SPINNER;
    el.parentNode.insertBefore(table,el);
    var row = table.insertRow(0);
    var cell = row.insertCell(0);
    cell.appendChild(el); 
    cell = row.insertCell(1);
    cell.appendChild(outerDiv);
    cell.style.width = 0;
    cell.style.overflow = 'hidden'
    outerDiv.appendChild(upDiv);
    initializeHandleDiv(this,upDiv);
    upDiv.onclick = buildMouseHandle(this,1);
    upDiv.appendChild(downDiv);
    initializeHandleDiv(this,downDiv);
    downDiv.onclick = buildMouseHandle(this,-1);
}
Spinner.prototype.jump = function(offset){
    var input = E(this.id);
    var value = input.value * 1 + offset*this.step;
    if(value>this.end){
        value=this.end;
    }else if(value<this.start){
        value = this.start;
    }
    input.value = value;
}
//TODO:去掉数字，使用class，增强定制性
/**
 * @internal
 */
function initializeHandleDiv(spinner,handleDiv){
    handleDiv.onmouseout = function(){
        this.className = '';
    }
    handleDiv.onmouseup=handleDiv.onmouseover = function(){
         this.className = INLINE_CLASS_SPINNER_OVER;
    }
    handleDiv.onmousedown = function(){
         this.className = INLINE_CLASS_SPINNER_DOWN;
    }
    handleDiv = null;
}
/**
 * @internal
 */
function buildMouseHandle(spinner,offset){
    return function(event){
        //document.getElementsByTagName('h2')[0].innerHTML = imagePosition;
        offset && spinner.jump(offset);
        event.stopPropagation() 
        //this.cancelBubble = true;
        //event.preventDefault() 
        //this.returnValue = false;
        return false;
    }
}



function Slider(){
}

Slider.prototype.prepare = function(engine){
    this.start = parseInt(this.start) || 0
    this.end = parseInt(this.end) || 100;
    this.step = parseInt(this.step) || 1;
    this.value = parseInt(this.value || E(this.id).value) || 0;
}

Slider.prototype.decorate = function(){
    var el = E(this.id);

}
Slider.prototype.jump = function(offset){
}