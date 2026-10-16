package com.digitalwallet.service;

import com.digitalwallet.dto.CategorizeResponse;
import com.digitalwallet.dto.CategoryTotalResponse;
import com.digitalwallet.dto.MonthlySummaryResponse;
import com.digitalwallet.entity.CategoryLookup;
import com.digitalwallet.entity.InsightCategory;
import com.digitalwallet.entity.User;
import com.digitalwallet.entity.Wallet;
import com.digitalwallet.repository.CategoryLookupRepository;
import com.digitalwallet.repository.CategoryTotal;
import com.digitalwallet.repository.TransactionRepository;
import com.digitalwallet.repository.WalletRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.YearMonth;
import java.time.ZoneOffset;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class InsightService {

    private static final String SOURCE_KEYWORD = "KEYWORD";
    private static final String SOURCE_CACHE = "CACHE";
    private static final String SOURCE_LLM = "LLM";
    private static final String SOURCE_FALLBACK = "FALLBACK";

    private final KeywordCategorizer keywordCategorizer;
    private final LlmCategorizer llmCategorizer;
    private final CategoryLookupRepository categoryLookupRepository;
    private final TransactionRepository transactionRepository;
    private final WalletRepository walletRepository;

    public InsightService(
            KeywordCategorizer keywordCategorizer,
            LlmCategorizer llmCategorizer,
            CategoryLookupRepository categoryLookupRepository,
            TransactionRepository transactionRepository,
            WalletRepository walletRepository
    ) {
        this.keywordCategorizer = keywordCategorizer;
        this.llmCategorizer = llmCategorizer;
        this.categoryLookupRepository = categoryLookupRepository;
        this.transactionRepository = transactionRepository;
        this.walletRepository = walletRepository;
    }

    @Transactional
    public CategorizeResponse categorize(String description) {
        String key = normalize(description);

        InsightCategory keywordMatch = keywordCategorizer.match(key);
        if (keywordMatch != null) {
            return new CategorizeResponse(description, keywordMatch, SOURCE_KEYWORD);
        }

        Optional<CategoryLookup> cached = categoryLookupRepository.findByDescriptionKey(key);
        if (cached.isPresent()) {
            return new CategorizeResponse(description, cached.get().getCategory(), SOURCE_CACHE);
        }

        InsightCategory llmCategory = llmCategorizer.categorize(description);
        if (llmCategory == null) {
            return new CategorizeResponse(description, InsightCategory.OTHER, SOURCE_FALLBACK);
        }

        categoryLookupRepository.save(CategoryLookup.create(key, llmCategory, SOURCE_LLM));
        return new CategorizeResponse(description, llmCategory, SOURCE_LLM);
    }

    @Transactional(readOnly = true)
    public MonthlySummaryResponse getMonthlySummary(User user, String month) {
        YearMonth yearMonth = parseMonth(month);
        Instant from = yearMonth.atDay(1).atStartOfDay(ZoneOffset.UTC).toInstant();
        Instant to = yearMonth.plusMonths(1).atDay(1).atStartOfDay(ZoneOffset.UTC).toInstant();

        List<CategoryTotal> rows = transactionRepository.sumSpendingByCategory(user, from, to);

        Map<InsightCategory, BigDecimal> totals = new EnumMap<>(InsightCategory.class);
        Map<InsightCategory, Long> counts = new EnumMap<>(InsightCategory.class);

        for (CategoryTotal row : rows) {
            InsightCategory bucket = InsightCategory.fromTransactionCategory(row.getCategory());
            BigDecimal amount = row.getTotal() == null ? BigDecimal.ZERO : row.getTotal();
            totals.merge(bucket, amount, BigDecimal::add);
            counts.merge(bucket, row.getTxnCount(), Long::sum);
        }

        List<CategoryTotalResponse> categories = new ArrayList<>();
        BigDecimal totalSpent = BigDecimal.ZERO;
        long transactionCount = 0;

        for (InsightCategory category : InsightCategory.values()) {
            BigDecimal total = totals.getOrDefault(category, BigDecimal.ZERO);
            long count = counts.getOrDefault(category, 0L);
            categories.add(new CategoryTotalResponse(category, total, count));
            totalSpent = totalSpent.add(total);
            transactionCount += count;
        }

        String currency = walletRepository.findByUser(user)
                .map(Wallet::getCurrency)
                .orElse("INR");

        return new MonthlySummaryResponse(
                yearMonth.toString(),
                currency,
                totalSpent,
                transactionCount,
                categories
        );
    }

    private YearMonth parseMonth(String month) {
        if (month == null || month.isBlank()) {
            throw new IllegalArgumentException("Month is required in YYYY-MM format");
        }
        try {
            return YearMonth.parse(month.trim());
        } catch (DateTimeParseException ex) {
            throw new IllegalArgumentException("Month must be in YYYY-MM format, for example 2026-08");
        }
    }

    private String normalize(String description) {
        return description.trim().toLowerCase().replaceAll("\\s+", " ");
    }
}
