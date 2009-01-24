/**
 * @public
 */
function Test(){
}

Test.prototype = new Decorator();
Test.prototype.before = function(){
    try{
        var e = this.getContainer();
        //alert(this.id)
        e.appendChild(document.createTextNode("before:"+this.id));
        e.insertBefore(document.createTextNode("before:"+this.id),e.firstChild);
        //e.innerHTML = "";//"before:"+this.id
    }catch(ex){
        alert(ex.message);
    }
}
Test.prototype.decorate = function(){
    var e = this.getContainer();
    try{
        e.appendChild(document.createTextNode("after:"+this.id));
    }catch(ex){
        alert(ex)
    }
}
