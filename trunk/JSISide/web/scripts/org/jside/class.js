/*
 * @author 金大为
 * @author Erik
 */



/**
 * 一个可选的类封装函数，你可以不选用，我也推荐不使用类封装。
 * 菩提本无树，明镜亦非台，何必在乎这些外在形式？简单就好。
 * @public
 * @param <object> props 类成员
 * @param <Class> superClass 父类
 * @return <Class> 创建的类
 * @author Erik
 */
function Class(props, superClass) {
	var con = props.constructor == Object ? undefined : props.constructor;
	if (superClass) {
		var superConstructor = function () {superClass.call(this,arguments)};
	}
	var clazz = con || superConstructor || new Function();
	if (superClass) {
		function s(){};
		s.prototype = superClass.prototype;
		clazz.prototype = new s();
	}
	for (var k in props) {
		clazz.prototype[k] = props[k];
	}
	clazz.constructor = clazz;
	return clazz;
}
    

///**
// * 将一个对象的属性成员复制到另一个
// * @param <object> sourceObject 源对象
// * @param <object> destObject 目标对象
// * @return <object> 目标对象
// */
//Class.copy = function(sourceObject,destObject) {
//    if (destObject && sourceObject) {
//        for (var prop in sourceObject) {
//            destObject[prop] = sourceObject[prop];
//        }
//    }
//    return destObject;
//}