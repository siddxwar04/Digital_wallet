package com.digitalwallet.repository;

import com.digitalwallet.entity.TransactionCategory;

import java.math.BigDecimal;

public interface CategoryTotal {
    TransactionCategory getCategory();

    BigDecimal getTotal();

    long getTxnCount();
}
