/*
 * Created on 2004-11-7
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package org.jside.commons.i18n.web.chinese.utf8;

import java.io.IOException;
import java.io.OutputStream;
import java.io.UTFDataFormatException;


import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jside.commons.i18n.chinese.impl.UnicodeCharMap;


/**
 * @project JindwWeb
 * @author 金大为
 */
public class TraditionalOutputStream extends OutputStream {
    /**
     * Logger for this class
     */
    private static final Log log = LogFactory.getLog(TraditionalOutputStream.class);

    public static final int STATUS_UNKOWN = 0;

    public static final int STATUS_SIZE1 = 1;

    public static final int STATUS_SIZE21 = 2;

    public static final int STATUS_SIZE22 = 3;

    public static final int STATUS_SIZE31 = 4;

    public static final int STATUS_SIZE32 = 5;

    public static final int STATUS_SIZE33 = 6;

    private static UnicodeCharMap utf8 = UnicodeCharMap.instance();

    private OutputStream output;

    private int status = 0;

    private byte[] temp = new byte[3];

    private int value = 0;

    public TraditionalOutputStream(OutputStream out) throws IOException {
        super();
        log.debug("UTF8Stream() - stream initialize");
        this.output = out;

    }
//    public void print(char c)throws java.io.IOException{
//        System.out.println(c);
//        super.print(c);
//    }

    public void write(int b) throws java.io.IOException {
        //System.out.println(b);
        b&=0xff;
        switch (status) {
        case STATUS_UNKOWN:
            if (b <= 0x07F) {//结束标记/*0xxx xxxx*/
                //System.out.println(0);
                //System.out.println((char)b);
                //if ((i >= 0x0001) && (i <= 0x007F)) {
                output.write(b);
                this.status = STATUS_UNKOWN;
            } else if (b > 0xe0) {/* 1110 xxxx 10xx xxxx 10xx xxxx */
                this.status = STATUS_SIZE32;
                this.temp[0] = (byte) b;
                this.value = (b & 0x0F) << 12;
            } else {/* 110x xxxx 10xx xxxx */
                this.status = STATUS_SIZE22;
                this.temp[0] = (byte) b;
                this.value = (b & 0x1F) << 6;
            }
            break;
        case STATUS_SIZE32:
            this.value |= ((b & 0x3F) << 6);
            this.temp[1] = (byte) b;
            this.status = STATUS_SIZE33;
            //System.out.println(value);
            break;

        case STATUS_SIZE22://结束标记
        {
            this.value |= (b & 0x3F);
            int hit = utf8.getTraditionalWord((char)this.value,temp);
            if (hit < 1) {
                output.write(temp[0]);
                output.write((byte) b);
                //System.out.println((char)value);
            } else {
                output.write(temp,0,hit);
                //System.out.println(temp);
            }
            this.status = STATUS_UNKOWN;
            break;
        }

        case STATUS_SIZE33://结束标记
        {
            this.value |= (b & 0x3F);
            int hit = utf8.getTraditionalWord((char)this.value,temp);
            if (hit < 1) {
                output.write(temp[0]);
                output.write(temp[1]);
                output.write((byte) b);
                //System.out.println((char)value);
            } else {
                output.write(temp,0,hit);
                //System.out.println(temp);
            }
            this.status = STATUS_UNKOWN;
            //System.out.println(value);
            break;
        }
        default:
            throw new UTFDataFormatException("非法UTF块"+this.status);
        }

    }

    public void close() throws java.io.IOException {
        log.debug("close() - start");

        output.close();

        log.debug("close() - end");
    }

    public void flush() throws java.io.IOException {
        log.debug("flush() - start");

        output.flush();

        log.debug("flush() - end");
    }

}

