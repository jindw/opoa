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
public interface CharMap {
    public char getSimplifiedWord(char c);

    public int getSimplifiedWord(char c, byte[] data);

    public char getTraditionalWord(char c);

    public int getTraditionalWord(char c, byte[] data);
}