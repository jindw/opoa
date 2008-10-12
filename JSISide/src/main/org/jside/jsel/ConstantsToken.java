package org.jside.jsel;

public class ConstantsToken implements ExpressionToken {
	private Object value;

	public ConstantsToken(Object value) {
		this.value = value;
	}

	public int getType() {
		return TYPE_CONSTANTS;
	}

	public Object getValue() {
		return value;
	}
}
