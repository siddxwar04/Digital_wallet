package com.digitalwallet.controller;

import com.digitalwallet.dto.PagedResponse;
import com.digitalwallet.dto.TransactionResponse;
import com.digitalwallet.entity.TransactionCategory;
import com.digitalwallet.service.TransactionService;
import com.digitalwallet.util.AuthHelper;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;
    private final AuthHelper authHelper;

    public TransactionController(TransactionService transactionService, AuthHelper authHelper) {
        this.transactionService = transactionService;
        this.authHelper = authHelper;
    }

    @GetMapping
    public ResponseEntity<PagedResponse<TransactionResponse>> listTransactions(
            @RequestParam(required = false) TransactionCategory category,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        PagedResponse<TransactionResponse> response = transactionService.getTransactions(
                authHelper.getCurrentUser(),
                category,
                from,
                to,
                page,
                size
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionResponse> getTransaction(@PathVariable Long id) {
        return ResponseEntity.ok(
                transactionService.getTransactionById(authHelper.getCurrentUser(), id)
        );
    }
}
