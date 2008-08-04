/*
 * Style 样式包
 * 样式包中的定义，只为描述数据结构，与JSI装载无关，我们目前只在装饰引擎中引用这些数据。
 * 装饰引擎在装载样式单时，对这些数据的表示内容还做了一些弱化。
 * <ul>
 *   <li>无对象依赖<li>
 *   <li>依赖不分前后<li>
 *   <li>每次导入时，现导入主文件，再导入依赖<li>
 *   <li>每个文件一旦导入，下次不再导入<li>
 * </ul>
 */

this.addScript("base.css");
this.addScript("form.css",['Spinner',"DatePicker"],"base.css");
this.addScript("action.css",['DragSource',"DropTarget"]);

