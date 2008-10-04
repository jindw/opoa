package org.jside.template;

public class ConstantExpression implements Expression {
	public Object value;
	public ConstantExpression(Object value){
		this.value = value;
	}
	public Object evaluate(Object context) {
		return value;
	}

}
