/*
 * Created on 2004-11-7
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package org.jside.commons.i18n.web.chinese;

import java.io.IOException;
import java.util.Locale;

import javax.servlet.http.HttpServletResponse;

import org.jside.commons.i18n.web.chinese.utf8.SimplifiedOutputStream;
import org.jside.commons.i18n.web.chinese.utf8.TraditionalOutputStream;



/**
 * @project JindwWeb
 * @author 金大为
 */
public abstract class ResponseWrapperFactory  {
    public static ResponseWrapperFactory newInstance(Locale locale, String simpEnc, String tradEnc){
        return new SimpleResponseWrapperFactory(locale);
    }
    public abstract ResponseWrapper newTraditionalWrapper(HttpServletResponse response) throws IOException;
    public abstract ResponseWrapper newSimplifiedWrapper(HttpServletResponse response) throws IOException;
}
class SimpleResponseWrapperFactory extends ResponseWrapperFactory {
    public boolean isTraditionalDefault = false;
    public boolean isSimplifiedDefault = false;
    
    public SimpleResponseWrapperFactory(Locale locale){
        if(Locale.CHINA.equals(locale)){
            isSimplifiedDefault = true;
        }else if(Locale.TAIWAN.equals(locale)){
            isTraditionalDefault = true;
        }
    }

    public ResponseWrapper newTraditionalWrapper(HttpServletResponse response) throws IOException{
        ResponseWrapper wrapper = new ResponseWrapper(response);
        wrapper.setWriterClass(TraditionalWriter.class);
        wrapper.setStreamClass(TraditionalOutputStream.class);
        return wrapper;
    }
    public ResponseWrapper newSimplifiedWrapper(HttpServletResponse response) throws IOException{
        ResponseWrapper wrapper = new ResponseWrapper(response);
        wrapper.setWriterClass(SimplifiedWriter.class);
        wrapper.setStreamClass(SimplifiedOutputStream.class);
        return wrapper;
    }
}