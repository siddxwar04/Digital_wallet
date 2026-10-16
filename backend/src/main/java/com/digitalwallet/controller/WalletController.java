package com.digitalwallet.controller;

import com.digitalwallet.dto.AddMoneyRequest;
import com.digitalwallet.dto.RequestMoneyRequest;
import com.digitalwallet.dto.TransactionResponse;
import com.digitalwallet.dto.TransferRequest;
import com.digitalwallet.dto.WalletResponse;
import com.digitalwallet.service.WalletService;
import com.digitalwallet.util.AuthHelper;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wallet")
public class WalletController {

    private final WalletService walletService;
    private final AuthHelper authHelper;

    public WalletController(WalletService walletService, AuthHelper authHelper) {
        this.walletService = walletService;
        this.authHelper = authHelper;
    }

    @GetMapping
    public ResponseEntity<WalletResponse> getWallet() {
        return ResponseEntity.ok(walletService.getWallet(authHelper.getCurrentUser()));
    }

    @PostMapping("/add-money")
    public ResponseEntity<WalletResponse> addMoney(@Valid @RequestBody AddMoneyRequest request) {
        return ResponseEntity.ok(walletService.addMoney(authHelper.getCurrentUser(), request));
    }

    @PostMapping("/transfer")
    public ResponseEntity<TransactionResponse> transfer(@Valid @RequestBody TransferRequest request) {
        TransactionResponse response = walletService.transfer(authHelper.getCurrentUser(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/request")
    public ResponseEntity<TransactionResponse> requestMoney(@Valid @RequestBody RequestMoneyRequest request) {
        TransactionResponse response = walletService.requestMoney(authHelper.getCurrentUser(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
