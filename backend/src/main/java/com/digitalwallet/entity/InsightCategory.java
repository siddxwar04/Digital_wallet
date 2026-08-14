package com.digitalwallet.entity;

public enum InsightCategory {
    FOOD,
    TRANSPORT,
    SHOPPING,
    BILLS,
    TRANSFERS,
    OTHER;

    public static InsightCategory fromTransactionCategory(TransactionCategory category) {
        if (category == null) {
            return OTHER;
        }
        return switch (category) {
            case FOOD -> FOOD;
            case TRANSPORT -> TRANSPORT;
            case SHOPPING -> SHOPPING;
            case BILLS -> BILLS;
            case TRANSFER -> TRANSFERS;
            case TOPUP, REQUEST -> OTHER;
        };
    }

    public static InsightCategory fromLabel(String label) {
        if (label == null) {
            return OTHER;
        }
        String cleaned = label.trim().toUpperCase();
        for (InsightCategory value : values()) {
            if (value.name().equals(cleaned)) {
                return value;
            }
        }
        return OTHER;
    }
}
