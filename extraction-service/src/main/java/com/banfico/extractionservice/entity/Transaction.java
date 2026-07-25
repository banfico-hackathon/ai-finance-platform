package com.banfico.extractionservice.entity;


import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "transaction_id", unique = true)
    private String transactionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    private Account account;

    @Column(nullable = false)
    private BigDecimal amount;

    private String currency;

    private String creditDebitIndicator;

    private String status;

    private String merchantName;

    private String merchantCategoryCode;

    @Column(length = 1000)
    private String description;

    private OffsetDateTime bookingDate;

    private OffsetDateTime valueDate;
}