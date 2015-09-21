exports.mapping = [
	//add menu mapping
	{
		"path":"/service/example/menu.api",
		"remote":"/mock/example-menu.json"
	},


	//for example....
	{
		"path":"/test/simple-data",
		"data":{
			"result":"success"
		}
	},
	{
		"path":/^\/test\/xmldom\/issues\/?$/,
		"remote":"http://www.xidea.org/test/xmldom-issues.json"
	},
	
	{
		"path":/^\/test\/users\/(\w+)\/?$/,
		"action":function(request,response,path,uid){
			var headers = {"Content-Type":"text/json;charset=utf-8"};
			response.writeHead(200, headers); 
			response.end(JSON.stringify({"uid":uid}));
			return true;
		}
	}
];