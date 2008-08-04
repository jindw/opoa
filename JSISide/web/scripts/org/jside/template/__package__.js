this.addScript('template-parser.js',"TemplateParser");
this.addScript('text-parser.js',["TextParser","parseText","parseEL"]
               ,"TemplateParser");
this.addScript('xml-parser.js',"XMLParser"
               ,["TextParser","parseText","parseEL"]); 
