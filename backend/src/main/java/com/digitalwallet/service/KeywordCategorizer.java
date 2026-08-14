package com.digitalwallet.service;

import com.digitalwallet.entity.InsightCategory;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Component
public class KeywordCategorizer {

    /**
     * Insertion order is the match priority, so a description containing keywords from two
     * buckets always resolves to the same category.
     */
    private static final Map<InsightCategory, List<String>> KEYWORDS = buildKeywords();

    private static Map<InsightCategory, List<String>> buildKeywords() {
        Map<InsightCategory, List<String>> keywords = new LinkedHashMap<>();

        keywords.put(InsightCategory.FOOD, List.of(
                "swiggy", "zomato", "dominos", "pizza", "restaurant", "cafe", "coffee",
                "starbucks", "mcdonalds", "kfc", "biryani", "lunch", "dinner", "breakfast",
                "food", "bakery", "dhaba", "canteen"
        ));
        keywords.put(InsightCategory.TRANSPORT, List.of(
                "uber", "ola", "cab", "taxi", "rapido", "metro", "bus", "train", "irctc",
                "petrol", "diesel", "fuel", "parking", "toll", "flight", "indigo", "auto"
        ));
        keywords.put(InsightCategory.SHOPPING, List.of(
                "amazon", "flipkart", "myntra", "ajio", "meesho", "nykaa", "shopping",
                "store", "mall", "decathlon", "ikea", "clothes", "shoes", "electronics"
        ));
        keywords.put(InsightCategory.BILLS, List.of(
                "electricity", "water bill", "gas bill", "broadband", "wifi", "internet",
                "airtel", "jio", "vodafone", "recharge", "postpaid", "prepaid", "dth",
                "rent", "insurance", "emi", "subscription", "netflix", "spotify", "bill"
        ));
        keywords.put(InsightCategory.TRANSFERS, List.of(
                "upi", "transfer", "sent to", "paid to", "neft", "imps", "rtgs",
                "gpay", "phonepe", "paytm", "settle", "split"
        ));

        return keywords;
    }

    public InsightCategory match(String normalizedDescription) {
        Set<String> words = new HashSet<>(
                Arrays.asList(normalizedDescription.split("[^a-z0-9]+"))
        );

        for (Map.Entry<InsightCategory, List<String>> entry : KEYWORDS.entrySet()) {
            for (String keyword : entry.getValue()) {
                if (matches(keyword, words, normalizedDescription)) {
                    return entry.getKey();
                }
            }
        }
        return null;
    }

    /**
     * Single words match whole words only, so "cola" does not count as "ola". Multi-word
     * keywords fall back to a substring check.
     */
    private boolean matches(String keyword, Set<String> words, String description) {
        if (keyword.indexOf(' ') >= 0) {
            return description.contains(keyword);
        }
        return words.contains(keyword);
    }
}
