package org.jside.jsel;

import static org.junit.Assert.*;

import org.junit.Before;
import org.junit.Test;

public class ExpressionTokenizerTest {

	@Before
	public void setUp() throws Exception {
	}

	@Test
	public void testParse() {
		ExpressionTokenizer tokenizer =
			new ExpressionTokenizer("1+1+2");
		assertArrayEquals(tokenizer.toArray(), new ExpressionToken[]{
			new ConstantsToken(1),
			new ConstantsToken(1),
			new ConstantsToken(2),
			OperatorToken.getToken(ExpressionToken.TYPE_ADD),
			OperatorToken.getToken(ExpressionToken.TYPE_ADD)
		});
	}
}
