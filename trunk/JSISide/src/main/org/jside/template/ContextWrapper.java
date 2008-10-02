package org.jside.template;

import java.io.IOException;
import java.io.Writer;
import java.math.BigDecimal;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

class ContextWrapper implements Map<Object, Object>{
	private Object context;
	private Map<Object, Object>values ;

	public ContextWrapper(Object context){
		this.context = context;
	}
	
	public Object get(Object key) {
		if(values!=null && values.containsKey(key)){
			return values.get(key);
		}
		return PropertyExpression.getValue(context, key);
	}

	public Object put(Object key, Object value) {
		if(values!=null ){
			values = new HashMap<Object, Object>();
		}
		return values.put(key, value);
	}


	public void clear() {
	}

	public boolean containsKey(Object key) {
		return false;
	}


	public boolean containsValue(Object value) {
		return false;
	}


	public Set<java.util.Map.Entry<Object, Object>> entrySet() {
		return null;
	}


	public boolean isEmpty() {
		return false;
	}


	public Set<Object> keySet() {
		return null;
	}


	public void putAll(Map<? extends Object, ? extends Object> m) {
		
	}


	public Object remove(Object key) {
		return null;
	}


	public int size() {
		return 0;
	}


	public Collection<Object> values() {
		return null;
	}

	
}
