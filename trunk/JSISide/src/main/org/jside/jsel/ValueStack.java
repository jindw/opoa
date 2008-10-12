package org.jside.jsel;

public class ValueStack {
	private static int pos = -1;
	private Object[] data = new Object[2];  
	public Object top(){
		return data[pos];
	}
	public Object pop(){
		return data[pos--];
	}
	public Object push(Object value){
		return data[++pos] = value;
	}
	public boolean isEmpty(){
		return pos<0;
	}

}
