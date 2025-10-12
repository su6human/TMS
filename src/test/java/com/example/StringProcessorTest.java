package com.example;

import org.example.StringProcessor;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions.*;

class StringProcessorTest {

    @Test
    @DisplayName("reverse() должен переворачивать строку")
    void testReverse() {
        assertEquals("olleH", StringProcessor.reverse("Hello"));
        assertEquals("", StringProcessor.reverse(""));
        assertNull(StringProcessor.reverse(null));
    }

    @Test
    @DisplayName("isPalindrome() должен определять палиндромы")
    void testPalindrome() {
        assertTrue(StringProcessor.isPalindrome("level"));
        assertTrue(StringProcessor.isPalindrome("Anna"));
        assertFalse(StringProcessor.isPalindrome("Java"));
        assertFalse(StringProcessor.isPalindrome(null));
    }
}