/*
 * JSI示例装饰器集合，及默认装饰引擎实现
 */

/*
 * Decorator 处理相关
 */
//this.addScript("test.js",['Test']);
this.addScript("include.js",'Include',
              'org.jside.Request','org/jside/xml/mozilla-xml.js');
              
this.addScript("drag-drop.js",["DragSource","DropTarget"],'org/jside/drag-drop.js');

this.addScript("spinner.js",'Spinner');

this.addScript("date-picker.js",'DatePicker',
              'org.jside.Request');
              
this.addScript("tooltip.js",'Tooltip');
              
this.addDependence("*",["org.jside.E","org.jside.Element"]);

if(":debug"){//class 常量，放在一起方便混淆
    this.addScript("constants.js",'*');
    this.addDependence("*","constants.js");
}

