/**
 * 包含装饰器，用于客户端包含文档或文档片段
 * @public
 * @decorator
 */
function Include(){
}

Include.prototype.prepare = function(){
    //alert(E(this.id).innerHTML)
}
Include.prototype.decorate = function(){
    var el = E(this.id);
    /**
     * 包含的目标url[必选属性]
     * @typeof string
     * @attribute
     * @id Include.this.url
     */
    var url = this.url || el.href;
    
    /**
     * xpath表达式[可选属性]
     * @typeof string
     * @attribute
     * @id Include.this.xpath
     */
    var xpath = this.xpath;
    
    /**
     * 转换样式单路径[可选属性]
     * @typeof string
     * @attribute
     * @id Include.this.xslt
     */
    var xslt = this.xslt;
    while(el.firstChild){
        el.removeChild(el.firstChild)
    }
    if(el.tagName=='A'){
        //el.style.display = "none";
        //el.removeAttribute('href');
        el.hide();
        el.parentNode.insertBefore(new Element("span"),el);
        el = el.previousSibling;
    }
    //setTimeout(function(){
    new Request(url,"post",function(){
        var source = this.getResult();
        if(xslt){
            if(XSLTProcessor){
                new Request(xslt,"post",function(){
                    //decorator.setContent(source,this.getResult());
                    setContent(el,source,xpath,this.getResult());
                    el = null;
                }).send();
            }else{
                $log.error("XSLTProcessor is not support")
            }
        }else{
            setContent(el,source,xpath);
            el = null;
        }
    }).send();
}
function setContent(el,source,xpath,xsltContent){
    if(xsltContent){
        var xsltProcessor = new XSLTProcessor();//必须要importStylesheet 才能工作？如何让他们可以原封不懂的输出呢？
        xsltContent = toDocument(xsltContent);
        xsltProcessor.importStylesheet(xsltContent);
    }
    if(xpath){
        if(XPathEvaluator){
            source = XPathEvaluator.selectNodes(toDocument(source).documentElement,xpath);
            if(source.length>0){
                for(var i =0;i<source.length;i++){
                    if(xsltProcessor){
                        appendDom(el,source.item(i),xsltProcessor);
                    }else{
                        el.innerHTML += toText(source.item(i));
                    }
                }
            }
        }else{
            $log.error("XPath is not support")
        }
    }else{
        if(xsltProcessor){
            appendDom(el,toDocument(source),xsltProcessor);
        }else{
            el.innerHTML = toText(source);//toText(source)+'';
        }
    }

};
function appendDom(el,sourceDom,xsltProcessor){
    if(sourceDom){
        var fragment = xsltProcessor.transformToFragment(sourceDom,document) ;
        el.appendChild(fragment);
    }
}


function toText(source){
    if(typeof source == 'string'){
        return source;
    }else if(source){
        var serializer = new XMLSerializer();
        return serializer.serializeToString(source) ;
    }
}
function toDocument(source){
    if(typeof source == 'string'){
        return new DOMParser().parseFromString(source,"text/xml") ;
    }else{
        return source;
    }
}