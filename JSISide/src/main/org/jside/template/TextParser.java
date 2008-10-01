package org.jside.template;

import java.io.IOException;
import java.io.StringWriter;
import java.io.Writer;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.jside.Template;

public class TextParser implements Parser {
	private static final Pattern FN_PATTERN = Pattern.compile("^[\\w]+\\s*$");
	private static final Pattern NAME_PATTERN = Pattern.compile("^[\\w]+$");
	private static final Pattern PROPS_MARTCH_PATTERN = Pattern
			.compile("^[_$a-zA-Z](?:[\\.\\s\\w\\_]+|\\[(?:\"[^\"]*?\"|'[^']*?'|\\d+)\\])*$");
	private static final Pattern PROPS_FINDER_PATTERN = Pattern
			.compile("[\\d]+|[\\w_\\$]+|\"[^\"]*?\"|'[^']*?'");
	private static final Pattern NUMBER_PATTERN = Pattern
			.compile("^[\\d\\.]+$");
	private static ExpressionFactory defaultExpressionFactory = new Java6JSExpressionFactory();

	private ExpressionFactory expressionFactory = defaultExpressionFactory;

	public void setExpressionFactory(ExpressionFactory expressionFactory) {
		this.expressionFactory = expressionFactory;
	}

	public List<Object> parse(Object text) {
		return parseText((String) text, false, (char) 0);
	}

	public String encodeText(String text, int quteChar) {
		StringWriter out = new StringWriter();
		for (int i = 0; i < text.length(); i++) {
			int c = text.charAt(i);
			switch (c) {
			case '<':
				out.write("&lt;");
				break;
			case '>':
				out.write("&gt;");
				break;
			case '&':
				out.write("&amp;");
				break;
			case '\'':
				if (quteChar == c) {
					out.write("&#39;");
				}
				break;
			case '"':
				if (quteChar == c) {
					out.write("&#34;");
				}
				break;
			default:
				out.write(c);
			}
		}
		return out.toString();
	}

	/**
	 * 解析指定文本
	 * 
	 * @public
	 * @abstract
	 * @return <Array> result
	 */
	public List<Object> parseText(String text, boolean encodeXML,
			int quteChar) {
		int i = 0;
		int start = 0;
		int length = text.length();
		ArrayList<Object> result = new ArrayList<Object>();
		do {
			final int p = text.indexOf('$');
			if (isEscaped$(text, p)) {
				continue;
			} else {
				final int p1 = text.indexOf('{', p);
				if (p1 > p) {
					String fn;
					if (p + 1 < p1) {
						fn = text.substring(p + 1, p1);
						if (!FN_PATTERN.matcher(fn).find()) {
							continue;
						}
					} else {
						fn = "";
					}
					int p2 = findELEnd(text, p1, length);
					if (p2 > 0) {
						if (p1 > start) {
							Object el = parseEL(text.substring(p1 + 1, p2));
							try {
								result.add(text.substring(start, p));
								result.add(new Object[] {
										encodeXML ? Template.EL_TYPE_XML_TEXT
												: Template.EL_TYPE, el });
								start = p2 + 1;
							} catch (Exception e) {
							}
						}
					}
				}
			}

		} while (++i < length);
		if (start < length) {
			result.add(text.substring(start));
		}
		if (encodeXML) {
			i = result.size();
			while (i-- > 0) {
				Object item = result.get(i);
				if(item instanceof String){
					result.set(i,encodeText((String)item, quteChar));
				}
			}
		}
		return result;
	}

	protected Object parseEL(String expression) {
		expression = expression.trim();
		if (NAME_PATTERN.matcher(expression).find()) {
			if ("true".equals(expression)) {
				return Boolean.TRUE;
			} else if ("false".equals(expression)) {
				return Boolean.FALSE;
			} else if (NUMBER_PATTERN.matcher(expression).find()) {
				return new Long(expression);
			}
			return expression;
		} else if (NUMBER_PATTERN.matcher(expression).find()) {
			return new Double(expression);
		}
		if (PROPS_MARTCH_PATTERN.matcher(expression).find()) {
			Matcher props = PROPS_FINDER_PATTERN.matcher(expression);
			LinkedList<Object> result = new LinkedList<Object>();
			while (props.find()) {
				String item = props.group();
				if (NUMBER_PATTERN.matcher(item).find()) {
					result.offerFirst(Integer.parseInt(item));
				} else {
					char c = item.charAt(0);
					if (c == '"' || c == '\'') {
						// TODO: 需要作处理
						result.offerFirst(item.substring(1, item.length() - 1));
					} else {
						result.offerFirst(item);
					}
				}
			}
			return result.toArray();
		}
		return defaultExpressionFactory.createExpression(expression);
	}

	private boolean isEscaped$(String text, int p) {
		int pre = p;
		while (pre-- > 0 && text.charAt(p) == '\\')
			;
		return (p - pre & 1) == 0;
	}

	private int findELEnd(String text, int p, int length) {
		if (p >= length) {
			return -1;
		}
		int next = p;
		char pc = 0;
		char stringChar = 0;
		int depth = 0;
		do {
			char c = text.charAt(next);
			switch (c) {
			case '\\':
				next++;
				break;
			case '\'':
			case '"':
				if (stringChar == c) {
					stringChar = 0;
				} else if (stringChar == 0) {
					stringChar = c;
				}
				break;
			case '{':
				if (stringChar == 0) {
					depth++;
				}
				break;
			case '}':
				if (stringChar == 0) {
					depth--;
					if (depth == 0) {
						return next;
					}
				}
			}
		} while (++next < length);
		return -1;
	}

}
