/**
 * @public
 * @decorator tooltip
 * @attribute target 目标 默认为previousElement||parentNode
 */
function Tooltip(){
}

Tooltip.prototype.before = function(){
    var mouseout = buildMouseout(this);
    var container = this.getContainer();
    var target = getTarget(container);
    container.style.display = 'none';
    EventUtil.addMouseoverListener(target,buildMouseover(this));
    EventUtil.addMouseoutListener(target,mouseout);
    EventUtil.addClickListener(target,mouseout);
}
Tooltip.prototype.initialize = function(){
    this.initialize = null;
    var container = this.getContainer();
    var div = document.createElement('div');
    var attributes = this.attributes;
    var temp;
    container.insertBefore(div,container.firstChild);
    while(temp = div.nextSibling){
        container.removeChild(temp);
        div.appendChild(temp);
    }
    div.style.display='none';
    div.style.position='absolute';
    div.style.zIndex=100;
    //div.style.backgroundColor = '#FFFFE0';//"";//
    div.style.backgroundColor = 'infobackground';
    //div.style.border = '2px #FFFF00 groove'
    div.style.border = '2px threedlightshadow solid'
    div.style.borderBottom = '4px threedshadow solid'
    div.style.borderRight = '4px threedshadow solid'
    div.style.padding = '3pt';
    if(temp = attributes.get('width')){
        div.style.width = temp;
    }
    if(temp = attributes.get('height')){
        div.style.height = temp;
    }
    container.style.display = '';
}
Tooltip.prototype.decorate = function(){
}


function buildMouseover(tooltip){
    return function(event){
        if(tooltip.initialize){
            tooltip.initialize();
        }
        var container = tooltip.getContainer();
        container.firstChild.style.left=event.clientX + StyleUtil.getScrollLeft()+'px';
        container.firstChild.style.top=event.clientY +StyleUtil.getScrollTop()+'px';
        container.firstChild.style.display = 'block';
    }
}
function buildMouseout(tooltip){
    return function(event){
        var container = tooltip.getContainer();
        container.firstChild.style.display = 'none';
    }
}
function getTarget(container){
    var target = container.previousSibling;
    while(target){
        if(target.nodeType == 1){
                //alert(target.innerHTML)
            break;
        }
        target = target.previousSibling;
    }
    return target || container.parentNode;
}