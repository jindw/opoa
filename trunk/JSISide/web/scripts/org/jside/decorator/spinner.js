var spinnerTemplate = new Template(this.scriptBase + "html/form.xhtml#//*[@id='spinner']/*");
/**
 * @public
 * @decorator spinner
 * @attribute start
 * @attribute end 
 * @attribute step
 */
function Spinner(engine){
	this.engine = engine;
}

Spinner.prototype.prepare = function(){
    this.start = parseInt(this.start)
    this.end = parseInt(this.end);
    this.step = parseInt(this.step)||1;
}

Spinner.prototype.decorate = function(){
    var el = E(this.id);
    applyTemplate(el,spinnerTemplate.render({
    	action:this.engine.action({
	    	up:buildMouseHandle(this,1),
	    	down:buildMouseHandle(this,-1)
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
function buildMouseHandle(spinner,offset){
    return function(event){
        offset && spinner.jump(offset);
        event.stopPropagation() 
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