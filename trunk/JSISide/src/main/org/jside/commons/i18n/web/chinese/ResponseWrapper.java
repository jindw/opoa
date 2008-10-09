/*
 * Created on 2004-11-7
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package org.jside.commons.i18n.web.chinese;

import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.lang.reflect.Constructor;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * @project JindwWeb
 * @author 金大为
 */
public class ResponseWrapper extends HttpServletResponseWrapper {

    /**
     * Logger for this class
     */
    private static final Log log = LogFactory.getLog(ResponseWrapper.class);

    private Class writerClass;

    private Class streamClass;

    private HttpServletResponse response;

    public ResponseWrapper(HttpServletResponse response)
            throws java.io.IOException {

        super((HttpServletResponse) response);
        this.response = response;
    }

    public ServletOutputStream getOutputStream() throws java.io.IOException {
        log.debug("getOutputStream() - start");
        final ServletOutputStream stream = response.getOutputStream();
        try {
            ServletOutputStream streamWrapper = new ServletOutputStream() {
                OutputStream impl = (OutputStream) streamClass
                        .getConstructor(new Class[] { OutputStream.class })
                        .newInstance(
                                new OutputStream[] { stream });

                public void write(int b) throws IOException {
                    impl.write(b);
                }
            };
            return streamWrapper;
        } catch (Throwable e) {
            log.error("构造PrintWriter失败：" , e);
            return stream;
        }
    }

    public PrintWriter getWriter() throws java.io.IOException {
        final PrintWriter writer = response.getWriter();
        try {
            Constructor constructor = writerClass
                    .getConstructor(new Class[] { PrintWriter.class });
            return (PrintWriter) constructor
                    .newInstance(new PrintWriter[] { writer });
        } catch (Throwable e) {
            log.error("构造PrintWriter失败：" , e);
            return writer;
        }
    }

    /**
     * @return Returns the streamClass.
     */
    Class getStreamClass() {
        return streamClass;
    }

    /**
     * @param streamClass
     *            The streamClass to set.
     */
    void setStreamClass(Class streamClass) {
        this.streamClass = streamClass;
    }

    /**
     * @return Returns the writerClass.
     */
    Class getWriterClass() {
        return writerClass;
    }

    /**
     * @param writerClass
     *            The writerClass to set.
     */
    void setWriterClass(Class writerClass) {
        this.writerClass = writerClass;
    }
}