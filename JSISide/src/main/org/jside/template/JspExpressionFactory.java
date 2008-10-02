package org.jside.template;

import java.beans.FeatureDescriptor;
import java.beans.PropertyDescriptor;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

import javax.el.ELContext;
import javax.el.ELException;
import javax.el.ELResolver;
import javax.el.FunctionMapper;
import javax.el.MethodExpression;
import javax.el.PropertyNotFoundException;
import javax.el.PropertyNotWritableException;
import javax.el.ValueExpression;
import javax.el.VariableMapper;
import javax.script.ScriptEngineManager;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.jsp.JspApplicationContext;
import javax.servlet.jsp.JspFactory;
import javax.servlet.jsp.PageContext;
/**
 * 该程序必须在Java Servlet环境下运行。
 * @author ut
 *
 */
public class JspExpressionFactory  implements ExpressionFactory{

	private javax.el.ExpressionFactory factory;

	public JspExpressionFactory(ServletContext context){
		JspApplicationContext jspContext = JspFactory.getDefaultFactory().getJspApplicationContext(context);
		factory =jspContext.getExpressionFactory();
		
	}
	public Expression createExpression(Object props){
		final String eltext = (String)props;
		return new Expression(){
			ValueExpression el =null;
			public Object evaluate(Object context) {
				try {
					ELContext elcontext =  PropertyExpression.getValue(context,ELContext.class);
					if(el == null){
					    el = factory.createValueExpression(elcontext,eltext, Object.class);
					}
					return el.getValue(elcontext);
				} catch (Exception e) {
				}
				return null;
			}
			
		};
	}
}