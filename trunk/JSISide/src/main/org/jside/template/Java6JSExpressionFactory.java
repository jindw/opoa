package org.jside.template;

import java.io.InputStreamReader;
import java.util.Map;

import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import javax.script.SimpleBindings;

public class Java6JSExpressionFactory implements ExpressionFactory {
	private ScriptEngine engine;

	Java6JSExpressionFactory() {
		ScriptEngineManager manager = new ScriptEngineManager();
		this.engine = manager.getEngineByExtension("js");
		try {
			this.engine.eval(new InputStreamReader(
					Java6JSExpressionFactory.class
							.getResourceAsStream("el.js")));
		} catch (ScriptException e) {
			throw new RuntimeException(e);
		}
	}

	public Expression createExpression(Object props) {
		try {
			final String el = (String) ((Invocable) engine).invokeFunction(
					"__compile_EL__", (String) props);
			return new Expression() {
				public Object evaluate(Object context) {
					try {
						Object value = engine.eval(el, new SimpleBindings(
								(Map) context));
						return ((Invocable) engine).invokeFunction(
								"__JS2JAVA__",  value);
					}  catch (NoSuchMethodException e) {
						e.printStackTrace();
					} catch (ScriptException e) {
						e.printStackTrace();
					}
					return null;

				}
			};
		} catch (NoSuchMethodException e) {
			e.printStackTrace();
		} catch (ScriptException e) {
			e.printStackTrace();
		}

		return null;
	}
}