package com.digitalwallet.service;

import com.digitalwallet.dto.PagedResponse;
import com.digitalwallet.dto.TransactionResponse;
import com.digitalwallet.entity.Transaction;
import com.digitalwallet.entity.TransactionCategory;
import com.digitalwallet.entity.User;
import com.digitalwallet.exception.ResourceNotFoundException;
import com.digitalwallet.repository.TransactionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class TransactionService {

    private static final int MAX_PAGE_SIZE = 100;

    private final TransactionRepository transactionRepository;

    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public PagedResponse<TransactionResponse> getTransactions(
            User user,
            TransactionCategory category,
            Instant from,
            Instant to,
            int page,
            int size
    ) {
        if (from != null && to != null && from.isAfter(to)) {
            throw new IllegalArgumentException("Start date must be before end date");
        }

        int safeSize = Math.min(Math.max(size, 1), MAX_PAGE_SIZE);
        int safePage = Math.max(page, 0);
        Pageable pageable = PageRequest.of(safePage, safeSize);

        Page<Transaction> result = transactionRepository.findUserTransactions(
                user, category, from, to, pageable
        );

        List<TransactionResponse> content = result.getContent().stream()
                .map(this::toResponse)
                .toList();

        return new PagedResponse<>(
                content,
                result.getNumber(),
                result.getSize(),
                result.getTotalElements(),
                result.getTotalPages(),
                result.isLast()
        );
    }

    public TransactionResponse getTransactionById(User user, Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

        if (!isParticipant(user, transaction)) {
            throw new ResourceNotFoundException("Transaction not found");
        }

        return toResponse(transaction);
    }

    public TransactionResponse toResponse(Transaction transaction) {
        return new TransactionResponse(
                transaction.getId(),
                transaction.getSender().getEmail(),
                transaction.getReceiver().getEmail(),
                transaction.getAmount(),
                transaction.getCategory(),
                transaction.getStatus(),
                transaction.getTimestamp()
        );
    }

    private boolean isParticipant(User user, Transaction transaction) {
        return transaction.getSender().getId().equals(user.getId())
                || transaction.getReceiver().getId().equals(user.getId());
    }
}
