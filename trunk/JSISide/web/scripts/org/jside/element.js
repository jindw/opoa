/*
 * License 未定
 * @author 董睿
 * @author 金大为
 * @version $Id: event-util.js,v 1.5 2008/02/25 01:55:59 jindw Exp $
 */

/**
 * 获取指定id 的 HTML元素.
 * 同时还将包装Html元素，给其添加Element prototype 中的全部方法属性。
 * @param <HTMLElement||String>el 
 * @author 董睿
 * @author 金大为
 */
function E(el) {
    if (el.constructor == String) {
        el = document.getElementById(el);
    }
    if(el){
        var p = elementPrototype;
        if (el.wrapVersion==p.wrapVersion){
            return el;
        }
        for(var n in p){
            el[n] = p[n];
        }
    }
    return el;
}



/**
 * HTML 元素扩展
 * @param <HTMLElement|string>el
 * @author 董睿
 * @author 金大为
 */
var Element = function (el) {
    if (el.constructor == String) {
        el = document.createElement(el);
    }
    return E(el);
};
var idSequence = 0;

/**
 * 这是一个自动生成的方法，请查看源静态方法（将this作为原方法的第一个参数）： Element&#46;$1()
 * @id Element.prototype.*
 */

/**
 * @id Element
 */
var elementProperties = {
    /**
     * 返回该元素的唯一id
     * @public
     * @owner Element
     * @param <HTMLElement>el HTML元素对象（对于包装元素,自动生成的同名成员方法中，默认传入this无须显示指定）
     * @public
     */
    uid:function(el){
        var id = el.id || (el.id = el.uniqueID);
        if(!id){
            el.id = id = "__$puid"+idSequence++;
        }
        return id;
    },
    /**
     * 绑定事件(这里不处理IE的this问题)
     * @public
     * @owner Element
     * @param <HTMLElement>el HTML元素对象（对于包装元素,自动生成的同名成员方法中，默认传入this无须显示指定）
     * @param type 事件类型(无on,小写)
     * @param fn 事件函数
     * @return <HTMLElement> 返回元素本身,以便再次操作
     */
    attach:function(el,type,fn){
        if(el.attachEvent){
            el.attachEvent('on'+type,fn);
        }else{
            el.addEventListener(type,fn,false);
        }
        return el;
    },
    /**
     * 取消绑定事件
     * @public
     * @owner Element
     * @param <HTMLElement>el HTML元素对象（对于包装元素,自动生成的同名成员方法中，默认传入this无须显示指定）
     * @param type 事件类型(无on,小写)
     * @param fn 事件函数
     * @return <HTMLElement> 返回元素本身,以便再次操作
     */
    detach:function(el,type,fn){
        if(el.detachEvent){
            el.detachEvent('on'+type,fn);
        }else{
            el.removeEventListener(type,fn,false);
        }
        return el;
    },
    /**
     * 显示元素
     * @public
     * @owner Element
     * @param <HTMLElement>el HTML元素对象（对于包装元素,自动生成的同名成员方法中，默认传入this无须显示指定）
     * @param display 新的显示样式:block|inline....,默认为""(有些情况下,style.display=''还不能显示元素,原因待查)
     * @return <HTMLElement> 返回元素本身,以便再次操作
     */
    show: function (el,display) {
        el.style.display = display || "";
        return el;
    },
    /**
     * 隐藏元素
     * @public
     * @owner Element
     * @return <HTMLElement> 返回元素本身,以便再次操作
     */
    hide: function (el) {
        el.style.display = "none";
        return el;
    },
    
    /**
     * 删除元素
     * @public
     * @owner Element
     */
    remove:function(el){
    	el.parentNode.removeChild(el);
    },
    /**
     * 设置样式，可以批量设置或单个设置
     * @public
     * @owner Element
     * @param <string>style 设置样式名或者样式文本甚至样式单对象集合
     * @param <string>value 样式值
     * @return <HTMLElement> 返回元素本身,以便再次操作
     */
    setStyle: function (el,style,value) {
        if(arguments.length ==2){
            if(style.constructor == String){
                el.style.cssText = style;//ie6 尚需此hack'，ie7未知
                el.setAttribute('style',style);
            }else{
                for(var value in style){
                    el.style[value] = style[value];
                }
            }
        }else{
            el.style[style] = value;
        }
        return el;
    },
    /**
     * 给指定元素删除class
     * @public
     * @owner Element
     * @param <HTMLElement>el HTML元素对象（对于包装元素,自动生成的同名成员方法中，默认传入this无须显示指定）
     * @param <string>addClass 需要添加的class名称
     * @return <HTMLElement> 返回元素本身,以便再次操作
     */
    addClass : function(el,addClass){
        return this.replaceClass(el,addClass,addClass);
    },
    /**
     * 给指定元素增加class
     * @public
     * @owner Element
     * @param <HTMLElement>el HTML元素对象（对于包装元素,自动生成的同名成员方法中，默认传入this无须显示指定）
     * @param <string>removeClass 需要删除的class名称
     * @return <HTMLElement> 返回元素本身,以便再次操作
     */
    removeClass : function(el,removeClass){
        return this.replaceClass(el,removeClass,null);
    },
    /**
     * 给指定元素增加或删除class
     * @public
     * @owner Element
     * @param <HTMLElement>el HTML元素对象（对于包装元素,自动生成的同名成员方法中，默认传入this无须显示指定）
     * @param <string>removeClass 需要删除的class名称
     * @param <string>addClass 需要添加的class名称
     * @return <HTMLElement> 返回元素本身,以便再次操作
     */
    replaceClass : function(el,removeClass,addClass){
        var oldNames = el.className;
        if(oldNames){
            oldNames = oldNames.split(/\s+/);
            var i = oldNames.length;
            while(i--){
            	var item = oldNames[i];
                if(item == removeClass || item == addClass){
                    oldNames.splice(i,1)
                }
            }
            addClass && oldNames.push(addClass);
            el.className = oldNames.join(' ');
        }else{
        	el.className = addClass || el.className;
        }
        return el;
    },
    /**
     * 切换class，
     * 如果存在class1，将其替换为class2，否则将class2替换为class1
     * @public
     * @owner Element
     */
    switchClass:function(el,class1,class2){
        var oldNames = el.className;
        if(oldNames){
            oldNames = oldNames.split(/\s+/);
            var i = oldNames.length;
            var need = true;
            while(i--){
            	var item = oldNames[i];
                if(item == class1 ){
                    oldNames.splice(i,1)
                    if(need){
                    	oldNames.push(class2);
                    	need = false;
                    }
                }else if(item == class2){
                    oldNames.splice(i,1)
                    if(need){
                    	oldNames.push(class1);
                    	need = false;
                    }
                }
            }
            if(need){
            	oldNames.push(class1);
            }
            el.className = oldNames.join(' ');
        }else{
        	el.className = class1;
        }
		return el;
    },
    /**
     * 设置透明度
     * @public
     * @owner Element
     * @param <HTMLElement>el HTML元素对象（对于包装元素,自动生成的同名成员方法中，默认传入this无须显示指定）
     * @param <float>opacity 透明度[0-1]
     * @return <HTMLElement> 返回元素本身,以便再次操作
     */
    setOpacity: function (el,opacity) {
        //el.style.visibility = opacity < 0.001 ?"hidden":"visible";
        if (!el.currentStyle || !el.currentStyle.hasLayout){
            el.style.zoom = 1;
        }
        if (window.ActiveXObject){
            el.style.filter = (opacity == 1) ? '' : "alpha(opacity=" + opacity * 100 + ")";
        }
        el.style.opacity = opacity;
        return el;
    },
    /**
     * 获取运行时样式（从非内联样式中获取的）
     * @public
     * @owner Element
     * @param <HTMLElement>el HTML元素对象（对于包装元素,自动生成的同名成员方法中，默认传入this无须显示指定）
     * @return  返回样式单信息
     */
    getRuntimeStyle : function(el) {
        return el.runtimeStyle || document.defaultView.getComputedStyle(el, null);
    },
    /**
     * 获得元素的绝对位置
     * @public
     * @owner Element
     * @param <HTMLElement>el HTML元素对象（对于包装元素,自动生成的同名成员方法中，默认传入this无须显示指定）
     * @return <Array> 返回位置信息[left,top]
     */
    getPosition : function(el) {
        var left = 0, top = 0;
        do {
            left += el.offsetLeft || 0;
            top += el.offsetTop || 0;
            var runtimeStyle = this.getRuntimeStyle(el);
            left -= toPix(runtimeStyle.marginLeft);
            top -= toPix(runtimeStyle.marginTop);
        } while (el = el.offsetParent);
        return  {left:Math.floor(left),top:Math.floor(top)};
    },
    getRegion : function(el){
        if(el.getBoundingClientRect){
            var rect = el.getBoundingClientRect();
            var left = scrollElement.scrollLeft;
            var top = scrollElement.scrollTop;
            var position = {
                left:rect.left +left,
                right : rect.right +left,
                top : rect.top +top,
                bottom : rect.bottom +top
            };
        }else{
            var position = this.getPosition(el);
            var runtimeStyle = this.getRuntimeStyle(el);
            //hack y = x+=t ==> x+=t;y=x;
            var base = position.top += toPix(runtimeStyle.marginTop) ;
            position.bottom = base + el.offsetHeight;
            
            base = position.left += toPix(runtimeStyle.marginLeft);
            position.right =base + el.offsetWidth;
        }
        return position;
    }
};
var scrollElement = document.documentElement;
var elementPrototype = Element.prototype = {
    /**
     * 包装器版本信息
     * @private
     */
    wrapVersion :0
}
var lengMap = {}
function initializeProperty(n,staticMethod){
    Element[n] = staticMethod;
    elementPrototype[n] = function(){
        var args = [this];
        args.push.apply(args,arguments);
        return staticMethod.apply(Element,args);
    }
}

/**
 * 获取运行时样式（从非内联样式中获取的）
 * @internal
 * @param <HTMLElement>el HTML元素对象（对于包装元素,自动生成的同名成员方法中，默认传入this无须显示指定）
 * @return  返回样式单信息
 */
function toPix(el, text){
    if(text && text.charAt(0) != '0'){
        var value = text.replace(/(\d*).*/,'$1');
        var unit = text.substr(value.length).toLowerCase();
        switch(unit){
            case '%':
                value = el.offsetParent.clientWidth * 100 / value;
                break;
            case 'px':
                value = value*1;
                break;
            default:
                return value * getLengthRate(unit);
        }
        return parseInt(value,10) || 0;
    }
    return 0;
}

/**
 * 获取运行时其他长度单位与象素大小的比例
 * @internal
 */
function getLengthRate(unit){
    var rate = lengMap[unit];
    if(!rate){
        var div = new Element("div")
        document.body.appendChild(div);
        div.style.width = 128+unit;
        rate = lengMap[unit] = div.clientWidth/128;
        document.body.removeChild(div);
    }
    return rate;
}
/**
 * @public
 * 扩展Element元素，同时版本号加1
 */
Element.extend = function(elementProperties){
    for(var n in elementProperties){
        initializeProperty(n,elementProperties[n]);
    }
    elementPrototype.wrapVersion++;
}
Element.extend(elementProperties);