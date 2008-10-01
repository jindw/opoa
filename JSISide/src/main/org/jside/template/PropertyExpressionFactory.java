package org.jside.template;

import java.beans.PropertyDescriptor;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

import javax.script.ScriptEngineManager;

public class PropertyExpressionFactory  implements ExpressionFactory{
	private static final Pattern PROPERTY_SPLIT_PATTERN = Pattern.compile("[^\\w\\$\\_]+");
	private static Map<Class<?>, Map<String, PropertyDescriptor>> classPropertyMap = new HashMap<Class<?>, Map<String, PropertyDescriptor>>();
	private static Map<String, PropertyDescriptor> getPropertyMap(Class<?> clazz) {
		Map<String, PropertyDescriptor> propertyMap = classPropertyMap
				.get(clazz);
		if (propertyMap == null) {
			try {
				propertyMap = new HashMap<String, PropertyDescriptor>();
				classPropertyMap.put(clazz, propertyMap);
				PropertyDescriptor[] properties = java.beans.Introspector
						.getBeanInfo(clazz).getPropertyDescriptors();
				for (int i = 0; i < properties.length; i++) {
					PropertyDescriptor property = properties[i];
					propertyMap.put(property.getName(), property);
				}
			} catch (Exception e) {
			}
		}
		return propertyMap;
	}
	public static Object getValue(Object context, Object key) {
		if (context != null) {
			if(key instanceof Integer){
				if(context instanceof Object[]){
					return ((Object[])context)[(Integer)key];
				}else{
					return (( List<Object>)context).get((Integer)key);
				}
			}
			if (context instanceof Map) {
				return ((Map) context).get(key);
			}
			Map<String, PropertyDescriptor> pm = getPropertyMap(context
					.getClass());
			PropertyDescriptor pd = pm.get(key);
			if (pd != null) {
				Method method = pd.getReadMethod();
				if (method != null) {
					try {
						return method.invoke(context);
					} catch (Exception e) {
					}
				}
			}
		}
		return null;
	}
	public Expression createExpression(Object props){
		final String[] el  = (String[])props;
		return new Expression(){
			public Object evaluate(Map<Object, Object> context) {
				int i = el.length-1;
				Object value = context.get(el[i]);
				while(value !=null && i-->0){
					String key = el[i];
					value = getValue(context,key);
				}
				return value;
			}
			
		};
	}
}