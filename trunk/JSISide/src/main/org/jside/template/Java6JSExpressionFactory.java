package org.jside.template;

import java.beans.PropertyDescriptor;
import java.io.InputStreamReader;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

import javax.script.Bindings;
import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import javax.script.SimpleBindings;

import sun.org.mozilla.javascript.internal.NativeArray;

public class Java6JSExpressionFactory implements ExpressionFactory {
	private ScriptEngine engine;

	Java6JSExpressionFactory() {
		ScriptEngineManager manager = new ScriptEngineManager();
		this.engine = manager.getEngineByExtension("js");
		try {
			this.engine.eval(new InputStreamReader(
					Java6JSExpressionFactory.class
							.getResourceAsStream("js2java.js")));
		} catch (ScriptException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public Expression createExpression(Object props) {
		final String el = (String) props;
		return new Expression() {
			public Object evaluate(Map<Object, Object> context) {
				try {
					Object value = engine.eval(el, new SimpleBindings(
							(Map) context));
					if (value instanceof NativeArray) {
						value = ((Invocable)engine).invokeFunction("_js2java", value);
					}
					return value;
				} catch (NoSuchMethodException e) {
					e.printStackTrace();
					return null;
				} catch (ScriptException e) {
					e.printStackTrace();
					return null;
				}

			}

		};
	}
}