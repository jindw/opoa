package org.jside.template;

import java.beans.PropertyDescriptor;
import java.util.HashMap;
import java.util.Map;

public interface ExpressionFactory {

	public Expression createExpression(Object el);
}