package com.digitalwallet.dto;

import java.math.BigDecimal;
import java.util.List;

public class MonthlySummaryResponse {

    private final String month;
    private final String currency;
    private final BigDecimal totalSpent;
    private final long transactionCount;
    private final List<CategoryTotalResponse> categories;

    public MonthlySummaryResponse(
            String month,
            String currency,
            BigDecimal totalSpent,
            long transactionCount,
            List<CategoryTotalResponse> categories
    ) {
        this.month = month;
        this.currency = currency;
        this.totalSpent = totalSpent;
        this.transactionCount = transactionCount;
        this.categories = categories;
    }

    public String getMonth() {
        return month;
    }

    public String getCurrency() {
        return currency;
    }

    public BigDecimal getTotalSpent() {
        return totalSpent;
    }

    public long getTransactionCount() {
        return transactionCount;
    }

    public List<CategoryTotalResponse> getCategories() {
        return categories;
    }
}
