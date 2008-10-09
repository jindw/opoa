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

import org.jside.commons.i18n.chinese.CharMap;



/**
 * @project JindwWeb
 * @author 金大为
 */
public class UnicodeCharMap implements CharMap {
    private static UnicodeCharMap instance;
    public static UnicodeCharMap instance(){
        if(instance == null){
            instance = new UnicodeCharMap();
            try {
                instance.initialize();
            } catch (IOException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
        return instance;
    }
    protected static char[] S2T;

    protected static char[] T2S;

    public char getSimplifiedWord(char c){
        if(T2S[c]<=0x007F){
            return c;
        }
        return T2S[c];
    }
    public int getSimplifiedWord(char c,byte[] data){
        c= T2S[c];
        if (c <= 0x007F) {
            //if ((c >= 0x0001) && (c <= 0x007F)) {
            return -1;
        } else if (c > 0x07FF) {
            data[0]=(byte) (0xE0 | ((c >> 12) & 0x0F));
            data[1]=(byte) (0x80 | ((c >> 6) & 0x3F));
            data[2]=(byte) (0x80 | ((c >> 0) & 0x3F));
            return 3;
        } else {
            data[0]=(byte) (0xC0 | ((c >> 6) & 0x1F));
            data[1]=(byte) (0x80 | ((c >> 0) & 0x3F));
            return 2;
        }
    }
    public char getTraditionalWord(char c){
        if(S2T[c]<=0x007F){
            return c;
        }
        return S2T[c];
    }
    public int getTraditionalWord(char c,byte[] data){
        c= S2T[c];
        if (c <= 0x007F) {
            //if ((c >= 0x0001) && (c <= 0x007F)) {
            return -1;
        } else if (c > 0x07FF) {
            data[0]=(byte) (0xE0 | ((c >> 12) & 0x0F));
            data[1]=(byte) (0x80 | ((c >> 6) & 0x3F));
            data[2]=(byte) (0x80 | ((c >> 0) & 0x3F));
            return 3;
        } else {
            data[0]=(byte) (0xC0 | ((c >> 6) & 0x1F));
            data[1]=(byte) (0x80 | ((c >> 0) & 0x3F));
            return 2;
        }
    }
    
    
    
    


    protected void initialize() throws IOException {
        if ((S2T == null) && (T2S == null)) {
            char[] sws, tws;
            char[][] temp = loadOriginalChars();
            sws = temp[0];
            tws = temp[1];

            S2T =  new char[Character.MAX_VALUE+1];
            T2S =  new char[Character.MAX_VALUE+1];
            initialize(sws, tws, UnicodeCharMap.S2T);
            initialize(tws, sws, UnicodeCharMap.T2S);
        } else if (S2T == null) {
            initializeS2T();
        } else if (T2S == null) {
            initializeT2S();
        }
    }
    protected void initializeS2T() throws IOException {
        if (S2T != null) {
            char[] sws, tws;
            char[][] temp = loadOriginalChars();
            sws = temp[0];
            tws = temp[1];
            S2T = new char[Character.MAX_VALUE+1];
            initialize(sws, tws, UnicodeCharMap.S2T);

        }
    }

    protected void initializeT2S() throws IOException {
        if (T2S != null) {
            char[] sws, tws;
            char[][] temp = loadOriginalChars();
            sws = temp[0];
            tws = temp[1];
            T2S =  new char[Character.MAX_VALUE+1];
            initialize(tws, sws, UnicodeCharMap.T2S);
        }
    }
    private void initialize(char[] ws1, char[] ws2, char[] dest) {
        for (int i = 0; i < ws1.length; i++) {
            dest[ws1[i]] = ws2[i];
        }
    }
    public int getUTFBytes(char c,byte[] data){
        if (c <= 0x007F) {
            //if ((c >= 0x0001) && (c <= 0x007F)) {
            data[0]=(byte) c;
            return 1;
        } else if (c > 0x07FF) {
            data[0]=(byte) (0xE0 | ((c >> 12) & 0x0F));
            data[1]=(byte) (0x80 | ((c >> 6) & 0x3F));
            data[2]=(byte) (0x80 | ((c >> 0) & 0x3F));
            return 3;
        } else {
            data[0]=(byte) (0xC0 | ((c >> 6) & 0x1F));
            data[1]=(byte) (0x80 | ((c >> 0) & 0x3F));
            return 2;
        }
        
    }
    /**
     * 
     * @return char[2][] char[0]简体；char[1]繁体。
     * @throws IOException
     */
    protected char[][] loadOriginalChars() throws IOException {
        char[] sws, tws;
        
        //CharBuffer buf = CharBuffer.allocate(4664);
        CharBuffer buf = CharBuffer.allocate(4666);
        InputStream in = null;
        in = UnicodeCharMap.class.getResourceAsStream("s-unicode.dat");
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
        in = UnicodeCharMap.class.getResourceAsStream("t-unicode.dat");
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
}