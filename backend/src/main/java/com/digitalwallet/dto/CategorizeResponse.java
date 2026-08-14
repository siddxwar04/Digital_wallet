package com.digitalwallet.dto;

import com.digitalwallet.entity.InsightCategory;

public class CategorizeResponse {

    private final String description;
    private final InsightCategory category;
    private final String source;

    public CategorizeResponse(String description, InsightCategory category, String source) {
        this.description = description;
        this.category = category;
        this.source = source;
    }

    public String getDescription() {
        return description;
    }

    public InsightCategory getCategory() {
        return category;
    }

    public String getSource() {
        return source;
    }
}
