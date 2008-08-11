
(function(){
    if(":debug"){
        var scripts = document.getElementsByTagName("script");
        scripts = scripts[scripts.length-1].getAttribute('src');
    }else{
        $import("org.jside.DecoratorEngine",true);
    }
    var el = document.documentElement;//html
    var value = el.getAttribute("xmlns:d");
    if(value || (value = document.namespaces) && value["d"]){
        function ready(){
            if(ready){
            	ready = 0;
	            var value = el.getAttribute("d:default-package");
	            value = value && value.split(/[\s*,\s*]/);
	            if(":debug"){
	                $import("org.jside.DecoratorEngine",function(){
	                    DecoratorEngine.initialize(value,el.getAttribute("d:skin"));
	                    DecoratorEngine.run();
	                });
	            }else{
	                DecoratorEngine.initialize(value,el.getAttribute("d:skin"));
	                DecoratorEngine.run();
	            }
            }
        }
        
        
        //domready
        if(document.addEventListener){//这个判断极其危险,很多人有扩展ie兼容标准的习惯(改称ActiveXObject能稳妥些),其他地方不可效仿.JSI也只能在引导文件中如此
            //Mozilla or Opera : if(BrowserInfo.isGecko(20020826)|| BrowserInfo.isOpera(9)){//Mozilla 1.0.1 支持 DOMContentLoaded
            document.addEventListener('DOMContentLoaded',ready,false);
            if(document.readyState){//mozilla 无此属性
                var interval = setInterval(function(){//safari
                    if (/complete|loaded/.test(document.readyState)) {
                        clearInterval(interval);
                        ready();
                    }
                },10);
            }
            addEventListener("load",ready,false);
        }else{//for IE
            /*
            // Use the defer script hack
            var script2id = "__$JSIDE_IE_DOMReady_"+new Date().getTime()
            document.write("<script id="+script2id+" defer=true src=//:><\/script>");
            script2id = document.getElementById(script2id);
            if(script2id){
                script2id.onreadystatechange = function() {
                    if(this.readyState == "complete"){
                        this.parentNode.removeChild( this );
                        ready();
                    }
                };
                script2id = null;
            }
            */
            var el = document.createElement('div');
            var interval = setInterval(function(){
                    for(var i=0;i<1000;i++)
                    try{
                        el.doScroll('left');
                        document.body.appendChild(el);//以下三行仿照mootools，但不知何意
                        el.innerHTML = "left";
                        el.parentNode.removeChild(el);
                        clearInterval(interval);
                        ready();
                        return;
                    }catch(e){
                        //$log.info(e)
                    }
                },10);
            window.attachEvent('onload',ready);
        }
        //domready
        
        if(":debug"){
            document.write("<script src='"+scripts.replace(/[^\\\/]+$/,'?path=boot.js')+"'></script>")
        }
    }
})();
