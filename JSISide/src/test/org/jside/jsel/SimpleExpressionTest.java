package org.jside.jsel;

import static org.junit.Assert.*;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashMap;

import org.junit.Before;
import org.junit.Test;

public class SimpleExpressionTest {

	@Before
	public void setUp() throws Exception {
	}

	public void test(String el,Object value){
		HashMap<Object,Object> context = new HashMap<Object,Object>();
		assertEquals(value,new ExpressionImpl(el).evaluate(context));
	}
	@Test
	public void testEvaluate(){
		test("1+2",3d);
		test("1+2 * 4",9d);
		test("(1+2)*4",12d);
		test("1*(2+2)",4d);
	}
	public void testMain() {
		try {
			System.out.println("Input a expression:");
			BufferedReader is = new BufferedReader(new InputStreamReader(
					System.in));
			for (;;) {
				String input = new String();
				input = is.readLine().trim();
				if (input.equals("q"))
					break;
				else {
					SimpleExpression boya = new SimpleExpression(input);

					System.out.println(input + "=" + boya.evaluate(null));
				}
				System.out
						.println("Input another expression or input 'q' to quit:");
			}
			is.close();
		} catch (IOException e) {
			System.out.println("Wrong input!!!");
		}
	}

}
