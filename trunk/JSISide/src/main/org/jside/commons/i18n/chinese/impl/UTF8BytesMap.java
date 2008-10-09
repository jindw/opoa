/*
 * Created on 2004-11-6
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package org.jside.commons.i18n.chinese.impl;

import java.io.IOException;
import java.io.InputStream;
import java.nio.CharBuffer;

import org.jside.commons.i18n.chinese.BytesMap;



/**
 * @project JindwWeb
 * @author 金大为
 */
public class UTF8BytesMap implements BytesMap {
    private static UTF8BytesMap instance;
    public static UTF8BytesMap instance() {
        if(instance == null){
            instance = new UTF8BytesMap();
            try {
                instance.initialize();
            } catch (IOException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
        return instance;
    }
    protected static byte[][] S2T;

    protected static byte[][] T2S;

    public byte[] getSimplifiedWord(int c){
        return T2S[c];
    }
    public byte[] getTraditionalWord(int c){
        return S2T[c];
    }




    private char[][] loadOriginalChars() throws IOException {
        char[] sws, tws;
        
        //CharBuffer buf = CharBuffer.allocate(4664);
        CharBuffer buf = CharBuffer.allocate(4666);
        InputStream in = null;
        in = UTF8BytesMap.class.getResourceAsStream("s-unicode.dat");
        for (int b = 0; (b = in.read()) >= 0;) {
            b = ((in.read() << 8) | b);
            //System.out.println((char)b);
            buf.put((char) b);
        }
        final int size = buf.position()-2;
        sws = new char[size];
        buf.position(2);
        buf.get(sws);
        buf.position(0);
        in = UTF8BytesMap.class.getResourceAsStream("t-unicode.dat");
        for (int b = 0; (b = in.read()) >= 0;) {
            b = ((in.read() << 8) | b);
            buf.put((char) b);
        }
        if(buf.position()-size!=2){
            throw new RuntimeException("简繁资源文件不匹配");
        }
        tws = new char[size];
        buf.position(2);
        buf.get(tws);
        buf = null;
        return new char[][]{sws,tws};
    }
    
    private void initializeS2T() throws IOException {
        if (S2T != null) {
            char[] sws, tws;
            char[][] temp = loadOriginalChars();
            sws = temp[0];
            tws = temp[1];
            S2T = new byte[Character.MAX_VALUE][];
            initialize(sws, tws, UTF8BytesMap.S2T);

        }
    }

    private void initializeT2S() throws IOException {
        if (T2S != null) {
            char[] sws, tws;
            char[][] temp = loadOriginalChars();
            sws = temp[0];
            tws = temp[1];
            T2S = new byte[Character.MAX_VALUE][];
            initialize(tws, sws, UTF8BytesMap.T2S);
        }
    }

    private void initialize() throws IOException {
        if ((S2T == null) && (T2S == null)) {
            char[] sws, tws;
            char[][] temp = loadOriginalChars();
            sws = temp[0];
            tws = temp[1];

            S2T = new byte[Character.MAX_VALUE][];
            T2S = new byte[Character.MAX_VALUE][];

            initialize(sws, tws, UTF8BytesMap.S2T);
            initialize(tws, sws, UTF8BytesMap.T2S);
        } else if (S2T == null) {
            initializeS2T();
        } else if (T2S == null) {
            initializeT2S();
        }
    }
    private void initialize(char[] ws1, char[] ws2, byte[][] dest) {
        for (int c, i = 0; i < ws1.length; i++) {
            c = ws2[i];
            byte[] data;
            if ((c >= 0x0001) && (c <= 0x007F)) {
                data = new byte[] { (byte) c };
            } else if (c > 0x07FF) {
                data = new byte[] { (byte) (0xE0 | ((c >> 12) & 0x0F)),
                        (byte) (0x80 | ((c >> 6) & 0x3F)),
                        (byte) (0x80 | ((c >> 0) & 0x3F)) };
            } else {
                data = new byte[] { (byte) (0xC0 | ((c >> 6) & 0x1F)),
                        (byte) (0x80 | ((c >> 0) & 0x3F)) };
            }
            //System.out.println((int)ws2[i]+"\t"+(int)ws1[i]);
            dest[ws1[i]] = data;
        }
    }
}