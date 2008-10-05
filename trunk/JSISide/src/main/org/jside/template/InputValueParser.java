package org.jside.template;

import org.w3c.dom.Attr;
import org.w3c.dom.Element;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;

public class InputValueParser implements XMLNodeParser {
	private static final String ATTRIBUTE_SELECTED = "selected";
	private static final String XHTMLNS = "http://www.w3.org/1999/xhtml";
	private static final String EL_INPUT = "input";

	private static final String ATTRIBUTE_TYPE = "type";
	private static final String ATTRIBUTE_CHECKED = "checked";
	private static final String TYPE_CHECKBOX = "checkbox";
	private static final String TYPE_RADIO = "radio";

	private static final String EL_SELECT = "select";
	private static final String EL_OPTION = "option";

	private static final Object SELECT_KEY = new Object();

	private static final String NAME = "name";
	private static final String VALUE = "value";

	private XMLParser parser;

	public InputValueParser(XMLParser parser) {
		this.parser = parser;
	}

	public boolean parseNode(Node node, ParseContext context) {
		String namespace = node.getNamespaceURI();
		if (namespace == null || XHTMLNS.equals(namespace)) {
			if (node instanceof Element) {
				Element el = (Element) node;
				String localName = el.getLocalName();
				if (EL_INPUT.equals(localName)) {
					return parseCloneInput(el, context);
				} else if (EL_SELECT.equals(localName)) {
					context.put(SELECT_KEY, el);
					this.parser.parseNode(el, context);
					context.remove(SELECT_KEY);
					return true;
				} else if (EL_OPTION.equals(localName)) {
					return parseCloneInput(el, context);
				}
			}
		}
		return false;
	}

	private boolean parseCloneInput(Element el, ParseContext context) {
		el = (Element) el.cloneNode(false);
		String type = el.getAttribute(ATTRIBUTE_TYPE);
		if (TYPE_CHECKBOX.equals(type) || TYPE_RADIO.equals(type)) {
			if (el.hasAttribute(ATTRIBUTE_CHECKED)) {
				appendInputOrOption(el, context);
				return true;
			} else if (el.hasAttribute(NAME) && el.hasAttribute(VALUE)) {
				String name = el.getAttribute(NAME);
				String value = el.getAttribute(VALUE);
				if(value.startsWith("${") && value.endsWith("}")){
					value = value.substring(2, value.length() - 3);
				}else{
					value ='\''+ value+'\'';
				}
				el.setAttribute("checked", "${("+value+") in " + name + "}");
				appendInputOrOption(el, context);
				return true;
			}
		} else {
			if (!el.hasAttribute(VALUE) && el.hasAttribute(NAME)) {
				el.setAttribute(VALUE, "${" + el.getAttribute(NAME) + "}");
				appendInputOrOption(el, context);
				return true;
			}
		}
		return false;
	}

	private void appendInputOrOption(Node node, ParseContext context) {
		Element el = (Element) node;
		NamedNodeMap attributes = node.getAttributes();
		String tagName = el.getTagName();
		context.append("<" + tagName);
		for (int i = 0; i < attributes.getLength(); i++) {
			appendAttribute((Attr) attributes.item(i), context);
		}
		context.append("/>");
	}

	private void appendAttribute(Attr node, ParseContext context) {
		String name = node.getName();
		String value = node.getValue();
		if (ATTRIBUTE_CHECKED.equals(name) || ATTRIBUTE_SELECTED.equals(name)) {
			value = value.trim();
			if (value.length() == 0 || "false".equals(value)) {
				return;
			} else if (value.startsWith("${") && value.endsWith("}")) {
				value = value.substring(2, value.length() - 3);
				node.setValue("${(" + value + ")?true:null}");
			}
		}
		this.parser.parseNode(node, context);

	}
}
