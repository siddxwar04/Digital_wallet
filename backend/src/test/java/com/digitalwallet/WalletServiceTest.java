package com.digitalwallet;

import com.digitalwallet.dto.AddMoneyRequest;
import com.digitalwallet.dto.RequestMoneyRequest;
import com.digitalwallet.dto.TransferRequest;
import com.digitalwallet.dto.TransactionResponse;
import com.digitalwallet.dto.WalletResponse;
import com.digitalwallet.entity.TransactionCategory;
import com.digitalwallet.entity.TransactionStatus;
import com.digitalwallet.entity.User;
import com.digitalwallet.entity.Wallet;
import com.digitalwallet.exception.InsufficientBalanceException;
import com.digitalwallet.repository.TransactionRepository;
import com.digitalwallet.repository.UserRepository;
import com.digitalwallet.repository.WalletRepository;
import com.digitalwallet.service.WalletService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@ActiveProfiles("test")
class WalletServiceTest {

    @Autowired
    private WalletService walletService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    private User alice;
    private User bob;

    @BeforeEach
    void setUp() {
        transactionRepository.deleteAll();
        walletRepository.deleteAll();
        userRepository.deleteAll();

        alice = userRepository.save(User.create("Alice", "alice@test.com", "hashed"));
        bob = userRepository.save(User.create("Bob", "bob@test.com", "hashed"));

        Wallet aliceWallet = walletRepository.save(Wallet.create(alice, "INR"));
        aliceWallet.setBalance(new BigDecimal("1000"));
        walletRepository.save(aliceWallet);

        walletRepository.save(Wallet.create(bob, "INR"));
    }

    @Test
    void transferHappyPathDebitsSenderAndCreditsReceiver() {
        TransferRequest request = new TransferRequest();
        request.setReceiverEmail("bob@test.com");
        request.setAmount(new BigDecimal("500"));

        TransactionResponse response = walletService.transfer(alice, request);

        assertThat(response.getAmount()).isEqualByComparingTo("500");
        assertThat(response.getSenderEmail()).isEqualTo("alice@test.com");
        assertThat(response.getReceiverEmail()).isEqualTo("bob@test.com");
        assertThat(response.getCategory()).isEqualTo(TransactionCategory.TRANSFER);
        assertThat(response.getStatus()).isEqualTo(TransactionStatus.COMPLETED);

        assertThat(walletRepository.findByUser(alice).orElseThrow().getBalance())
                .isEqualByComparingTo("500");
        assertThat(walletRepository.findByUser(bob).orElseThrow().getBalance())
                .isEqualByComparingTo("500");
        assertThat(transactionRepository.count()).isEqualTo(1);
    }

    @Test
    void transferRejectsInsufficientBalance() {
        TransferRequest request = new TransferRequest();
        request.setReceiverEmail("bob@test.com");
        request.setAmount(new BigDecimal("1500"));

        assertThatThrownBy(() -> walletService.transfer(alice, request))
                .isInstanceOf(InsufficientBalanceException.class)
                .hasMessage("Insufficient balance");

        assertThat(walletRepository.findByUser(alice).orElseThrow().getBalance())
                .isEqualByComparingTo("1000");
        assertThat(walletRepository.findByUser(bob).orElseThrow().getBalance())
                .isEqualByComparingTo("0");
        assertThat(transactionRepository.count()).isZero();
    }

    @Test
    void requestMoneyCreatesPendingRecordWithoutMovingBalances() {
        RequestMoneyRequest request = new RequestMoneyRequest();
        request.setPayerEmail("bob@test.com");
        request.setAmount(new BigDecimal("250"));

        TransactionResponse response = walletService.requestMoney(alice, request);

        assertThat(response.getCategory()).isEqualTo(TransactionCategory.REQUEST);
        assertThat(response.getStatus()).isEqualTo(TransactionStatus.PENDING);
        assertThat(response.getSenderEmail()).isEqualTo("bob@test.com");
        assertThat(response.getReceiverEmail()).isEqualTo("alice@test.com");
        assertThat(response.getAmount()).isEqualByComparingTo("250");

        assertThat(walletRepository.findByUser(alice).orElseThrow().getBalance())
                .isEqualByComparingTo("1000");
        assertThat(walletRepository.findByUser(bob).orElseThrow().getBalance())
                .isEqualByComparingTo("0");
    }

    @Test
    void requestMoneyRejectsSelfRequest() {
        RequestMoneyRequest request = new RequestMoneyRequest();
        request.setPayerEmail("alice@test.com");
        request.setAmount(new BigDecimal("100"));

        assertThatThrownBy(() -> walletService.requestMoney(alice, request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Cannot request money from yourself");
    }

    @Test
    void addMoneyCreditsBalanceAndRecordsTopUp() {
        AddMoneyRequest request = new AddMoneyRequest();
        request.setAmount(new BigDecimal("300"));

        WalletResponse response = walletService.addMoney(bob, request);

        assertThat(response.getBalance()).isEqualByComparingTo("300");
        assertThat(walletRepository.findByUser(bob).orElseThrow().getBalance())
                .isEqualByComparingTo("300");
        assertThat(transactionRepository.count()).isEqualTo(1);
        assertThat(transactionRepository.findAll().get(0).getCategory())
                .isEqualTo(TransactionCategory.TOPUP);
    }

    @Test
    void getWalletAfterTopUpLoadsRecentWithoutEntityGraphFailure() {
        AddMoneyRequest request = new AddMoneyRequest();
        request.setAmount(new BigDecimal("150"));
        walletService.addMoney(bob, request);

        WalletResponse wallet = walletService.getWallet(bob);

        assertThat(wallet.getBalance()).isEqualByComparingTo("150");
        assertThat(wallet.getRecentTransactions()).hasSize(1);
        assertThat(wallet.getRecentTransactions().get(0).getCategory())
                .isEqualTo(TransactionCategory.TOPUP);
        assertThat(wallet.getRecentTransactions().get(0).getSenderEmail())
                .isEqualTo("bob@test.com");
    }
}
