package com.digitalwallet.service;

import com.digitalwallet.dto.AddMoneyRequest;
import com.digitalwallet.dto.TransactionResponse;
import com.digitalwallet.dto.TransferRequest;
import com.digitalwallet.dto.WalletResponse;
import com.digitalwallet.entity.*;
import com.digitalwallet.exception.InsufficientBalanceException;
import com.digitalwallet.exception.ResourceNotFoundException;
import com.digitalwallet.repository.TransactionRepository;
import com.digitalwallet.repository.UserRepository;
import com.digitalwallet.repository.WalletRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class WalletService {

    private static final String DEFAULT_CURRENCY = "INR";

    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;
    private final TransactionService transactionService;
    private final UserRepository userRepository;

    public WalletService(
            WalletRepository walletRepository,
            TransactionRepository transactionRepository,
            TransactionService transactionService,
            UserRepository userRepository
    ) {
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
        this.transactionService = transactionService;
        this.userRepository = userRepository;
    }

    public void createWalletForUser(User user) {
        if (walletRepository.findByUser(user).isPresent()) {
            return;
        }
        walletRepository.save(Wallet.create(user, DEFAULT_CURRENCY));
    }

    public WalletResponse getWallet(User user) {
        Wallet wallet = getWalletOrThrow(user);
        List<TransactionResponse> recent = transactionRepository
                .findTop20BySenderOrReceiverOrderByTimestampDesc(user, user)
                .stream()
                .map(transactionService::toResponse)
                .toList();

        return new WalletResponse(
                wallet.getId(),
                user.getId(),
                user.getName(),
                user.getEmail(),
                wallet.getBalance(),
                wallet.getCurrency(),
                recent
        );
    }

    @Transactional
    public WalletResponse addMoney(User user, AddMoneyRequest request) {
        Wallet wallet = getWalletOrThrow(user);
        wallet.setBalance(wallet.getBalance().add(request.getAmount()));
        walletRepository.save(wallet);

        Transaction transaction = Transaction.create(
                user,
                user,
                request.getAmount(),
                TransactionCategory.TOPUP,
                TransactionStatus.COMPLETED
        );
        transactionRepository.save(transaction);

        return getWallet(user);
    }

    @Transactional
    public TransactionResponse transfer(User sender, TransferRequest request) {
        if (sender.getEmail().equalsIgnoreCase(request.getReceiverEmail())) {
            throw new IllegalArgumentException("Cannot transfer to yourself");
        }

        User receiver = userRepository.findByEmail(request.getReceiverEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Receiver not found"));

        Wallet senderWallet = getWalletOrThrow(sender);
        Wallet receiverWallet = getWalletOrThrow(receiver);

        BigDecimal amount = request.getAmount();

        if (senderWallet.getBalance().compareTo(amount) < 0) {
            throw new InsufficientBalanceException();
        }

        senderWallet.setBalance(senderWallet.getBalance().subtract(amount));
        receiverWallet.setBalance(receiverWallet.getBalance().add(amount));

        walletRepository.save(senderWallet);
        walletRepository.save(receiverWallet);

        TransactionCategory category = request.getCategory() != null
                ? request.getCategory()
                : TransactionCategory.TRANSFER;

        Transaction transaction = Transaction.create(
                sender,
                receiver,
                amount,
                category,
                TransactionStatus.COMPLETED
        );

        transaction = transactionRepository.save(transaction);
        return transactionService.toResponse(transaction);
    }

    private Wallet getWalletOrThrow(User user) {
        return walletRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));
    }
}
