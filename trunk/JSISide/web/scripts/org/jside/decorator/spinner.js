var spinnerTemplate = new Template(this.scriptBase + "html/form.xhtml#//*[@id='spinner']/*");
var sliderTemplate = new Template(this.scriptBase + "html/form.xhtml#//*[@id='slider']/*");

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
        event.stopPropagation() 
        return false;
    }
}



function Slider(){
}

Slider.prototype.prepare = function(){
	this.length = parseInt(this.length) || 50;
    this.start = parseInt(this.start) || 0;
    this.end = parseInt(this.end) || 100;
    this.step = parseInt(this.step) || 1;
    this.value = parseInt(this.value || E(this.id).value) || 0;
    this.orientation = /^v/.test(this.orientation)?"vertical":"horizontal";
}

Slider.prototype.decorate = function(){
    var el = E(this.id);
    var sliderElement = new Element("div");
    applyTemplate(el,sliderTemplate.render({
    	orientation:this.orientation,
    	action:createActionMap({
	    	active:buildSliderActiveListener(this)
    	})
    }),el,sliderElement);
    var dragable = new Draggable(sliderElement,sliderElement.parentNode);
    dragable
}
function buildSliderActiveListener(slider){
	return function(){
	}
}