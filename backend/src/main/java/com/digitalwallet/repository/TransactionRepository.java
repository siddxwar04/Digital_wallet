package com.digitalwallet.repository;

import com.digitalwallet.entity.Transaction;
import com.digitalwallet.entity.TransactionCategory;
import com.digitalwallet.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    @EntityGraph(attributePaths = {"sender", "receiver"})
    @Query("""
            SELECT t FROM Transaction t
            WHERE t.sender = :user OR t.receiver = :user
            ORDER BY t.timestamp DESC
            """)
    List<Transaction> findRecentForUser(@Param("user") User user, Pageable pageable);

    @EntityGraph(attributePaths = {"sender", "receiver"})
    @Query("""
            SELECT t FROM Transaction t
            WHERE (t.sender = :user OR t.receiver = :user)
            AND (:category IS NULL OR t.category = :category)
            AND (:from IS NULL OR t.timestamp >= :from)
            AND (:to IS NULL OR t.timestamp <= :to)
            ORDER BY t.timestamp DESC
            """)
    Page<Transaction> findUserTransactions(
            @Param("user") User user,
            @Param("category") TransactionCategory category,
            @Param("from") Instant from,
            @Param("to") Instant to,
            Pageable pageable
    );

    @Query("""
            SELECT t.category AS category, SUM(t.amount) AS total, COUNT(t) AS txnCount
            FROM Transaction t
            WHERE t.sender = :user
            AND t.receiver <> :user
            AND t.status = com.digitalwallet.entity.TransactionStatus.COMPLETED
            AND t.timestamp >= :from
            AND t.timestamp < :to
            GROUP BY t.category
            """)
    List<CategoryTotal> sumSpendingByCategory(
            @Param("user") User user,
            @Param("from") Instant from,
            @Param("to") Instant to
    );
}
