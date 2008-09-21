/**
 * 包含装饰器，用于客户端包含文档或文档片段
 * @public
 * @decorator
 */
function Include(){
	
}

Include.prototype.prepare = function(){
	this.url = this.url || el.href;
	//this.xslt = this.xslt;
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
    var url = this.url;
    
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
        source = selectNodes(toDocument(source).documentElement,xpath);
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

function selectNodes(contextNode,xpath){
    try{
        if(document.all){//IE or Opera
            return contextNode.selectNodes(xpath);
        }
    }catch(e){
    }
    if(this.XPathEvaluator){
        var nodeList = [];
        var evaluator = new XPathEvaluator();
        var result = evaluator.evaluate(xpath,contextNode,null,5,null);
        var item;
        while(item = result.iterateNext()){
            nodeList.push(item);
        }
        nodeList.item = function(index){
            return this[index];
        }
        return nodeList;
    }
    return [];
    
}
function toText(source){
    if(typeof source == 'string'){
        return source;
    }else if(source){
        if(this.XMLSerializer){
            var serializer = new XMLSerializer();
            return serializer.serializeToString(source) ;
        }else{
            return source.xml;
        }
    }
}
function toDocument(source){
    if(typeof source == 'string'){
        if(this.DOMParser){
            return new DOMParser().parseFromString(source,"text/xml") ;
        }else{
            var doc = createActiveXObject(domProgid);
            doc.loadXML(source);
            return doc;
        }
    }else{
        return source;
    }
}
var XSLTProcessor = window.XSLTProcessor;
var xsltemplateProgid = [ "MSXML2.XSLTemplate.3.0","Msxml2.XSLTemplate.6.0"];
var freeThreadedDOMDocumentProgid = ["MSXML2.FreeThreadedDOMDocument.3.0","MSXML2.FreeThreadedDOMDocument.6.0"];
var domProgid = [ "Microsoft.XMLDOM", "MSXML.DOMDocument", "MSXML2.DOMDocument", "Msxml2.DOMDocument.3.0","Msxml2.DOMDocument.6.0"];
function createActiveXObject(progids){
    if(progids instanceof Array){
        var i = progids.length;
        while(i--){
            try{
                var result = new ActiveXObject(progids[i]);
                progids = progids[i];
                return result;
            }catch(e){
            }
        }
    }else{
        return new ActiveXObject(progids);
    }
}
if(!window.XSLTProcessor){
    XSLTProcessor = function(){
        this.template = createActiveXObject(xsltemplateProgid);
    }
    XSLTProcessor.prototype = {
        importStylesheet : function(xslDoc){
                var converted = createActiveXObject(freeThreadedDOMDocumentProgid);
                xslDoc.setProperty("SelectionLanguage", "XPath");
                xslDoc.setProperty("SelectionNamespaces", "xmlns:xsl='http://www.w3.org/1999/XSL/Transform'");
                // make included/imported stylesheets work if exist and xsl was originally loaded from url
                if(xslDoc.url && xslDoc.selectSingleNode("//xsl:*[local-namespaceURI() = 'import' or local-name() = 'include']") != null){
                        converted.async = false;
                        if (freeThreadedDOMDocumentProgid == "MSXML2.FreeThreadedDOMDocument.6.0") { 
                                converted.setProperty("AllowDocumentFunction", true); 
                                converted.resolveExternals = true; 
                        }
                        converted.load(xslDoc.url);
                } else {
                        converted.loadXML(xslDoc.xml);
                }
                converted.setProperty("SelectionNamespaces", "xmlns:xsl='http://www.w3.org/1999/XSL/Transform'");
                var output = converted.selectSingleNode("//xsl:output");
                this.outputMethod = output ? output.getAttribute("method") : "html";
                this.template.stylesheet = converted;
                this.processor = this.template.createProcessor();
                // for getParameter and clearParameters
                this.paramsSet = new Array();
        },
        /**
          * 使用由importStylesheet()引入的样式表对结点source进行转换，owner 是转换结果的 DOMDocument. 
          * Transform the given XML DOM and return the transformation result as a new DOM fragment.
          * <b>Note</b>: The xsl:output method must match the nature of the owner document (XML/HTML).
          * @argument sourceDoc The XML DOMDocument to transform
          * @argument ownerDoc The owner of the result fragment
          * @return The transformation result as a DOM Document
          */
        transformToFragment : function (sourceDoc, ownerDoc) {
            this.processor.input = sourceDoc;
            this.processor.transform();
            var s = this.processor.output;
            var f = ownerDoc.createDocumentFragment();
            if (this.outputMethod == 'text') {
                f.appendChild(ownerDoc.createTextNode(s));
            } else if (ownerDoc.body && ownerDoc.body.innerHTML) {
                var container = ownerDoc.createElement('div');
                container.innerHTML = s;
                while (container.hasChildNodes()) {
                    f.appendChild(container.firstChild);
                }
            }
            else {
                var oDoc = new ActiveXObject(domProgid);
                if (s.substring(0, 5) == '<?xml') {
                    s = s.substring(s.indexOf('?>') + 2);
                }
                var xml = ''.concat('<my>', s, '</my>');
                oDoc.loadXML(xml);
                var container = oDoc.documentElement;
                while (container.hasChildNodes()) {
                    f.appendChild(container.firstChild);
                }
            }
            return f;
        }
    };
}