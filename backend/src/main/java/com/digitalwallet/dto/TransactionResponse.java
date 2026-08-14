package com.digitalwallet.dto;

import com.digitalwallet.entity.TransactionCategory;
import com.digitalwallet.entity.TransactionStatus;

import java.math.BigDecimal;
import java.time.Instant;

public class TransactionResponse {
    private final Long id;
    private final String senderEmail;
    private final String receiverEmail;
    private final BigDecimal amount;
    private final TransactionCategory category;
    private final TransactionStatus status;
    private final Instant timestamp;

    public TransactionResponse(
            Long id,
            String senderEmail,
            String receiverEmail,
            BigDecimal amount,
            TransactionCategory category,
            TransactionStatus status,
            Instant timestamp
    ) {
        this.id = id;
        this.senderEmail = senderEmail;
        this.receiverEmail = receiverEmail;
        this.amount = amount;
        this.category = category;
        this.status = status;
        this.timestamp = timestamp;
    }

    public Long getId() {
        return id;
    }

    public String getSenderEmail() {
        return senderEmail;
    }

    public String getReceiverEmail() {
        return receiverEmail;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public TransactionCategory getCategory() {
        return category;
    }

    public TransactionStatus getStatus() {
        return status;
    }

    public Instant getTimestamp() {
        return timestamp;
    }
}
