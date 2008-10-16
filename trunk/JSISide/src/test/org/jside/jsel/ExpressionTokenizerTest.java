package org.jside.jsel;

import static org.junit.Assert.*;

import org.junit.Before;
import org.junit.Test;

public class ExpressionTokenizerTest {

	@Before
	public void setUp() throws Exception {
	}

	@Test
	public void test3op() {
		ExpressionTokenizer tokenizer = new ExpressionTokenizer("1+1+2");
		
	}

	@Test
	public void testSimple() {
		ExpressionTokenizer tokenizer = new ExpressionTokenizer("1+1+2");
		assertArrayEquals(new ExpressionToken[] { new ConstantsToken(1),
				new ConstantsToken(1),
				OperatorToken.getToken(ExpressionToken.TYPE_ADD),
				new ConstantsToken(2),
				OperatorToken.getToken(ExpressionToken.TYPE_ADD) }, tokenizer
				.toArray());

		tokenizer = new ExpressionTokenizer("1+(1+2)");
		assertArrayEquals(new ExpressionToken[] { new ConstantsToken(1),
				new ConstantsToken(1), new ConstantsToken(2),
				OperatorToken.getToken(ExpressionToken.TYPE_ADD),
				OperatorToken.getToken(ExpressionToken.TYPE_ADD) }, tokenizer
				.toArray());

		tokenizer = new ExpressionTokenizer("1+1*2");
		assertArrayEquals(new ExpressionToken[] { new ConstantsToken(1),
				new ConstantsToken(1), new ConstantsToken(2),
				OperatorToken.getToken(ExpressionToken.TYPE_MUL),
				OperatorToken.getToken(ExpressionToken.TYPE_ADD) }, tokenizer
				.toArray());

		tokenizer = new ExpressionTokenizer("1||2");
		assertArrayEquals(new ExpressionToken[] { new ConstantsToken(1),
				new LazyToken(), new ConstantsToken(2),
				LazyToken.LAZY_TOKEN_END,
				OperatorToken.getToken(ExpressionToken.TYPE_OR) }, tokenizer
				.toArray());

		tokenizer = new ExpressionTokenizer("1||1&&2");
		assertArrayEquals(new ExpressionToken[] { new ConstantsToken(1),
				new LazyToken(), new ConstantsToken(1), new LazyToken(),
				new ConstantsToken(2), LazyToken.LAZY_TOKEN_END,
				OperatorToken.getToken(ExpressionToken.TYPE_AND),
				LazyToken.LAZY_TOKEN_END,
				OperatorToken.getToken(ExpressionToken.TYPE_OR)

		}, tokenizer.toArray());
	}
}
