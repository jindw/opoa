/*
 * License 未定
 * @author 金大为
 * @version $Id: event-util.js,v 1.5 2008/02/25 01:55:59 jindw Exp $
 */

/**
 * 拖动支持类。
 * 执行构造函数时，即初始化拖动支持。
 * @public
 * @constructor
 * @param handle 移动句柄元素
 * @param target 移动目标元素
 * @param onStart 开始拖动事件
 * @param onStep 拖动响应事件
 * @param onFinish 释放响应事件
 * @author 金大为
 */
function Draggable(onStart,onStep,onFinish){
    
    /**
     * 拖动目标元素的id（没有就创建一个）
     * @id Draggable.this.id
     * @public
     * @typeof string
     */
    /**
     * 拖放目标集合
     * @public
     * @type Array
     */
    this.targetList = [];
    
    
    /**
     * 开始拖动事件
     * @public
     * @typeof function
     * @param event 触发事件(onkeypress)
     * @return <boolean> 是抵制拖放[true 禁止,其余允许]
     */
    this.onStart = onStart;
    /**
     * 拖动响应事件
     * @public
     * @typeof function
     * @param pageX x点坐标
     * @param pageY y点坐标
     * @param left 绝对定位的左边位移
     * @param top 绝对定位的上部位移
     * @return <boolean> 是否禁止默认的移动操作[true 禁止,其余允许]
     */
    this.onStep = onStep;
    /**
     * 拖放结速,释放响应事件
     * @public
     * @typeof function
     * @param pageX x点坐标
     * @param pageY y点坐标
     * @param left 绝对定位的左边位移
     * @param top 绝对定位的上部位移
     * @return <boolean> 是否保存移动[true 禁止,其余允许]
     */
    this.onFinish = onFinish;
    
    var draggable = this;
    this.doStart = function(event) {
        event = event|| this.event;
        if(!draggable.onStart || !draggable.onStart(event)){
            beginDrag(draggable,event);
        }
    }
}
/**
 * 
 * @param handle 移动句柄元素
 * @param target 移动目标元素
 */
Draggable.prototype.connect = function(handle,moveBox){
    if(this.handleId){
        this.disconnect();
    }
    this.targetId = E(moveBox || handle).uid();
    this.handleId = E(handle).uid();
    handle.attach('mousedown',this.doStart);
    handle = moveBox = null;
    return this
}
Draggable.prototype.disconnect = function(){
    var handle = E(this.handleId);
    if(handle){
        handle.detach("mousedown",this.doStart)
    }
}




/**
 * 初始化拖动
 * @internal
 */
function beginDrag(draggable,event){
    var moveBox = E(draggable.targetId);
    var moveBoxStyle = moveBox.style;
    var selectSetting = disableSelect();
    var moveBoxOriginalStyle = {
        position:moveBoxStyle.position,
        left:moveBoxStyle.left,
        top:moveBoxStyle.top
    };
    //var offsetParent = moveBox.offsetParent || document.body;//body 有无必要呢？
    
    //margin 问题
    //hack for offset as x
    var position = moveBox.getPosition();
    var offsetX = position.left;//+moveBox.marginTop;//moveBox.offsetLeft -document.body.offsetLeft;
    var offsetY = position.top;//+moveBox.marginLeft;//moveBox.offsetTop -document.body.offsetTop;
    var movePosition =  markPosition(event);//set null later
    //var regionMap = {};
    var currentTarget;
    var moveInterval = setInterval(function(){
        if(movePosition){
            //var xx = offset + offsetLeft+document.body.offsetLeft
            var pageX = movePosition.pageX;
            var pageY = movePosition.pageY;
            
            var left = pageX - offsetX;
            var top = pageY - offsetY
            //$log.debug(movePosition.clientX,movePosition.clientY)
            var targetList = draggable.targetList;
            var i = targetList.length;
            if(!draggable.onStep || draggable.onStep(pageX,pageY,left,top)!=false){
                //$log.trace ([x,y,movePosition.clientX,movePosition.clientY])
                setAbsolute(left,top);
            }
            //alert(i)
            while(i--){
                try{
                    var target = targetList[i];
                    var targetId = target.id;
                    var el = E(targetId);
                    var region = el.getRegion();//regionMap[targetId] || (regionMap[targetId] = el.getRegion());
                    var inRegion = containsPoint(region,pageX,pageY) && target.accept(draggable,pageX,pageY);
                    if(inRegion){
                        if(currentTarget != target){
                            if(currentTarget){
                                target.onLeave(draggable,movePosition);
                            }
                            target.onEnter(draggable,movePosition);
                        }else{
                            //target.onStep(movePosition);
                        }
                        currentTarget = target;
                        break;
                    }else{
                        if(currentTarget == target){
                            target.onLeave(draggable,movePosition);
                            currentTarget = null;
                        }
                    }
                }catch(e){alert(e.message)}
            }
            movePosition = null;
        }
    },10);
    
    
    function setAbsolute(left,top){
         moveBoxStyle.position= "absolute";
         moveBoxStyle.left= left + "px";
         moveBoxStyle.top= top + "px";
    }
    function restoreMoveBoxStyle(){
        moveBoxStyle.position = moveBoxOriginalStyle.position;
        moveBoxStyle.left= moveBoxOriginalStyle.left;
        moveBoxStyle.top= moveBoxOriginalStyle.top;
    }
    //fix offset
    //moveBoxStyle.position= "absolute";
    setAbsolute(offsetX,offsetY);
    position = moveBox.getPosition();
    //$log.debug(moveBox.offsetLeft , offsetX,moveBox.offsetTop , offsetY)
    offsetX = movePosition.pageX +position.left-2*offsetX;
    offsetY = movePosition.pageY +position.top-2*offsetY;
    //hack for call: restore(); movePosition = null;
    movePosition = restoreMoveBoxStyle();
    
    function onmousemove(event){
        movePosition = markPosition(event || window.event);
        //$log.trace(movePosition.clientX,movePosition.clientY)
    }
    function onmouseup(event){
        try{
            clearInterval(moveInterval);
            //alert([document.body.scrollTop,document.documentElement.scrollTop])
            event = event || window.event;
            var upPosition = markPosition(event || window.event);
            document.detach("mousemove",onmousemove);
            document.detach("mouseup",onmouseup);
            var pageX = upPosition.pageX;
            var pageY = upPosition.pageY;
            restoreSelect(selectSetting);
            if(!(draggable.onFinish && draggable.onFinish(pageX,pageY,pageX-offsetX,pageY-offsetY))){
                restoreMoveBoxStyle();
            }
        }catch(e){
        	$log.info(e)
        }finally{
            moveBox = moveBoxStyle = null;
            if(currentTarget){
                currentTarget.onDrop(draggable,movePosition);
                movePosition = null;
            }
        }
    }
    
    E(document).attach("mousemove",onmousemove);
    document.attach("mouseup",onmouseup);
}
function markPosition(event){
    var scrollLeft = document.documentElement.scrollLeft;//standard
    var scrollTop = document.documentElement.scrollTop;//standard
    //var offsetX = Math.max(document.documentElement.scrollLeft,document.body.scrollLeft);//quirks
    //var offsetY = Math.max(document.documentElement.scrollTop,document.body.scrollTop);//quirks
    //$log.trace(event.clientY + scrollTop,event.pageY);
    return {
            clientX : event.clientX,
            clientY :  event.clientY,
            pageX : event.pageX == null?event.clientX + scrollLeft:event.pageX,
            pageY : event.pageY == null?event.clientY + scrollTop:event.pageY
        }
}
function disableSelect(){
	var bs = document.body.style;
	if(bs.MozUserSelect!=undefined){
		var cache = bs.MozUserSelect;
		bs.MozUserSelect = 'none';
	}else if(bs.KhtmlUserSelect!=undefined){
		var cache =bs.KhtmlUserSelect;
		bs.KhtmlUserSelect = 'none';
	}else{
		var cache = document.body.onselectstart;
		document.body.onselectstart='return false'
	}
	return cache;
}
function restoreSelect(cache){
    setTimeout(function(){//lazy for mouseup
        var bs = document.body.style;
        if(bs.MozUserSelect!=undefined){
            bs.MozUserSelect = cache;
        }else if(bs.KhtmlUserSelect!=undefined){
            bs.KhtmlUserSelect = cache;
        }else{
            document.body.onselectstart=cache;
        }
    },100)
	
}
//释放


function Droppable(container,onEnter,onDrop,onLeave){
    this.id = E(container).uid();
    //this.entered = false;
    /**
     * 开始进入目标区域
     * @public
     * @typeof function
     * @param event 触发事件(onkeypress)
     * @return <boolean> 是抵制拖放[true 禁止,其余允许]
     */
    this.onEnter = onEnter;
    /**
     * 在拖放区域，拖放释放鼠标的事件
     * @public
     * @typeof function
     * @param event 触发事件(onmousemove)
     * @return <boolean> 是否禁止默认的移动操作[true 禁止,其余允许]
     */
    this.onDrop = onDrop;
    /**
     * 离开区域，结束拖放
     * @public
     * @typeof function
     * @param event 触发事件(onkeyup)
     * @param x x点坐标
     * @param y y点坐标
     * @return <boolean> 是否保存移动[true 禁止,其余允许]
     */
    this.onLeave = onLeave;
}
Droppable.prototype = {
    accept:function(draggable,pageX,pageY){
        return true;
    }
}

function containsPoint(region,pageX,pageY){
    return pageX>=region.left && pageX<=region.right && pageY>=region.top && pageY<=region.bottom;
}


