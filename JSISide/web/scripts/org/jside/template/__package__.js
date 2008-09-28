this.addScript('template-parser.js',["TemplateParser","EL_TYPE","VAR_TYPE","IF_TYPE","ELSE_TYPE","FOR_TYPE","ATTRIBUTE_TYPE","FOR_KEY"]);
this.addScript('text-parser.js',["TextParser","parseText","parseEL"]
               ,["TemplateParser","EL_TYPE","VAR_TYPE","IF_TYPE","ELSE_TYPE","FOR_TYPE","ATTRIBUTE_TYPE","FOR_KEY"]);
this.addScript('xml-parser.js',"XMLParser"
               ,["TextParser","parseText","parseEL","EL_TYPE","VAR_TYPE","IF_TYPE","ELSE_TYPE","FOR_TYPE","ATTRIBUTE_TYPE","FOR_KEY"]); 
               