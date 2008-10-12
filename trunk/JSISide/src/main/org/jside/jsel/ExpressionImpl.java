package org.jside.jsel;

import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.Map;

import org.jside.template.Expression;

public class ExpressionImpl implements Expression {
	private static final Calculater DEFAULT_CALCULATER = new CalculaterImpl();

	private static boolean containsDobule(Object arg1, Object arg2) {
		return false;
	}
	ExpressionTokenStream expressionTokens;
	private Calculater calculater = DEFAULT_CALCULATER;
	public ExpressionImpl(String el){
		expressionTokens = new ExpressionTokenStream(el);
	}
	public ExpressionImpl(String el,Calculater calculater){
		expressionTokens = new ExpressionTokenStream(el);
		this.calculater = calculater;
	}

	public Object evaluate(Map<Object, Object> context) {
		ValueStack aStack = new ValueStack();
		ExpressionToken item = null;
		Iterator<ExpressionToken> it = expressionTokens.iterator();
		while (it.hasNext()) {
			item = (ExpressionToken) it.next();
			if (item instanceof OperatorToken) {
				if(calculater.compute((OperatorToken) item, aStack, it)){
//					//do skip
//					int itemCount = 0;
//					while(true){
//					    Object skipItem = it.next();
//						if (skipItem instanceof OperatorToken) {
//							itemCount -= ((OperatorToken) item).getLength();
//						} else {
//							itemCount++;
//							if(itemCount == 2){
//								aStack.push(skipItem);
//							}
//						}
//					}
				}
			} else{
				aStack.push(item);
			}
		}
		return aStack.pop();
	}
	
}