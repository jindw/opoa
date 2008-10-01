package org.jside.template;

import java.io.File;
import java.io.IOException;
import java.io.StringReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;
import java.util.regex.Pattern;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpressionException;

import org.jside.Template;
import org.w3c.dom.Attr;
import org.w3c.dom.CDATASection;
import org.w3c.dom.Document;
import org.w3c.dom.DocumentType;
import org.w3c.dom.Element;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.w3c.dom.ProcessingInstruction;
import org.w3c.dom.Text;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

public class XMLParser extends TextParser {
	private static final Pattern XML_HEADER_SPACE_PATTERN = Pattern
			.compile("^[\\s\\ufeff]*<");

	private DocumentBuilder documentBuilder;
	private XMLNodeParser[] parserList = {
			new DefaultXMLNodeParser(this) , new CoreXMLNodeParser(this)};

	public XMLParser() {
		try {
			DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
			factory.setNamespaceAware(true);
			documentBuilder = 	factory.newDocumentBuilder();
		} catch (ParserConfigurationException e) {
			throw new RuntimeException(e);
		}
	}

	public List<Object> parse(Object data) {
		ParseContext context = new ParseContext();
		try {
			Node node = null;
			if (data instanceof String) {
				String path = (String) data;
				if (XML_HEADER_SPACE_PATTERN.matcher(path).find()) {
					node = documentBuilder.parse(new InputSource(
							new StringReader(path)));
				} else {
					int pos = path.indexOf('#');
					String xpath = null;
					if (pos > 0) {
						xpath = path.substring(pos + 1);
						path = path.substring(0, pos);
					}
					node = loadXML(path, context);
					if (xpath != null) {
						NodeList nodes = selectNodes(xpath, node);
						for (int i = 0; i < nodes.getLength(); i++) {
							parseNode(nodes.item(i), context);
						}
						return  context.getResult();
					}
				}

			} else if (data instanceof URL) {
				node = loadXML((URL) data, context);
			}else if (data instanceof File) {
				node = loadXML(((File) data).toURI().toURL(), context);
			}
			if(node != null){
				parseNode(node, context);
			}
			return  context.getResult();
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	public Node loadXML(String url, ParseContext context) throws SAXException,
			IOException, XPathExpressionException {
		return loadXML(new URL(url), context);
	}

	public Node loadXML(URL url, ParseContext context) throws SAXException,
			IOException, XPathExpressionException {
		context.setCurrentURL(url);
		Document doc = documentBuilder.parse(url.openStream());
		// selectNodes(xpath, doc);
		return doc;
	}

	public NodeList selectNodes(String xpath, Object doc)
			throws XPathExpressionException {
		return (NodeList) javax.xml.xpath.XPathFactory.newInstance().newXPath()
				.evaluate(xpath, doc, XPathConstants.NODESET);
	}

	public void parseNode(Node node, ParseContext context) {
		int i = parserList.length;
		while (i-- > 0) {
			if (parserList[i].parseNode(node, context)) {
				return;
			}
		}
	}
}
