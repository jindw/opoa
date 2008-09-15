/*
 * JSI示例装饰器集合，及默认装饰引擎实现
 */

/*
 * Decorator 处理相关
 */
this.addScript("include.js",'Include',
              'org.jside.Request');
              
this.addScript("drag-drop.js",["DragSource","DropTarget"],'org/jside/drag-drop.js');

this.addScript("spinner.js",['Spinner','Slider'],["org.jside.Template"]);

this.addScript("date-picker.js",'DatePicker',
              ['org.jside.Template',"org.jside.ISODateFormat"]);
              
this.addScript("tooltip.js",'Tooltip');
              
this.addDependence("*",["org.jside.E","org.jside.Element"]);

this.addScript("utils.js",'*');
this.addDependence("*","utils.js");

