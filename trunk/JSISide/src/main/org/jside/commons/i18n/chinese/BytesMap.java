/*
 * Created on 2004-11-7
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package org.jside.commons.i18n.chinese;

/**
 * @project JindwWeb
 * @author 金大为
 */
public interface BytesMap {
    public byte[] getSimplifiedWord(int c);

    public byte[] getTraditionalWord(int c);
}