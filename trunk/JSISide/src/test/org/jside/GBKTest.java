package org.jside;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;

import org.junit.Assert;
import org.junit.Test;
import org.xidea.jsi.JSIRoot;
import org.xidea.jsi.impl.ClasspathJSIRoot;

public class GBKTest {
	@Test
	public void testImport(){
		JSIRoot root = new ClasspathJSIRoot("utf-8");
		root.$import("org.jside.*");
		root.$import("org.jside.decorator.*");
		root.$import("org.jside.template.*");
		root.$import("org.jside.sandbox.*");
	}
	/**
	 * @see http://www.xidea.org/topic/encoding/index.html
	 */
	private Map<Character, Character> gbk2unicode = new TreeMap<Character, Character>();
	
	/***
	 * A1A1->F7FE
	 */

	@Test
	public void testPrintGBK() throws Exception{
		StringBuilder buf = new StringBuilder();
		ByteArrayOutputStream out = new ByteArrayOutputStream();
		for(int i = 0xA1;i<=0xF7;i++){
			for(int j = 0xA1;j<=0xFE;j++){
				out.write(i);
				out.write(j);
				buf.append((char)((i<<8) | j));
				
			}
//			out.write((byte)'\r');
//			out.write((byte)'\n');
		}
		byte[] byte1 = out.toByteArray();

		String GBK = buf.toString();
		String result = new String(byte1,"GBK");
		char c = 0;
		int begin = 0;
		int count = 0;
		for(int i=0;i<result.length();i++){
			char c2 = result.charAt(i);
			if(c2 - c !=1){
				System.out.println(c2 + ":"+(i - begin));
				begin = i;
				count ++;
			}
			c = c2;
		}

		System.out.println(count);
		System.out.println(result.length());
		byte[] byte2 = result.getBytes("GBK");
		Assert.assertArrayEquals(byte1, byte2);
		//System.out.println(result);
	}
}
