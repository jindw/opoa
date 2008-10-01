package org.jside.template;

import java.util.regex.Pattern;

import org.w3c.dom.Node;

public interface XMLNodeParser {
	public static final Object[] END = new Object[0];
	
	public static final Pattern TEMPLATE_NAMESPACE = Pattern.compile("^http://www.xidea.org/ns/template.*",
			Pattern.CASE_INSENSITIVE);

	public static final Pattern HTML_LEAF = Pattern.compile(
			"^(?:meta|link|img|br|hr)$", Pattern.CASE_INSENSITIVE);
	public static final Pattern SCRIPT_TAG = Pattern.compile("^script$",
			Pattern.CASE_INSENSITIVE);
	public boolean parseNode(Node node, ParseContext context);
}
