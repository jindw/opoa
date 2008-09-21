var spinnerTemplate = new Template(this.scriptBase + "html/form.xhtml#//*[@id='spinner']/*");
var sliderTemplate = new Template(this.scriptBase + "html/form.xhtml#//*[@id='slider']/*");
var idseq = new Date()*1;
/**
 * @public
 * @decorator spinner
 * @attribute start
 * @attribute end 
 * @attribute step
 */
function Spinner(){
}

Spinner.prototype.prepare = function(){
    this.start = parseInt(this.start)
    this.end = parseInt(this.end);
    this.step = parseInt(this.step)||1;
}

Spinner.prototype.decorate = function(){
    var el = E(this.id);
    applyTemplate(el,spinnerTemplate.render({
    	action:createActionMap({
	    	up:buildSpinnerMouseHandle(this,1),
	    	down:buildSpinnerMouseHandle(this,-1)
    	})
    }),el);
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

/**
 * @internal
 */
function buildSpinnerMouseHandle(spinner,offset){
    return function(event){
        offset && spinner.jump(offset);
        stopPropagation(event);
        return false;
    }
}



function Slider(){
}

Slider.prototype.prepare = function(){
	this.length = parseInt(this.length) || 120;
    this.start = parseInt(this.start) || 0;
    this.end = parseInt(this.end) || 100;
    this.step = parseInt(this.step) || 1;
    this.value = parseInt(this.value || E(this.id).value) || 0;
    this.orientation = /^v/.test(this.orientation)?"vertical":"horizontal";
}

Slider.prototype.decorate = function(){
    var el = E(this.id);
    var handleId ="$slider_"+(idseq++);
    var modle = {
    	length:this.length,
    	orientation:this.orientation,
    	handleId :handleId,
    	action:createActionMap({
	    	active:buildSliderActiveListener(this)
    	})
    }
    applyTemplate(el,sliderTemplate.render(modle),el);
    var pos = this.value * this.length;
    var dragable = new Draggable(handleId,handleId);
    this.handleId = handleId;
    dragable.onStep = buildSliderStepListener(this,handleId);
    dragable.onStep(null,pos,pos);
    dragable.onFinish = buildSliderChangeListener(this);
}
Slider.prototype.setValue = function(value){
	E(this.id).value = value;
	E(this.handleId).title = value;
	value = (value-this.start)*this.length/(this.end -this.start)
	//E(this.handleId).style['left'] = value + 'px';
	E(this.handleId).style[this.orientation == "vertical"?'top':'left'] = value + 'px';
}
function buildSliderStepListener(slider,handle){
	return function(event,x,y){
	    try{
    		if("vertical" == slider.orientation){
    			x = y;
    		}
    		var pos = Math.floor(Math.max(Math.min(x,slider.length),0));
    		pos = pos*(slider.end -slider.start)/slider.length;
    		//step
    		pos = Math.floor(pos/slider.step)*slider.step;
    		slider.setValue(pos);
	    }catch(e){}
		return false;
    }
}
function buildSliderChangeListener(slider){
	return function(){
        return true;
	}
}
function buildSliderActiveListener(slider){
	return function(){
	}
}