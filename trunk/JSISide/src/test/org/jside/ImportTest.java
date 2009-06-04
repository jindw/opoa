package org.jside;

import java.io.File;

import org.junit.Test;
import org.xidea.jsi.JSIRoot;
import org.xidea.jsi.impl.ClasspathRoot;

public class ImportTest {
	@Test
	public void testImport(){
		JSIRoot root = new ClasspathRoot("utf-8");
		root.$import("org.jside.*");
		root.$import("org.jside.decorator.*");
		root.$import("org.jside.template.*");
		root.$import("org.jside.sandbox.*");
	}

}
