package com.digitalwallet.util;

public final class Emails {

    private Emails() {
    }

    /** Trims and lowercases an email for consistent storage and lookup. */
    public static String normalize(String email) {
        if (email == null) {
            return null;
        }
        return email.trim().toLowerCase();
    }

    public static boolean equalsIgnoreCase(String left, String right) {
        if (left == null || right == null) {
            return false;
        }
        return normalize(left).equals(normalize(right));
    }
}
