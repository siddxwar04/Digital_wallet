package com.digitalwallet.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "category_lookups")
public class CategoryLookup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "description_key", nullable = false, unique = true, length = 200)
    private String descriptionKey;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private InsightCategory category;

    @Column(nullable = false, length = 20)
    private String source;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    public CategoryLookup() {
    }

    public static CategoryLookup create(String descriptionKey, InsightCategory category, String source) {
        CategoryLookup lookup = new CategoryLookup();
        lookup.descriptionKey = descriptionKey;
        lookup.category = category;
        lookup.source = source;
        return lookup;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescriptionKey() {
        return descriptionKey;
    }

    public void setDescriptionKey(String descriptionKey) {
        this.descriptionKey = descriptionKey;
    }

    public InsightCategory getCategory() {
        return category;
    }

    public void setCategory(InsightCategory category) {
        this.category = category;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
