var eventList = [];
var registerName = "$"+(new Date()*1).toString(32);
/**
 * 调用全局事件
 */
window[registerName] = function(i,thiz){
    var event = eventList[i]
    Array.prototype.splice.call(arguments,0,2);
    return event.apply(thiz,arguments);
}

function createActionMap(fnMap){
	var actionMap = {};
    for(var n in fnMap){
        actionMap[n] = buildCall(fnMap[n]);
    }
    return actionMap;
}

/**
 * 添加一个全局事件
 * @internal
 * @param <Function> fn
 */
function sign(fn){
	var i = eventList.length;
	var pos = i;
	while(i--){
		if(eventList[i] == null){
			pos = i
		}else if(eventList[i] == fn){
			return i;
		}
	}
    eventList[pos] = fn;
    return pos;
}
/**
 * 创建用来生成调用命令函数
 * @internal
 * @param <Function> fn
 */
function buildCall(fn){
	fn = sign(fn);
    fn = [registerName+"("+fn+",this,event"];
    return function(){
        var result = fn.slice(0);
        for(var i = 0;i<arguments.length;i++){
            result.push(",");
            result.push(arguments[i]);
        }
        result.push(");");
        return result.join('') ;
    }
}
function applyTemplate(targetNode,html){
	if(":debug"){
		if(!html){
			$log.error("模板数据为空")
		}
	}
	var temp = new Element("b");
	insertBefore(temp,targetNode);
	temp.innerHTML = html;
	//replace objects
	var items = temp.getElementsByTagName("object");
	var index = items.length;
	//alert([temp.innerHTML,index,html])
	while(index--){
		var item = items[index];
		var newNode = arguments[index+2];
		newNode && insertBefore(newNode,item);
		removeNode(item);
	}
	if(item = temp.firstChild){
		insertBefore(item,temp);
	}
	removeNode(temp);
}
function stopPropagation(event) {
	if(event && event.stopPropagation){
		event.stopPropagation();
	}else{
        (event || window.event).cancelBubble = true;
	}
}
/**
 * @internal
 */
function insertBefore(newNode,existNode){
	existNode.parentNode.insertBefore(newNode,existNode);
}
/**
 * @internal
 */
function removeNode(item){
	item.parentNode.removeChild(item);
}


