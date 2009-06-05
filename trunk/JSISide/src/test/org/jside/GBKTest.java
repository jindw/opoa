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
import org.xidea.jsi.impl.ClasspathRoot;

public class GBKTest {
	@Test
	public void testImport(){
		JSIRoot root = new ClasspathRoot("utf-8");
		root.$import("org.jside.*");
		root.$import("org.jside.decorator.*");
		root.$import("org.jside.template.*");
		root.$import("org.jside.sandbox.*");
	}
	/**
	 * @see http://www.xidea.org/topic/encoding/index.html
	 */
	private Map<Character, Character> gbk2unicode = new TreeMap<Character, Character>();
	

	@Test
	public void printIndex() throws Exception{
		for (String str :GBKEncoder.index2) {
			StringBuilder buf = new StringBuilder();
			for (int i = 0; i < str.length(); i++) {
				String c = str.substring(i,i+1);
				if(c.equals(new String(c.getBytes("GBK"),"GBK"))){
					buf.append(c);
				}else{
					buf.append("\\u"+Integer.toHexString(0x10000+ str.charAt(i)).substring(1));
				}
			}
			System.out.println(buf);
		}
	}
	/***
	 * A1A1->F7FE
	 */
	@Test
	public void testPrintGBK() throws Exception{
		StringBuilder buf = new StringBuilder();
		ByteArrayOutputStream out = new ByteArrayOutputStream();
		int success = 0;
		int faild = 0;
		System.out.println("#begin");
		for(int i = 0xA1;i<=0xF7;i++){
			for(int j = 0xA1;j<=0xFE;j++){
				out.write(i);
				out.write(j);
				char gbc = (char)((i<<8) | j);
				buf.append(gbc);
				byte[] data = new byte[]{(byte)i,(byte)j};
				String s = new String(data);
				byte[] byte2= s.getBytes("GB2312");
				if(byte2.length == 2 && byte2[0] == data[0] &&byte2[1] == data[1]){
					int result = GBKEncoder.encodeDouble(s.charAt(0));
					Assert.assertTrue(result == gbc);
					success ++;
				}else{
					System.out.println(new String(data,"GBK") +":" +Integer.toHexString((int)gbc));
					faild++;
				}
				
			}
//			out.write((byte)'\r');
//			out.write((byte)'\n');
		}
		System.out.println(success);
		System.out.println(faild);
		System.out.println("#end");
		
		byte[] byte1 = out.toByteArray();

		String GBK = buf.toString();
		String result = new String(byte1,"GBK");
		char c = 0;
		int begin = 0;
		int count = 0;
		for(int i=0;i<result.length();i++){
			char c2 = result.charAt(i);
			if(c2 - c !=1){
				//System.out.println(c2 + ":"+(i - begin));
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
