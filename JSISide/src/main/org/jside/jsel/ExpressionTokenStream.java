package org.jside.jsel;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

public class ExpressionTokenStream implements Iterable<ExpressionToken>{
	private static final int BEGIN = -100;
	private static final int EXPRESSION = -101;
	private static final int OPERATOR = -102;
	private String value;
	private int start;
	private final int end;
	private int status = BEGIN;
	private int previousType = BEGIN;

	private List<ExpressionToken> tokens = new ArrayList<ExpressionToken>();
	private List<ExpressionToken>  expression;
	private static Map<Integer, Integer> PRIORITY_MAP = new HashMap<Integer, Integer>();
	private static Map<String, Integer> TYPE_MAP = new HashMap<String, Integer>();
	private static final String[] OPS;// = ">= <= == != && || + - * / % ? : .


	private static void addOperator(int type, int priopity, String key,
			List<String> ops) {
		PRIORITY_MAP.put(type, priopity);
		if (TYPE_MAP.containsKey(key)) {
			TYPE_MAP.put(key, -1);
		} else {
			TYPE_MAP.put(key, type);
		}
		if (key.length() == 1) {
			ops.add(key);
		} else if (key.length() == 2){
			// 当前只有二个字符的操作符，以后需要扩展
			ops.add(0, key);
		}
	}
	

	static {
		ArrayList<String> ops = new ArrayList<String>();
		ops.add("[");// !!
		ops.add("{");
		ops.add("]");
		ops.add("}");
		
		addOperator(ExpressionToken.BRACKET_BEGIN, Integer.MAX_VALUE, "(", ops);
		addOperator(ExpressionToken.BRACKET_END, Integer.MAX_VALUE, ")", ops);
		
		addOperator(ExpressionToken.TYPE_GET_PROP, 12, ".", ops);
		addOperator(ExpressionToken.TYPE_GET_MEMBER_METHOD, 12, "", ops);
		addOperator(ExpressionToken.TYPE_GET_GLOBAL_METHOD, 12, "", ops);
		addOperator(ExpressionToken.TYPE_CALL_METHOD, 12, "", ops);

		addOperator(ExpressionToken.TYPE_NOT, 8, "!", ops);
		addOperator(ExpressionToken.TYPE_POS, 8, "+", ops);
		addOperator(ExpressionToken.TYPE_NEG, 8, "-", ops);

		addOperator(ExpressionToken.TYPE_MUL, 4, "*", ops);
		addOperator(ExpressionToken.TYPE_DIV, 4, "/", ops);
		addOperator(ExpressionToken.TYPE_MOD, 4, "%", ops);

		addOperator(ExpressionToken.TYPE_ADD, 1, "+", ops);
		addOperator(ExpressionToken.TYPE_SUB, 1, "-", ops);

		addOperator(ExpressionToken.TYPE_LT, 0, "<", ops);
		addOperator(ExpressionToken.TYPE_GT, 0, ">", ops);
		addOperator(ExpressionToken.TYPE_LTEQ, 0, "<=", ops);
		addOperator(ExpressionToken.TYPE_GTEQ, 0, ">=", ops);
		addOperator(ExpressionToken.TYPE_EQ, 0, "==", ops);
		addOperator(ExpressionToken.TYPE_NOTEQ, 0, "!=", ops);

		addOperator(ExpressionToken.TYPE_AND, -1, "&&", ops);
		addOperator(ExpressionToken.TYPE_OR, -2, "||", ops);

		addOperator(ExpressionToken.TYPE_QUESTION, -4, "?", ops);
		addOperator(ExpressionToken.TYPE_QUESTION_SELECT, -4, ":", ops);// !!

		addOperator(ExpressionToken.TYPE_OBJECT_SETTER, -7, ":", ops);// !!
		addOperator(ExpressionToken.TYPE_PARAM_JOIN, -8, ",", ops);

		OPS = ops.toArray(new String[ops.size()]);
	}

	private static final Map<String, ExpressionToken> CONSTAINS_MAP = new HashMap<String, ExpressionToken>();
	static {
		CONSTAINS_MAP.put("true", new ConstantsToken(Boolean.TRUE));
		CONSTAINS_MAP
				.put("false", new ConstantsToken(Boolean.FALSE));
		CONSTAINS_MAP.put("null", new ConstantsToken(null));
	}

	public ExpressionTokenStream(String value) {
		this.value = value.trim();
		this.end = this.value.length();
		parse();
		this.expression = toRight(this.tokens.iterator());
	}
	private boolean isHeighter(ExpressionToken privious,ExpressionToken item){
		return PRIORITY_MAP.get(item.getType()) > PRIORITY_MAP.get(privious.getType());
	}
	
	// 将中序表达式转换为右序表达式
	private List<ExpressionToken> toRight(Iterator<ExpressionToken> tokens) {
		ArrayList<ExpressionToken> right = new ArrayList<ExpressionToken>();// 存储右序表达式
		LinkedList<ExpressionToken> buffer = new LinkedList<ExpressionToken>();
		ExpressionToken operator;
		while (tokens.hasNext()) {
			ExpressionToken item = tokens.next();
			if (item instanceof OperatorToken) {
				if (buffer.isEmpty()
						|| item.getType() == ExpressionToken.BRACKET_BEGIN) {//("(")
					buffer.push(item);
				} else {
					if (item.getType() == ExpressionToken.BRACKET_END){//.equals(")")) {
						if (buffer.getFirst().getType() != ExpressionToken.BRACKET_BEGIN) {
						//if (!buffer.getFirst().equals("(")) {
							operator =  buffer.pop();
							right.add(operator);
						}
					} else {
						if (
								//Calculate.priority(item) <= Calculate.priority( buffer.getFirst())
								!isHeighter(buffer.getFirst(),item)
								&& !buffer.isEmpty()) {
							operator =  buffer.pop();
							if (operator.getType() != ExpressionToken.BRACKET_BEGIN){
							//if (!operator.equals("(")){
								right.add(operator);
							}
						}
						buffer.push(item);
					}
				}
			} else{
				right.add(item);
			}
		}
		while (!buffer.isEmpty()) {
			operator = buffer.pop();
			right.add(operator);
		}
		return right;
	}

	private void addToken(ExpressionToken token) {
		switch (token.getType()) {
		case ExpressionToken.BRACKET_BEGIN:
			status = BEGIN;
			break;
		case ExpressionToken.TYPE_CONSTANTS:
		case ExpressionToken.TYPE_VAR:
		case ExpressionToken.BRACKET_END:
			status = EXPRESSION;
			break;
		default:
			status = OPERATOR;
			break;
		}
		//previousType2 = previousType;
		previousType = token.getType();
		tokens.add(token);
	}

	private boolean isMapMethod() {
		int i = tokens.size() - 1;
		int depth = 0;
		for (; i >= 0; i--) {
			ExpressionToken token = tokens.get(i);
			int type = token.getType();
			if (type == ExpressionToken.BRACKET_BEGIN) {
				depth--;
			} else if (type == ExpressionToken.BRACKET_END) {
				depth++;
			}
			if(depth == -1){//<getGloablMethod> '#map' <callMethod>(
				if(i>=3){
					ExpressionToken token1 = tokens.get(i-3);
					ExpressionToken token3 = tokens.get(i-1);
					if(token1.getType() == ExpressionToken.TYPE_GET_GLOBAL_METHOD &&
							token3.getType() == ExpressionToken.TYPE_CALL_METHOD){
						ExpressionToken token2 = tokens.get(i-2);
						if(token2 instanceof ConstantsToken){
							return ExpressionToken.INTERNAL_METHOD_MAP.equals(((ConstantsToken)token2).getValue());
						}
					}
				}
				break;
			}
		}
		return false;
	}

	private void parse() {
		skipSpace();
		while (start < end) {
			char c = value.charAt(start);
			if (c == '"' || c == '\'') {
				String text = findString();
				addToken(new ConstantsToken(text));
			} else if (c >= '0' && c <= '9') {
				Number number = findNumber();
				addToken(new ConstantsToken(number));
			} else if (Character.isJavaIdentifierStart(c)) {
				String id = findId();
				ExpressionToken constains = CONSTAINS_MAP.get(id);
				if (constains == null) {
					skipSpace();
					if(start <end && '(' ==value.charAt(start)){//method call
						if (previousType == ExpressionToken.TYPE_GET_PROP) {
							addToken(OperatorToken.getToken(ExpressionToken.TYPE_GET_MEMBER_METHOD));
						}else{
						    addToken(OperatorToken.getToken(ExpressionToken.TYPE_GET_GLOBAL_METHOD));
						}
					} else if (previousType == ExpressionToken.TYPE_GET_PROP) {
						addToken(new ConstantsToken(id));
					} else if (previousType == ExpressionToken.TYPE_PARAM_JOIN
							&& isMapMethod()) {// object key
						addToken(new ConstantsToken(id));
					}else {
						addToken(new VarToken(id));
					}
				} else {
					addToken(constains);
				}
			} else {
				boolean missed = true;
				for (String op : OPS) {
					if (value.startsWith(op, start)) {
						missed = false;
						start += op.length();
						int flag = op.charAt(0);
						if(flag == '('){//method 已近简单处理了。不支持变量式函数
							addToken(OperatorToken.getToken(ExpressionToken.BRACKET_BEGIN));
						}else if(flag == '['){
							if(status == BEGIN){//list
								addToken(OperatorToken.getToken(ExpressionToken.TYPE_GET_GLOBAL_METHOD));
								addToken(new ConstantsToken(ExpressionToken.INTERNAL_METHOD_LIST));
								addToken(OperatorToken.getToken(ExpressionToken.TYPE_CALL_METHOD));
							}else if(status == EXPRESSION){//getProperty
							}else{
								throw new RuntimeException("语法错误:" + value + "@" + start);
							}
							addToken(OperatorToken.getToken(ExpressionToken.BRACKET_BEGIN));
							
						}else if(flag == '{'){
							addToken(OperatorToken.getToken(ExpressionToken.TYPE_GET_GLOBAL_METHOD));
							addToken(new ConstantsToken(ExpressionToken.INTERNAL_METHOD_MAP));
							addToken(OperatorToken.getToken(ExpressionToken.TYPE_CALL_METHOD));
							addToken(OperatorToken.getToken(ExpressionToken.BRACKET_BEGIN));
						}else if(flag == '}' || flag == ']'|| flag == ')'){
							addToken(OperatorToken.getToken(ExpressionToken.BRACKET_END));
						}else if(flag == ':'){//object_setter and ?:
							if(isMapMethod()){
								addToken(OperatorToken.getToken(ExpressionToken.TYPE_OBJECT_SETTER));
							}else{
								addToken(OperatorToken.getToken(ExpressionToken.TYPE_QUESTION_SELECT));
							}
						}else if(flag == '?'){//?:
							addToken(OperatorToken.getToken(ExpressionToken.TYPE_QUESTION));
							//addToken(OperatorToken.getToken(ExpressionToken.SKIP_QUESTION));
						}else if(flag == '|'){//||
							addToken(OperatorToken.getToken(ExpressionToken.TYPE_OR));
							//addToken(OperatorToken.getToken(ExpressionToken.SKIP_OR));
						}else if(flag == '&'){//&&
							addToken(OperatorToken.getToken(ExpressionToken.TYPE_OBJECT_SETTER));
							//addToken(OperatorToken.getToken(ExpressionToken.SKIP_AND));
						}else if(flag == '+'){//
							addToken(OperatorToken.getToken(status == OPERATOR ? ExpressionToken.TYPE_POS : ExpressionToken.TYPE_ADD));
							//addToken(OperatorToken.getToken(ExpressionToken.SKIP_AND));
						}else if(flag == '-'){//
							addToken(OperatorToken.getToken(status == OPERATOR ? ExpressionToken.TYPE_NEG :ExpressionToken.TYPE_SUB));
							//addToken(OperatorToken.getToken(ExpressionToken.SKIP_AND));
						}else{
							addToken(OperatorToken.getToken(TYPE_MAP.get(op)));
						}
						break;
					}
				}
				if (missed) {
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
						i--;
						break;
					}
				}
				return parseNumber(value.substring(start, start = i));
			} else if (c >= '0' && c <= '9') {
				while (i < end) {
					c = value.charAt(i++);
					if (c < '0' || c > '7') {
						i--;
						break;
					}
				}
				return parseNumber(value.substring(start, start = i));

			} else {
				i--;// next process
			}
		}
		while (i < end) {
			c = value.charAt(i++);
			if (c < '0' || c > '9') {
				i--;
				break;
			}
		}
		if (c == '.') {
			while (i < end) {
				c = value.charAt(i++);
				if (c < '0' || c > '9') {
					i--;
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
	public Iterator<ExpressionToken> iterator() {
		return expression.iterator();
	}

}
