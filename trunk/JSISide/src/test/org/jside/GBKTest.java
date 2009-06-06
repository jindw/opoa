package org.jside;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.nio.charset.Charset;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.TreeMap;

import org.junit.Assert;
import org.junit.Test;
import org.xidea.jsi.JSIRoot;
import org.xidea.jsi.impl.ClasspathRoot;

import sun.misc.BASE64Encoder;

public class GBKTest {
	@Test
	public void testImport() {
		JSIRoot root = new ClasspathRoot("utf-8");
		root.$import("org.jside.*");
		root.$import("org.jside.decorator.*");
		root.$import("org.jside.template.*");
		root.$import("org.jside.sandbox.*");
	}
	byte[] index1 = {0x01, 0x02, 0x03, 0x04, 0x05, 0x00,
			0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
			0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
			0x00, 0x00, 0x00, 0x00, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c,
			0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0d, 0x0e,
			0x0f, 0x10, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
			0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
			0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x11, 0x12, 0x13, 0x14, 0x15,
			0x16, 0x17, 0x18, 0x19, 0x1a, 0x1b, 0x1c, 0x1d, 0x1e, 0x1f, 0x20,
			0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2a, 0x2b,
			0x2c, 0x2d, 0x2e, 0x2f, 0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36,
			0x37, 0x38, 0x39, 0x3a, 0x3b, 0x3c, 0x3d, 0x3e, 0x3f, 0x40, 0x41,
			0x42, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49, 0x4a, 0x4b, 0x4c,
			0x4d, 0x4e, 0x4f, 0x50, 0x51, 0x52, 0x53, 0x54, 0x55, 0x56, 0x57,
			0x58, 0x59, 0x5a, 0x5b, 0x5c, 0x5d, 0x5e, 0x5f, 0x60, 0x61, 0x62,
			0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
			0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
			0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
			0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
			0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
			0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x63, 0x64,
			0x65, 0x66, 0x67, 0x68, 0x69, 0x6a, 0x6b, 0x00, 0x00, 0x00, 0x00,
			0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
			0x00, 0x6c, 0x6d, 0x00, 0x00, 0x00, 0x6e, 0x6f};


	/**
	 * @see http://www.xidea.org/topic/encoding/index.html
	 */
	private Map<Character, Character> gbk2unicode = new TreeMap<Character, Character>();

	@Test
	public void printIndex1() throws Exception {
				String base64 = new BASE64Encoder().encode(index1).replaceAll("[\r\n]","");
		System.out.println('"'+base64+'"');
	}
	@Test
	public void printGB2312() throws Exception {
		HashMap<Integer,Integer> set = new HashMap<Integer,Integer>();
		for (int i = 0xA1; i <= 0xF7; i++) {
			for (int j = 0xA1; j <= 0xFE; j++) {
				char ch = new String(new byte[] { (byte) i, (byte) j }, "GB2312")
						.charAt(0);
				
				int offset = index1[ch >> 8] << 8;// index1[0xAB]00
				int dataIndex = offset >> 12;
				Integer count = set.get(dataIndex);
				if(count == null){
					set.put(dataIndex,1);
				}else{
					set.put(dataIndex,count+1);
				}
			}
		}
		System.out.println(set);
	
	}
	@Test
	public void printIndex2() throws Exception {
		int count = 0;
		for (String str : GBKEncoder.index2) {
			count+=str.length();
//			StringBuilder buf = new StringBuilder("\"");
//			
//			for (int i = 0; i < str.length(); i++) {
//				String c = str.substring(i, i + 1);
//				if (c.equals(new String(c.getBytes("GBK"), "GBK"))) {
//					buf.append(c);
//				} else {
//					buf.append("\\u"
//							+ Integer.toHexString(0x10000 + str.charAt(i))
//									.substring(1));
//				}
//			}
//			buf.append("\"");
//			String text = buf.toString();
//			
			//String base64 = new BASE64Encoder().encode(str.getBytes("UTF-16BE")).replaceAll("[\r\n]","");
			//System.out.println('"'+base64+'"');
			System.out.println(str.length());
		}
		System.out.println(Integer.toHexString(count));
		System.out.println(Charset.availableCharsets());
		byte[] test = "\u110f".getBytes("UTF-16BE");
		Assert.assertArrayEquals(new byte[]{test[0],test[1]}, new byte[]{0x11,0x0f});
		
	}

	/***************************************************************************
	 * A1A1->F7FE
	 */
	@Test
	public void testPrintGBK1() throws Exception {
		StringBuilder buf = new StringBuilder();
		ByteArrayOutputStream out = new ByteArrayOutputStream();
		System.out.println("#begin");
		//for (int i = 0xA1; i <= 0xF7; i++) {
			//for (int j = 0xA1; j <= 0xFE; j++) {
		for (int i = 0x81; i <= 0xFE; i++) {
			for (int j = 0x80; j <= 0xFE; j++) {
				out.write(i);
				out.write(j);
			}
		}
		for (int i = 0x81; i <= 0xFE; i++) {
			for (int j = 0x40; j <= 0x7E; j++) {
				out.write(i);
				out.write(j);
			}
		}
		
		String text = new String(out.toByteArray(),"GBK");
		int max = 0;
		int min = 0xFFFF;
		int i = text.length();
		while(i-->0){
			char c = text.charAt(i);
			//System.out.println(Integer.toHexString(c));
			max = Math.max(c, max);
			min = Math.min(c, min);
		}

		char[] cs = text.toCharArray();
		Arrays.sort(cs);
		int begin = 0;
		char pre = cs[0];
		for (int j = 1; j < cs.length; j++) {
			char c = cs[j];
			if(c != pre+1){
				System.out.println(Integer.toHexString(cs[begin])+"=>"+(j-begin)+":"+Integer.toString((int)c -(int)pre));
				begin=j;
			}
			pre = c;
		}
		System.out.println(Integer.toHexString(begin)+":"+(begin-pre+1));
		
		System.out.println();
		System.out.println(Integer.toHexString(max));
		System.out.println(Integer.toHexString(min));
		System.out.println(cs.length);
	}

	@Test
	public void testPrintGBK() throws Exception {
		StringBuilder buf = new StringBuilder();
		ByteArrayOutputStream out = new ByteArrayOutputStream();
		int success = 0;
		int faild = 0;
		System.out.println("#begin");
		for (int i = 0xA1; i <= 0xF7; i++) {
			for (int j = 0xA1; j <= 0xFE; j++) {
				out.write(i);
				out.write(j);
				char gbc = (char) ((i << 8) | j);
				buf.append(gbc);
				byte[] data = new byte[] { (byte) i, (byte) j };
				String s = new String(data);
				byte[] byte2 = s.getBytes("GB2312");
				if (byte2.length == 2 && byte2[0] == data[0]
						&& byte2[1] == data[1]) {
					int result = GBKEncoder.encodeDouble(s.charAt(0));
					Assert.assertTrue(result == gbc);
					success++;
				} else {
					System.out.println(new String(data, "GBK") + ":"
							+ Integer.toHexString((int) gbc));
					faild++;
				}

			}
			// out.write((byte)'\r');
			// out.write((byte)'\n');
		}
		System.out.println(success);
		System.out.println(faild);
		System.out.println("#end");

		byte[] byte1 = out.toByteArray();

		String GBK = buf.toString();
		String result = new String(byte1, "GBK");
		char c = 0;
		int begin = 0;
		int count = 0;
		for (int i = 0; i < result.length(); i++) {
			char c2 = result.charAt(i);
			if (c2 - c != 1) {
				// System.out.println(c2 + ":"+(i - begin));
				begin = i;
				count++;
			}
			char c3 = GBK.charAt(i);
			System.out.println(Integer.toHexString(c2) + ":"
					+ Integer.toHexString(c3) + ":"
					+ Integer.toHexString(c3 - c2));
			c = c2;
		}

		System.out.println(count);
		System.out.println(result.length());
		byte[] byte2 = result.getBytes("GBK");
		Assert.assertArrayEquals(byte1, byte2);
		// System.out.println(result);
	}
}
