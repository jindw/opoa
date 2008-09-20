/**
 * 可拖放元素
 * @public
 * @decorator
 */
function DragSource(){
}
var groupMap = {};
function requireGroup(group){
    group = group || '';
    return groupMap[group] || (groupMap[group] = []);
}

DragSource.prototype.decorate = function(){
    var handleId = this.handle || this.id;
    var draggable = this.draggable = new Draggable(handleId,this.id);
    var decorator = draggable.decorator = this;
    E(handleId).addClass("jside-drag-handle");
    draggable.targetList = requireGroup(this.group)
    draggable.onStart = function(){
        if(decorator.onStart){
            return decorator.onStart.apply(this,arguments);
        }
    }
    draggable.onStep = function(){
        if(decorator.onStep){
            return decorator.onStep.apply(this,arguments);
        }
    }
    draggable.onFinish = function(){
        if(decorator.onFinish){
            return decorator.onFinish.apply(this,arguments);
        }
    }
}
function DragHandle(){
}
DragHandle.prototype.decorate = function(parent){
    parent.handle = this.id;
}


//onEnter,onDrop,onLeave
function DropTarget(){
}

DropTarget.prototype = {
    decorate: function(){
        var droppable = this.droppable = new Droppable(this.id);
        var decorator = this;
        requireGroup(this.group).push(droppable);
        //alert(this.group)
        droppable.onEnter = function(){
            E(decorator.id).addClass("jside-drag-over")
            //alert(E(decorator.id).className)
            arguments[0] = arguments[0].decorator;
            if(decorator.onEnter){
                return decorator.onEnter.apply(this,arguments);
            }
        }
        droppable.onDrop = function(){
            E(decorator.id).removeClass("jside-drop-over")
            arguments[0] = arguments[0].decorator;
            if(decorator.onDrop){
                return decorator.onDrop.apply(this,arguments);
            }
        };
        droppable.onLeave = function(){
            E(decorator.id).removeClass("jside-drop-over")
            arguments[0] = arguments[0].decorator;
            if(decorator.onLeave){
                return decorator.onLeave.apply(this,arguments);
            }
        }
    },
    onDrop : function(dragSource){
        E(this.id).appendChild(E(dragSource.id))
    }
}