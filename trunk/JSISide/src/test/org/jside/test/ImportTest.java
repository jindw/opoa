package org.jside.test;

import java.io.File;

import org.junit.Test;
import org.xidea.jsi.JSIRoot;
import org.xidea.jsi.impl.FileJSIRoot;

public class ImportTest {
	@Test
	public void testImport(){
		JSIRoot root = new FileJSIRoot("C:\\Users\\ut\\workspace\\JSISide\\web\\scripts","utf-8");
		root.$import("org.jside.*");
		root.$import("org.jside.decorator.*");
	}

}
