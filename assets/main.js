document.write('<script src="assets/boot.js"></script>')
window.onload = window.onhashchange = function(){
	var hash = location.hash;
	var cmd = [{module:"example-menu",target:"menu",urls:["/service/example/menu.api"]}];
	if(hash && hash.length>1){
		try{
			cmd = JSON.parse(decodeURIComponent(hash.replace(/^#/,'')))
		}catch(e){
			console.log("iligal hash command!  "+hash);
			location.hash = "";
		}
	}
	//console.dir(cmd)
	for(var i=0;i<cmd.length;i++){
		openPage(cmd[i])
	}	
}
var targetCache = {};

function openPage(options){
	var source = JSON.stringify(options);
	if(source == targetCache[options.target]){return;}
	targetCache[options.target] = source;
	var urls = options.urls
	var end = urls.length;
	var inc = end;
	var result = [];
	var isFirst = true;
	function dec(){
		var el = document.getElementById(options.target);
		if(isFirst){
			el.className = "loading"
		}
		if(--inc <0){
			var m = require(options.module);
			var method = options.method || 'index';
			console.log(options,m)
			var cmd = m[method];
			el.innerHTML = cmd.apply(this,result);
			el.className = "loaded"
		}
	}
	while(end-->0){
		//console.log('load:',urls[end])
		loadURL(urls[end],dec,result,end)
	}
	$JSI.require(dec,options.module);
}

function loadURL(url,callback,result,index){
	var xhr = new XMLHttpRequest();
	var headers = {
					  "Accept":"'text/javascript, text/html, application/xml, text/xml, */*'",
					  "Content-Type":"text/json"
				   };
	xhr.onreadystatechange = function(){
		var state = xhr.readyState;
		if(state == 4){
			console.log('complete url:',url)
			var data = xhr.responseText;
			var status = data!=null && xhr.status;
			var success = status ?status >= 200 && status < 300 : null;
			if(success){
				result[index] = JSON.parse(data)
			}else{
				result[index] = {error:data};
			}
			console.log(result);
			callback();
			xhr.onreadystatechange = Function.prototype;
		}
	};
	xhr.open("GET",url,true);
	for(var n in headers){
		xhr.setRequestHeader(n,headers[n]);
	}
	xhr.send('');
}