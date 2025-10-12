package org.example;

public class StringProcessor {
        public static String reverse(String input) {
            if (input == null) return null;
            return new StringBuilder(input).reverse().toString();
        }

        public static boolean isPalindrome(String input) {
            if (input == null) return false;
            String reversed = reverse(input);
            return input.equalsIgnoreCase(reversed);
        }


}
