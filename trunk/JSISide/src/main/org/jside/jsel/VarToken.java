package org.jside.jsel;

public class VarToken implements ExpressionToken{
	public static final VarToken LazyToken = new VarToken("#"); 
	private String value;
	public VarToken(String value){
		this.value = value;
	}
	public int getType() {
		return TYPE_CONSTANTS;
	}
	public String getValue(){
		return value;
	}
}