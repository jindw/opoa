package org.jside.jsel;

public abstract class ExpressionToken {
	public static final int TYPE_CONSTANTS = 0;
	public static final int TYPE_NAME = -1;
	
	public static final int TYPE_LBRACK = '[';
	public static final int TYPE_RBRACK = ']';
	public static final int TYPE_LBRACE = '{';
	public static final int TYPE_RBRACE = '}';
	public static final int TYPE_LPAREN = '(';
	public static final int TYPE_RPAREN = ')';
	

	public static final int TYPE_ADD = '+';
	public static final int TYPE_SUB = '-';
	
	
	public static final int TYPE_MULTIPLY = '*';
	public static final int TYPE_DIVIDE = '/';
	public static final int TYPE_PERCENT = '%';
	public static final int TYPE_QUESTION = '?';
	public static final int TYPE_COLON = ':';
	
	public static final int TYPE_PROP = 'p';
	
	
	public static final int TYPE_LT = '<';
	public static final int TYPE_GT = '>';
	public static final int TYPE_LTEQ = ('<' << 8) + '=';// '<=';
	public static final int TYPE_GTEQ = ('>' << 8) + '=';// '>=';
	public static final int TYPE_EQ = ('=' << 8) + '=';// '==';
	public static final int TYPE_NOTEQ = ('!' << 8) + '=';// '!=';
	public static final int TYPE_AND = ('&' << 8) + '&';
	public static final int TYPE_OR = ('|' << 8) + '|';// '||';
	
	

	public static final int TYPE_NOT = '!';
	public static final int TYPE_POS = ('+'<<8) + 'p';//負數
	public static final int TYPE_NEG = ('-'<<8) + 'n';//負數

	public static final int TYPE_MEMBER_METHOD = ('.'<<16) + ('('<<8) + ')';
	public static final int TYPE_GLOBAL_METHOD = ('('<<8) + ')';


	public boolean isOperator() {
		return this.getType() > 0;
	}

	public abstract int getType();

}
