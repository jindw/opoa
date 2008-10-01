/*
 * @author 金大为
 * @from JSON.org(http://www.json.org/)
 * @version $Id: event-util.js,v 1.5 2008/02/25 01:55:59 jindw Exp $
 */

/**
 * JS to Java
 * @internal
 */
function _js2java(value) {
    switch (typeof value) {
        case 'object':
            if (value instanceof Array) {
                var v = new java.util.ArrayList();
                for (var i = 0;i<value.length;i++) {
                    v.add(_js2java(value[i]));
                }
                return v;
            }
            var v = new java.util.HashMap();
            for (var k in value) {
                v.put(k,_js2java(value[k]));
            }
            return v;
        case 'number':
           if(parseInt(value) == value){
           	    return new java.lang.Long(value);
           }
        default:
            return value;
    }
}