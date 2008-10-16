package org.jside.jsel;

public class LazyToken implements ExpressionToken {
	private int step = -1;
	public static final ExpressionToken LAZY_TOKEN_END = new ExpressionToken(){
		public int getType() {
			return SKIP_END;
		}
	};
	
	public LazyToken() {
	}
	public int getType() {
		return SKIP_BEGIN;
	}
	public int getStep() {
		return step;
	}
	public void setStep(int step) {
		this.step = step;
	}
}
