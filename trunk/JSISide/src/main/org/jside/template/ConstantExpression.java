package org.jside.template;

import java.util.Map;

public class ConstantExpression implements Expression {
	public Object value;
	public ConstantExpression(Object value){
		this.value = value;
	}
	public Object evaluate(Map<Object, Object> context) {
		return value;
	}

}
