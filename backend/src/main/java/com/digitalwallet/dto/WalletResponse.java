package com.digitalwallet.dto;

import java.math.BigDecimal;
import java.util.List;

public class WalletResponse {
    private final Long walletId;
    private final Long userId;
    private final String userName;
    private final String email;
    private final BigDecimal balance;
    private final String currency;
    private final List<TransactionResponse> recentTransactions;

    public WalletResponse(
            Long walletId,
            Long userId,
            String userName,
            String email,
            BigDecimal balance,
            String currency,
            List<TransactionResponse> recentTransactions
    ) {
        this.walletId = walletId;
        this.userId = userId;
        this.userName = userName;
        this.email = email;
        this.balance = balance;
        this.currency = currency;
        this.recentTransactions = recentTransactions;
    }

    public Long getWalletId() {
        return walletId;
    }

    public Long getUserId() {
        return userId;
    }

    public String getUserName() {
        return userName;
    }

    public String getEmail() {
        return email;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public String getCurrency() {
        return currency;
    }

    public List<TransactionResponse> getRecentTransactions() {
        return recentTransactions;
    }
}
