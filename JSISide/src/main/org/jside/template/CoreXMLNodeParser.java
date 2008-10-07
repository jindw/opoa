package org.jside.template;

import java.io.IOException;
import java.net.URL;
import java.util.List;
import java.util.Map;

import org.w3c.dom.Document;
import org.w3c.dom.DocumentFragment;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import static org.jside.template.Template.*;

public class CoreXMLNodeParser implements XMLNodeParser {

	private XMLParser parser;

	public CoreXMLNodeParser(XMLParser parser) {
		this.parser = parser;
	}

	public boolean parseNode(Node node, ParseContext context) {
		if (node.getNodeType() == Node.ELEMENT_NODE) {
			Element el = (Element) node;
			String prefix = el.getPrefix();
			String namespaceURI = el.getNamespaceURI();
			if (namespaceURI != null
					&& ("c".equals(prefix)
							&& ("#".equals(namespaceURI) || "#core"
									.equals(namespaceURI)) || TEMPLATE_NAMESPACE
							.matcher(namespaceURI).find())) {
				String name = el.getLocalName();
				if ("choose".equals(name)) {
					return parseChooseTag(node, context);
				} else if ("elseif".equals(name)) {
					return parseElseIfTag(node, context);
				} else if ("else-if".equals(name)) {
					return parseElseIfTag(node, context);
				} else if ("else".equals(name)) {
					return parseElseTag(node, context);
				} else if ("if".equals(name)) {
					return parseIfTag(node, context);
				} else if ("out".equals(name)) {
					return parseOutTag(node, context);
				} else if ("include".equals(name)) {
					return parseIncludeTag(node, context);
				} else if ("for".equals(name)) {
					return parseForTag(node, context);
				} else if ("var".equals(name)) {
					return parseVarTag(node, context);
				}
			}
		}
		return false;
	}

	public String getAttribute(Node node, String key) {
		Element el = (Element) node;
		return el.hasAttribute(key) ? el.getAttribute(key) : null;
	}

	private Expression toEL(String value) {
		value = value.trim();
		if (value.startsWith("${") && value.endsWith("}")) {
			value = value.substring(2, value.length() - 1);
		}
		return parser.parseEL(value);
	}

	private Expression getAttributeEL(Node node, String key) {
		String value = getAttribute(node, key);
		return toEL(value);

	}

	public boolean parseIncludeTag(Node node, ParseContext context) {
		String var = getAttribute(node, "var");
		String path = getAttribute(node, "path");
		String xpath = getAttribute(node, "xpath");
		String name = getAttribute(node, "name");
		Node doc = node.getOwnerDocument();
		URL parentURL = context.getCurrentURL();
		try {
			if (name != null) {
				DocumentFragment cachedNode = parser.toDocumentFragment(node, node.getChildNodes());
				context.put("#"+name,cachedNode );
			}
			if (var != null) {
				Node next = node.getFirstChild();
				context.append(new Object[] { VAR_TYPE, var });
				if (next != null) {
					do {
						this.parser.parseNode(next, context);
					} while ((next = next.getNextSibling()) != null);
				}
				context.append(END);
			}
			if (path != null) {
				if (path.startsWith("#")) {
					doc = (Node) context.get(path);
					String uri;
					if(doc instanceof Document){
						uri = ((Document)doc).getDocumentURI();
					}else{
						uri = doc.getOwnerDocument().getDocumentURI();
					}
					if(uri != null){
						try{
						    context.setCurrentURL(new URL(uri));
						}catch (Exception e) {
						}
					}
				} else {
					doc = this.parser
							.loadXML(new URL(parentURL, path), context);
				}
			}

			if (xpath != null) {
				doc = this.parser.selectNodes(xpath, doc);
			}
			this.parser.parseNode(doc, context);
			return true;
		} catch (Exception e) {
			//e.printStackTrace();
			return true;
		} finally {
			context.setCurrentURL(parentURL);
		}
	}

	boolean parseIfTag(Node node, ParseContext context) {
		Node next = node.getFirstChild();
		Expression test = getAttributeEL(node, "test");
		context.append(new Object[] { IF_TYPE, test });
		if (next != null) {
			do {
				this.parser.parseNode(next, context);
			} while ((next = next.getNextSibling()) != null);
		}
		context.append(END);
		return true;
	}

	boolean parseElseIfTag(Node node, ParseContext context) {
		context.removeLastEnd();
		Node next = node.getFirstChild();
		Expression test = getAttributeEL(node, "test");
		context.append(new Object[] { ELSE_TYPE, test });
		if (next != null) {
			do {
				this.parser.parseNode(next, context);
			} while ((next = next.getNextSibling()) != null);
		}
		context.append(END);
		return true;
	}

	boolean parseElseTag(Node node, ParseContext context) {
		context.removeLastEnd();
		Node next = node.getFirstChild();
		context.append(new Object[] { ELSE_TYPE, null });
		if (next != null) {
			do {
				this.parser.parseNode(next, context);
			} while ((next = next.getNextSibling()) != null);
		}
		context.append(END);
		return true;
	}

	boolean parseChooseTag(Node node, ParseContext context) {
		Node next = node.getFirstChild();
		boolean first = true;
		String whenTag = "when";
		String elseTag = "otherwise";
		if (next != null) {
			do {
				if (next instanceof Element) {
					Element el = (Element) next;
					if (el.getNamespaceURI().equals(node.getNamespaceURI())) {
						if (whenTag.equals(el.getLocalName())) {
							if (first) {
								first = false;
								parseIfTag(next, context);
							} else {
								parseElseIfTag(next, context);
							}
						} else if (next.getLocalName() == elseTag) {
							parseElseTag(next, context);
						} else {
							throw new RuntimeException(
									"choose 只接受 when，otherwise 节点");
						}
						this.parser.parseNode(next, context);
					}
				}
			} while ((next = next.getNextSibling()) != null);
		}
		return true;
	}

	boolean parseForTag(Node node, ParseContext context) {
		Node next = node.getFirstChild();
		Expression items = getAttributeEL(node, "items");
		String var = getAttribute(node, "var");
		String status = getAttribute(node, "status");
		context.append(new Object[] { FOR_TYPE, var, items, status });
		if (next != null) {
			do {
				this.parser.parseNode(next, context);
			} while ((next = next.getNextSibling()) != null);
		}
		context.append(END);
		return true;
	}

	boolean parseVarTag(Node node, ParseContext context) {
		String name = getAttribute(node, "name");
		String value = getAttribute(node, "value");
		if (value == null) {
			Node next = node.getFirstChild();
			context.append(new Object[] { VAR_TYPE, name, null });
			if (next != null) {
				do {
					this.parser.parseNode(next, context);
				} while ((next = next.getNextSibling()) != null);
			}
			context.append(END);
		} else {
			context.append(new Object[] { VAR_TYPE, name, toEL(value) });
		}
		return true;
	}

	boolean parseOutTag(Node node, ParseContext context) {
		String value = getAttribute(node, "value");
		List<Object> result = this.parser.parseText(value, false, 0);
		context.append(result);
		return true;
	}

}