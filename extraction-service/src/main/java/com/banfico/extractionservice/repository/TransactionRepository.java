package com.banfico.extractionservice.repository;


import com.banfico.extractionservice.entity.Account;
import com.banfico.extractionservice.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByAccount(Account account);

    boolean existsByTransactionId(String transactionId);

}
