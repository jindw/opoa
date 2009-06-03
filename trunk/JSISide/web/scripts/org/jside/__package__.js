/*
 * UI库的基本操作
 */
this.addScript("element.js",['Element','E']);
this.addScript("drag-drop.js",['Draggable',"Droppable"]
                 ,"E");

this.addScript("tween.js",'Tween');
this.addScript("tween-rule.js",'TweenRuleSample');


/*
 * IO类操作,如Http请求,Cookie访问,以及以后可能添加的userData访问功能
 */

this.addScript("json.js",['JSON']);
this.addScript("cookie.js",'Cookie');
this.addScript("request.js",'Request');
this.addScript('chinese-calendar.js',['ChineseDate']);

this.addScript("date-format.js","DateFormat");

/*
 * 模版实现
 */
this.addScript("template.js",['Template']);

this.addDependence('*',"org.xidea.jsidoc.util:$log");
