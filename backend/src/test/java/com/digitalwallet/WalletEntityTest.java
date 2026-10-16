package com.digitalwallet;

import com.digitalwallet.entity.User;
import com.digitalwallet.entity.Wallet;
import com.digitalwallet.exception.InsufficientBalanceException;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class WalletEntityTest {

    @Test
    void creditIncreasesBalance() {
        Wallet wallet = Wallet.create(User.create("A", "a@test.com", "x"), "INR");
        wallet.credit(new BigDecimal("250.50"));
        assertThat(wallet.getBalance()).isEqualByComparingTo("250.50");
    }

    @Test
    void debitDecreasesBalanceWhenFundsExist() {
        Wallet wallet = Wallet.create(User.create("A", "a@test.com", "x"), "INR");
        wallet.setBalance(new BigDecimal("1000"));
        wallet.debit(new BigDecimal("400"));
        assertThat(wallet.getBalance()).isEqualByComparingTo("600");
    }

    @Test
    void debitRejectsInsufficientFunds() {
        Wallet wallet = Wallet.create(User.create("A", "a@test.com", "x"), "INR");
        wallet.setBalance(new BigDecimal("100"));

        assertThatThrownBy(() -> wallet.debit(new BigDecimal("101")))
                .isInstanceOf(InsufficientBalanceException.class);

        assertThat(wallet.getBalance()).isEqualByComparingTo("100");
    }

    @Test
    void creditRejectsNonPositiveAmount() {
        Wallet wallet = Wallet.create(User.create("A", "a@test.com", "x"), "INR");

        assertThatThrownBy(() -> wallet.credit(BigDecimal.ZERO))
                .isInstanceOf(IllegalArgumentException.class);
    }
}
