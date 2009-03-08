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
              ['org.jside.Template',"org.jside.DateFormat"]);
              
this.addScript("tooltip.js",'Tooltip');
              

this.addScript("utils.js",['createActionMap','applyTemplate','stopPropagation']);
this.addDependence("Slider","org.jside.Draggable",true);

this.addDependence("*","utils.js");
this.addDependence("*",["org.jside.E","org.jside.Element"]);


