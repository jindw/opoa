package org.jside.template;

import java.io.IOException;
import java.io.Writer;
import java.util.HashMap;
import java.util.Map;

public interface RenderContext {
	public void print(Object c);
	public void set(Object key,Object value);
	public Object get(Object value);
	public Writer getOut();
	public void setOut(Writer out);
}
class DefaultRenderContext implements RenderContext{
	private Object context;
	private Writer out;
	private Map<Object, Object>values ;

	public DefaultRenderContext(Object context,Writer out){
		this.context = context;
		this.out = out;
	}
	

	public Writer getOut() {
		return out;
	}

	public void setOut(Writer out) {
		this.out = out;
	}


	public Object get(Object key) {
		if(values!=null && values.containsKey(key)){
			return values.get(key);
		}
		return PropertyExpressionFactory.getValue(context, key);
	}

	public void set(Object key, Object value) {
		if(values!=null ){
			values = new HashMap<Object, Object>();
		}
		values.put(key, value);
	}
	public void print(Object c) {
		try {
			out.write(String.valueOf(c));
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}

	
}
