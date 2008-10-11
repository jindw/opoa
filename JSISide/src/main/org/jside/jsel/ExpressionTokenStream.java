package org.jside.jsel;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ExpressionTokenStream {
	private String value;
	private int start;
	private final int end;
	private List<ExpressionToken> tokens = new ArrayList<ExpressionToken>();
	private static Map<Integer, Integer> PRIORITY_MAP = new HashMap<Integer, Integer>();

	private static final String[] OPS = "+ - * / % ? : . > < = >= <= == != && || ! ( [ {".split(" ");
	private static void addOperator(int type,int priopity,String key){
		PRIORITY_MAP.put(type,priopity);
	}
	static{
		

		addOperator(ExpressionToken.TYPE_ADD, 1,"+");
		addOperator(ExpressionToken.TYPE_SUB, 1,"-");
		addOperator(ExpressionToken.TYPE_MUL, 4,"*");
		addOperator(ExpressionToken.TYPE_DIV, 4,"/");
		addOperator(ExpressionToken.TYPE_MOD, 4,"%");
		

		addOperator(ExpressionToken.TYPE_QUESTION, 4,"?");//？？？
		addOperator(ExpressionToken.TYPE_QUESTION_COLON, 4,":");//？？？
		
		addOperator(ExpressionToken.TYPE_PROP, 8,".");

		addOperator(ExpressionToken.TYPE_LT, 0,"<");
		addOperator(ExpressionToken.TYPE_GT, 0,">");
		addOperator(ExpressionToken.TYPE_LTEQ, 0,"<=");
		addOperator(ExpressionToken.TYPE_GTEQ, 0,">=");
		addOperator(ExpressionToken.TYPE_EQ, 0,"==");
		addOperator(ExpressionToken.TYPE_NOTEQ, 0,"!=");
		addOperator(ExpressionToken.TYPE_AND, 0,"&&");
		addOperator(ExpressionToken.TYPE_OR, 0,"||");
		

		addOperator(ExpressionToken.TYPE_NOT, -4,"!");
		
		addOperator(ExpressionToken.TYPE_POS, -4,"+");
		addOperator(ExpressionToken.TYPE_NEG, -4,"-");
		

		addOperator(ExpressionToken.TYPE_MEMBER_METHOD, 8,"");
		addOperator(ExpressionToken.TYPE_GLOBAL_METHOD, 8,"");
		
		addOperator(ExpressionToken.TYPE_PARAM_END, -8,",");
		

	}
	
	private static final Map<String, ExpressionToken> CONSTAINS_MAP = new HashMap<String, ExpressionToken>();
	static {
		CONSTAINS_MAP.put("true", new ExpressionToken.Constants(Boolean.TRUE));
		CONSTAINS_MAP
				.put("false", new ExpressionToken.Constants(Boolean.FALSE));
		CONSTAINS_MAP.put("null", new ExpressionToken.Constants(null));
	}

	public ExpressionTokenStream(String value) {
		this.value = value.trim();
		this.end = this.value.length();
		parse();
	}

	private void parse() {
		skipSpace();
		while (start < end) {
			char c = value.charAt(start);
			if (c == '"' || c == '\'') {
				String text = findString();
				tokens.add(new ExpressionToken.Constants(text));
			} else if (c >= '0' && c <= '9') {
				Number number = findNumber();
				tokens.add(new ExpressionToken.Constants(number));
			} else if (Character.isJavaIdentifierStart(c)) {
				String id = findId();
				ExpressionToken constains = CONSTAINS_MAP.get(id);
				if (constains == null) {
					tokens.add(new ExpressionToken.Id(id));
				} else {
					tokens.add(constains);
				}
			} else {
				boolean missed = true;
				for (String op :OPS) {
					if(value.startsWith(op,start)){
						missed = false;
						start += op.length();
						tokens.add(new ExpressionToken.Constants(0));
						break;
					}
				}
				if(missed){
					throw new RuntimeException("语法错误:" + value + "@" + start);
				}
			}
			skipSpace();
		}
	}

	private Number findNumber() {
		int i = start;
		char c = value.charAt(i++);
		if (c == '0' && i < end) {
			c = value.charAt(i++);
			if (c == 'x') {
				while (i < end) {
					c = value.charAt(i++);
					if (!(c >= '0' && c <= '9' || c >= 'a' && c <= 'f' || c >= 'A'
							&& c <= 'F')) {
						break;
					}
				}
				return parseNumber(value.substring(start, start = i));
			} else if (c >= '0' && c <= '9') {
				while (i < end) {
					c = value.charAt(i++);
					if (c < '0' || c > '7') {
						break;
					}
				}
				return parseNumber(value.substring(start, start = i));

			} else {
				i++;//next process
			}
		}
		while (i < end) {
			c = value.charAt(i++);
			if (c < '0' || c > '9') {
				break;
			}
		}
		if (c == '.') {
			while (i < end) {
				c = value.charAt(i++);
				if (c < '0' || c > '9') {
					break;
				}
			}
		}
		return parseNumber(value.substring(start, start = i));
	}

	private Number parseNumber(String text) {
		if (text.startsWith("0x")) {
			return Integer.parseInt(text.substring(2), 16);
		} else if (text.indexOf('.') >= 0) {
			return Double.parseDouble(text);
		} else if (text.charAt(0) == '0' && text.length() > 1) {
			return Integer.parseInt(text.substring(1), 8);
		} else {
			return Integer.parseInt(text);
		}
	}

	private String findId() {
		int p = start;
		if (Character.isJavaIdentifierPart(value.charAt(p++))) {
			while (p < end) {
				if (!Character.isJavaIdentifierPart(value.charAt(p))) {
					break;
				}
				p++;
			}
			return (value.substring(start, start = p));
		}
		throw new RuntimeException();

	}

	/**
	 * {@link Decompiler#printSourceString
	 */

	private String findString() {
		char quoteChar = value.charAt(start++);
		StringBuilder buf = new StringBuilder();
		while (start < end) {
			char c = value.charAt(start++);
			switch (c) {
			case '\\':
				char c2 = value.charAt(start++);
				switch (c2) {
				case 'b':
					buf.append('\b');
					break;
				case 'f':
					buf.append('\f');
					break;
				case 'n':
					buf.append('\n');
					break;
				case 'r':
					buf.append('\r');
					break;
				case 't':
					buf.append('\t');
					break;
				case 'v':
					buf.append(0xb);
					break; // Java lacks \v.
				case ' ':
					buf.append(' ');
					break;
				case '\\':
					buf.append('\\');
					break;
				case '\'':
					buf.append('\'');
					break;
				case '\"':
					buf.append('"');
					break;
				case 'u':
					buf.append((char) Integer.parseInt(value.substring(
							start + 1, start + 5), 16));
					start += 4;
					break;
				case 'x':
					buf.append((char) Integer.parseInt(value.substring(
							start + 1, start + 3), 16));
					start += 2;
					break;
				}
				break;
			case '"':
			case '\'':
				if (c == quoteChar) {
					return (buf.toString());
				}
			default:
				buf.append(c);

			}
		}
		return null;
	}

	private void skipSpace() {
		while (start < end) {
			if (!Character.isWhitespace(value.charAt(start))) {
				break;
			}
			start++;
		}
	}

}
