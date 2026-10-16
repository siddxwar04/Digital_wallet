package com.digitalwallet.service;

import com.digitalwallet.dto.AddMoneyRequest;
import com.digitalwallet.dto.RequestMoneyRequest;
import com.digitalwallet.dto.TransactionResponse;
import com.digitalwallet.dto.TransferRequest;
import com.digitalwallet.dto.WalletResponse;
import com.digitalwallet.entity.*;
import com.digitalwallet.exception.ResourceNotFoundException;
import com.digitalwallet.repository.TransactionRepository;
import com.digitalwallet.repository.UserRepository;
import com.digitalwallet.repository.WalletRepository;
import com.digitalwallet.util.Emails;
import org.springframework.data.domain.PageRequest;
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

    @Transactional(readOnly = true)
    public WalletResponse getWallet(User user) {
        Wallet wallet = getWalletOrThrow(user);
        List<TransactionResponse> recent = transactionRepository
                .findRecentForUser(user, PageRequest.of(0, 20))
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
        wallet.credit(request.getAmount());
        walletRepository.save(wallet);

        Transaction topUp = transactionRepository.save(Transaction.create(
                user,
                user,
                request.getAmount(),
                TransactionCategory.TOPUP,
                TransactionStatus.COMPLETED
        ));

        // Avoid getWallet() here: EntityGraph re-init fails when sender == receiver (TOPUP).
        return new WalletResponse(
                wallet.getId(),
                user.getId(),
                user.getName(),
                user.getEmail(),
                wallet.getBalance(),
                wallet.getCurrency(),
                List.of(transactionService.toResponse(topUp))
        );
    }

    @Transactional
    public TransactionResponse transfer(User sender, TransferRequest request) {
        String receiverEmail = Emails.normalize(request.getReceiverEmail());
        rejectSameUser(sender, receiverEmail, "Cannot transfer to yourself");

        User receiver = requireUserByEmail(receiverEmail, "Receiver not found");
        Wallet senderWallet = getWalletOrThrow(sender);
        Wallet receiverWallet = getWalletOrThrow(receiver);

        BigDecimal amount = request.getAmount();
        senderWallet.debit(amount);
        receiverWallet.credit(amount);

        walletRepository.save(senderWallet);
        walletRepository.save(receiverWallet);

        TransactionCategory category = request.getCategory() != null
                ? request.getCategory()
                : TransactionCategory.TRANSFER;

        Transaction transaction = transactionRepository.save(Transaction.create(
                sender,
                receiver,
                amount,
                category,
                TransactionStatus.COMPLETED
        ));

        return transactionService.toResponse(transaction);
    }

    /**
     * Records a pending payment request. No balances move until the payer sends money
     * (accept/fulfill is out of scope for this flow).
     */
    @Transactional
    public TransactionResponse requestMoney(User requester, RequestMoneyRequest request) {
        String payerEmail = Emails.normalize(request.getPayerEmail());
        rejectSameUser(requester, payerEmail, "Cannot request money from yourself");

        User payer = requireUserByEmail(payerEmail, "User not found");
        getWalletOrThrow(requester);
        getWalletOrThrow(payer);

        Transaction transaction = transactionRepository.save(Transaction.create(
                payer,
                requester,
                request.getAmount(),
                TransactionCategory.REQUEST,
                TransactionStatus.PENDING
        ));

        return transactionService.toResponse(transaction);
    }

    private void rejectSameUser(User actor, String otherEmail, String message) {
        if (Emails.equalsIgnoreCase(actor.getEmail(), otherEmail)) {
            throw new IllegalArgumentException(message);
        }
    }

    private User requireUserByEmail(String email, String notFoundMessage) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException(notFoundMessage));
    }

    private Wallet getWalletOrThrow(User user) {
        return walletRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));
    }
}
