package com.digitalwallet.dto;

import com.digitalwallet.entity.InsightCategory;

import java.math.BigDecimal;

public class CategoryTotalResponse {

    private final InsightCategory category;
    private final BigDecimal total;
    private final long transactionCount;

    public CategoryTotalResponse(InsightCategory category, BigDecimal total, long transactionCount) {
        this.category = category;
        this.total = total;
        this.transactionCount = transactionCount;
    }

    public InsightCategory getCategory() {
        return category;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public long getTransactionCount() {
        return transactionCount;
    }
}
