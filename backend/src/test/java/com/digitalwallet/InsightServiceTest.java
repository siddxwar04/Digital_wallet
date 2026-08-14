package com.digitalwallet;

import com.digitalwallet.dto.CategorizeResponse;
import com.digitalwallet.dto.CategoryTotalResponse;
import com.digitalwallet.dto.MonthlySummaryResponse;
import com.digitalwallet.entity.*;
import com.digitalwallet.repository.TransactionRepository;
import com.digitalwallet.repository.UserRepository;
import com.digitalwallet.repository.WalletRepository;
import com.digitalwallet.service.InsightService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.time.ZoneOffset;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@ActiveProfiles("test")
class InsightServiceTest {

    @Autowired
    private InsightService insightService;

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
        walletRepository.save(Wallet.create(alice, "INR"));
        walletRepository.save(Wallet.create(bob, "INR"));
    }

    @Test
    void keywordMatchSkipsTheLlm() {
        CategorizeResponse response = insightService.categorize("Uber ride to airport");

        assertThat(response.getCategory()).isEqualTo(InsightCategory.TRANSPORT);
        assertThat(response.getSource()).isEqualTo("KEYWORD");
    }

    @Test
    void keywordMatchingIsCaseAndSpacingInsensitive() {
        CategorizeResponse response = insightService.categorize("  SWIGGY   Order  ");

        assertThat(response.getCategory()).isEqualTo(InsightCategory.FOOD);
        assertThat(response.getSource()).isEqualTo("KEYWORD");
    }

    @Test
    void keywordsMatchWholeWordsOnly() {
        CategorizeResponse response = insightService.categorize("Coca Cola crate");

        assertThat(response.getCategory()).isNotEqualTo(InsightCategory.TRANSPORT);
    }

    @Test
    void unknownDescriptionFallsBackToOtherWhenLlmDisabled() {
        CategorizeResponse response = insightService.categorize("Zzzz unknown vendor 12345");

        assertThat(response.getCategory()).isEqualTo(InsightCategory.OTHER);
        assertThat(response.getSource()).isEqualTo("FALLBACK");
    }

    @Test
    void summaryTotalsOutgoingSpendPerCategory() {
        saveTransaction(alice, bob, "300", TransactionCategory.FOOD);
        saveTransaction(alice, bob, "200", TransactionCategory.FOOD);
        saveTransaction(alice, bob, "150", TransactionCategory.TRANSPORT);
        saveTransaction(alice, alice, "5000", TransactionCategory.TOPUP);
        saveTransaction(bob, alice, "900", TransactionCategory.SHOPPING);

        String month = YearMonth.now(ZoneOffset.UTC).toString();
        MonthlySummaryResponse summary = insightService.getMonthlySummary(alice, month);

        assertThat(summary.getMonth()).isEqualTo(month);
        assertThat(summary.getCurrency()).isEqualTo("INR");
        assertThat(summary.getTotalSpent()).isEqualByComparingTo("650");
        assertThat(summary.getTransactionCount()).isEqualTo(3);
        assertThat(totalFor(summary, InsightCategory.FOOD)).isEqualByComparingTo("500");
        assertThat(totalFor(summary, InsightCategory.TRANSPORT)).isEqualByComparingTo("150");
        assertThat(totalFor(summary, InsightCategory.SHOPPING)).isEqualByComparingTo("0");
        assertThat(summary.getCategories()).hasSize(InsightCategory.values().length);
    }

    @Test
    void summaryExcludesTransactionsOutsideTheRequestedMonth() {
        saveTransaction(alice, bob, "300", TransactionCategory.FOOD);

        String previousMonth = YearMonth.now(ZoneOffset.UTC).minusMonths(1).toString();
        MonthlySummaryResponse summary = insightService.getMonthlySummary(alice, previousMonth);

        assertThat(summary.getTotalSpent()).isEqualByComparingTo("0");
        assertThat(summary.getTransactionCount()).isZero();
    }

    @Test
    void invalidMonthIsRejected() {
        assertThatThrownBy(() -> insightService.getMonthlySummary(alice, "August-2026"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("YYYY-MM");
    }

    private void saveTransaction(
            User sender,
            User receiver,
            String amount,
            TransactionCategory category
    ) {
        transactionRepository.save(Transaction.create(
                sender, receiver, new BigDecimal(amount), category, TransactionStatus.COMPLETED
        ));
    }

    private BigDecimal totalFor(MonthlySummaryResponse summary, InsightCategory category) {
        return summary.getCategories().stream()
                .filter(item -> item.getCategory() == category)
                .map(CategoryTotalResponse::getTotal)
                .findFirst()
                .orElseThrow();
    }
}
