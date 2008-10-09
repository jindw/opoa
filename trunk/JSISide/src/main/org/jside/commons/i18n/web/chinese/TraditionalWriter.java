/*
 * Created on 2004-11-7
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package org.jside.commons.i18n.web.chinese;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.Writer;

import org.jside.commons.i18n.chinese.CharMap;
import org.jside.commons.i18n.chinese.impl.UnicodeCharMap;

/**
 * @project JindwWeb
 * @author 金大为
 */
public class TraditionalWriter extends PrintWriter {

	private static CharMap utf8 = UnicodeCharMap.instance();

	public TraditionalWriter(final PrintWriter writer) {
		super(new Writer() {
			@Override
			public void close() throws IOException {
				writer.close();

			}

			@Override
			public void flush() throws IOException {
				writer.flush();
			}

			public void write(int c) {
				// TODO Auto-generated method stub
				writer.write(utf8.getTraditionalWord((char) c));
			}

			public void write(char cbuf[], int off, int len) {
				// System.out.println(cbuf);
				for (int i = off; i < len; i++) {
					cbuf[i] = utf8.getTraditionalWord(cbuf[i]);
				}
				writer.write(cbuf, off, len);
			}

		}, true);
	}
}