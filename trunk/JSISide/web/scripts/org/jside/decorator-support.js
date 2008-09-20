var DecoratorEngine = {
	/**
	 * 默认包在html标签中可定义，但是不能再次修改
	 */
	initialize :function(packages,skin){
		var n = "org.jside.decorator";
		do{
	    	this.addDefaultPackage(n);
		}while(n = packages && packages.shift());
		skin && this.setDefaultSkin(skin);
	},
	addDefaultPackage:function(n){
		if(!defaultPackageMap[n]){
    		defaultPackageMap.push(n)
            defaultPackageMap[n] = $import(n + ':');
    	}
	},
	setDefaultSkin:function(skin){
		defaultSkin = '.'+skin.replace(/^[\/\.]|[\/\.]$/g,'')+':';
	},
    showStatus : function(text){
        window.status = text;
    },
    run : function(ele,parentDecorator){
        var result = [];
        if(":debug"){
            var begin = new Date();
        }
        buildTree(ele||document.body, new NodeInfo(),result);
        if(":debug"){
	        //alert("搜索时间："+(new Date() - begin));
	        setTimeout(function(){
	        	//alert(result.join("\n====================\n"))
	        },1000)
        }
        if(result.length){
            load(result);
        }
    }
}
/**
 * LinkedHashMap
 */
var defaultPackageMap = [];
var importedCSSMap = {};
var defaultSkin = ".styles:";
var nodeInfoMap = {};
var decoratorNamespace = 'http://www.xidea.org/taglib/decorator';
var decoratorAttributeNameRegExp = /^[dD]\:/;
var expressionRegExp=/^#\{([\s\S]+)\}$/;
var inc = 1;

function newDecoratorId(){
    return "$xidea_decorator$"+(inc++);
}

function load(result){
    var index = 0;
    //装载
    function load(decoratorClass){
        var nodeInfo = result[index++];
        if(decoratorClass){
            applyDecorator(nodeInfo,decoratorClass);
        }else {
            throw new Error("装载 "+nodeInfo+" 出错");
        }
        if(nodeInfo = result[index]){
            $import(initializeDecoratorPathAndCSS(nodeInfo),load);
        }else{
            //全部装载了
            DecoratorEngine.showStatus("装饰器执行完成....");
        }
    }
    //初始化
    DecoratorEngine.showStatus("准备装载资源....");
    //这里可以优化，没有必要等待全部资源装载完毕，可以装载与装饰并发执行
    $import(initializeDecoratorPathAndCSS(result[0]),load);
}

function initializeDecoratorPathAndCSS(nodeInfo){
    nodeInfoMap[nodeInfo.id] = nodeInfo;
    var path = nodeInfo.className;
    var className = path.replace(/^(\w)/,hiReplacer);
    var i = defaultPackageMap.length;
    while(i--){
        //hack for packageObject type
        var packageObject = defaultPackageMap[i];
        packageObject = defaultPackageMap[packageObject];
        if(packageObject.objectScriptMap[className]){
            i = 1;//hack for true
            break;
        }
    }
    if(!i){
        packageObject = path.replace(/\:.+|\.[^\.]+/,':');
        className = path.substr(packageObject.length);
        className = className.replace(/(^\w)/,hiReplacer);//not required
        packageObject = $import(packageObject);
    }
    importCSS($import(packageObject.name+defaultSkin),className)
    return (nodeInfo.packageName = packageObject.name) + ':'+(nodeInfo.className = className);
}
function importCSS(stylePackage,className){
    //hack className for css file name
    if(stylePackage && (className = stylePackage.objectScriptMap[className])){
        try{
        stylePackage.initialize && stylePackage.initialize();
        var cssBase = stylePackage.scriptBase;
        var dependenceList = stylePackage.dependenceMap[className];
        className = cssBase+ className;
        while(!importedCSSMap[className] && className){
            importedCSSMap[className] = 1;//hack for true;
            var link = document.createElement("link");
            //<link  type="text/css" href="css/global.css" rel="stylesheet" media="screen" />
            link.type = "text/css";
            link.href = className;
            link.rel = "stylesheet";
            var header = document.getElementsByTagName("head");
            (header && header[0] || document.documentElement).appendChild(link);
            //alert(header[0].innerHTML)
            className = dependenceList && dependenceList.length
                  && cssBase+ dependenceList.pop()[1];
        }
        }catch(e){
            $log.error(e);
        }
    }
}
/**
 * 初始化装饰器，包括生成唯一id，初始化属性值
 * 同时，执行decorator
 */
function applyDecorator(nodeInfo,decoratorClass){
    var htmlNode = nodeInfo.htmlNode;
    var decorator = nodeInfo.decorator = new decoratorClass(DecoratorEngine)
    var parentNode = nodeInfo.parentNode;
    var attributeMap = nodeInfo.attributeMap;
    for(var n in attributeMap){
        decorator[n] = attributeMap[n];
    }
    //nodeInfo.parentNode 一定存在
    parentNode.childDecorators.push(decorator);
    delete nodeInfo.htmlNode;//delete
    decorator.prepare && decorator.prepare(nodeInfo.parentNode.decorator);
    parentNode.task--;
    while(!nodeInfo.task && decorator){
        parentNode.task--;
        decorator.decorate && decorator.decorate.apply(decorator,nodeInfo.childDecorators);
        nodeInfo = nodeInfo.parentNode;
        decorator = nodeInfo.decorator
    }
}
/**
 * 返回先序中最后一个节点
 */
function buildTree(htmlNode,parentNodeInfo,result){
    //hack: var later
    try{
        //fix IE 
        if(htmlNode.getAttribute("d:class")){
            var nodeInfo = new NodeInfo(htmlNode,parentNodeInfo);
            parentNodeInfo = nodeInfo;
            result.push(nodeInfo);
        }
    }catch(e){
        //$log.error("333",e.message)
    }

    htmlNode = htmlNode.firstChild;
    while(htmlNode){
        if(htmlNode.nodeType == 1){
            nodeInfo = buildTree(htmlNode,parentNodeInfo,result);
        }
        htmlNode = htmlNode.nextSibling;
    }

}
function NodeInfo(htmlNode,parentNode){
    this.task = 0;
    this.childNodes = [];
    this.childDecorators = [];
    var attributeMap = this.attributeMap = {};
    if(parentNode){//&& htmlNode  非根节点
        this.htmlNode = htmlNode;
        this.parentNode = parentNode;
        parentNode.childNodes.push(this);
        parentNode.task +=2;
        var attributes = htmlNode.attributes;
        var i = attributes.length;
        this.id = attributeMap.id = htmlNode.id || htmlNode.uniqueID || (htmlNode.id = newDecoratorId());;
        while(i--){
            var attribute = attributes[i];
            var name = attribute.nodeName;
            if(decoratorAttributeNameRegExp.test(name)){
                name = name.substr(2).toLowerCase().replace(/-(\w)/,hiReplacer);
                attributeMap[name] = findValue(attribute.nodeValue);
            }
        }
        this.className = attributeMap["class"];
        delete attributeMap["class"];
    }
}

if(":debug"){
	NodeInfo.prototype.toString = function(){
		var buf = [this.packageName+":"+this.className];
		for(var n in this.attributeMap){
			buf.push("this."+n+"="+this.attributeMap[n]);
		}
		buf.push("childNodes:");
		buf.push.apply(buf,this.childNodes);
		return buf.join("\r\n");
	}
}
function hiReplacer(replaced,c){
    return c.toUpperCase();
}

function findValue(exp){
    var exp2 = exp.replace(expressionRegExp,'$1')
    return exp2==exp?exp:window.eval(exp2);
}