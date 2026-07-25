package com.banfico.extractionservice.repository;

import com.banfico.extractionservice.entity.Account;
import com.banfico.extractionservice.entity.Balance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BalanceRepository extends JpaRepository<Balance, Long> {

    Optional<Balance> findByAccount(Account account);

    boolean existsByAccount(Account account);

}