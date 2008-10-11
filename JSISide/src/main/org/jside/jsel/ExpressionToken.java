package org.jside.jsel;

public abstract interface ExpressionToken {

	public static final int TYPE_CONSTANTS = 0;//'c';
	public static final int TYPE_NAME = 1;//'n';

	public static final int TYPE_PAREN_BEGIN = 2;//'(';
	public static final int TYPE_PAREN_END = 3;//')';
	
	public static final int TYPE_PROP_BEGIN = 4;//'[';
	public static final int TYPE_PROP_END = 5;//']';
	
	public static final int TYPE_OBJECT_BEGIN = 6;//'{';
	public static final int TYPE_OBJECT_END = 7;//'}';
	public static final int TYPE_OBJECT_COLON = 8;//':';
	
	public static final int TYPE_ADD = 9;//'+';
	public static final int TYPE_SUB = 10;//'-';
	
	public static final int TYPE_MUL = 11;//'*';
	public static final int TYPE_DIV = 12;//'/';
	public static final int TYPE_MOD = 13;//'%';
	public static final int TYPE_QUESTION = 14;//'?';
	public static final int TYPE_QUESTION_COLON = 15;//':';
	public static final int TYPE_PROP = 16;//'.';
	
	public static final int TYPE_LT = 17;//'<';
	public static final int TYPE_GT = 18;//'>';
	public static final int TYPE_LTEQ = 19;//('<' << 8) + '=';// '<=';
	public static final int TYPE_GTEQ = 20;//('>' << 8) + '=';// '>=';
	public static final int TYPE_EQ = 21;//('=' << 8) + '=';// '==';
	public static final int TYPE_NOTEQ = 22;//('!' << 8) + '=';// '!=';
	public static final int TYPE_AND = 23;//('&' << 8) + '&';
	public static final int TYPE_OR = 24;//('|' << 8) + '|';// '||';
	
	

	public static final int TYPE_NOT = 25;//'!';
	public static final int TYPE_POS = 26;//('+'<<8) + 'p';//負數
	public static final int TYPE_NEG = 27;//('-'<<8) + 'n';//負數

	public static final int TYPE_MEMBER_METHOD = 28;//('.'<<16) + ('('<<8) + ')';
	public static final int TYPE_GLOBAL_METHOD = 29;//('('<<8) + ')';
	public static final int TYPE_PARAM_END = 30;//('('<<8) + ')';
	
	
	

	public abstract int getType();
	
	public static class Constants implements ExpressionToken{
		private Object value;
		public Constants(Object value){
			this.value = value;
		}
		public int getType() {
			return TYPE_CONSTANTS;
		}
		public Object getValue(){
			return value;
		}
	}	
	public static class Operator implements ExpressionToken{
		private int type;
		private int length;
		public Operator(int type,int length){
			this.type = type;
			this.length = length;
		}
		public int getType() {
			return type;
		}
		public int getLength() {
			return length;
		}
		public void setLength(int length) {
			this.length = length;
		}
		
	}

	public class Id implements ExpressionToken{
		private String value;
		public Id(String value){
			this.value = value;
		}
		public int getType() {
			return TYPE_CONSTANTS;
		}
		public String getValue(){
			return value;
		}
	}

}
