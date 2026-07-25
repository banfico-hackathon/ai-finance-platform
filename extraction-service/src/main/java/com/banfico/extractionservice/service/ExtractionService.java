package com.banfico.extractionservice.service;

import com.banfico.extractionservice.dto.*;
import com.banfico.extractionservice.entity.Account;
import com.banfico.extractionservice.entity.Balance;
import com.banfico.extractionservice.entity.Transaction;
import com.banfico.extractionservice.repository.AccountRepository;
import com.banfico.extractionservice.repository.BalanceRepository;
import com.banfico.extractionservice.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
public class ExtractionService {

    private final BankApiService bankApiService;

    private final AccountRepository accountRepository;
    private final BalanceRepository balanceRepository;
    private final TransactionRepository transactionRepository;

    public void syncBankData(String token) {

        AccountsResponse accountsResponse = bankApiService.getAccounts(token);

        if (accountsResponse == null
                || accountsResponse.getData() == null
                || accountsResponse.getData().getAccount() == null) {
            return;
        }

        for (AccountDto accountDto : accountsResponse.getData().getAccount()) {

            // Save Account
            Account account = new Account();

            account.setAccountId(accountDto.getAccountId());
            account.setNickname(accountDto.getNickname());
            account.setStatus(accountDto.getStatus());
            account.setCurrency(accountDto.getCurrency());
            account.setAccountCategory(accountDto.getAccountCategory());
            account.setAccountType(accountDto.getAccountTypeCode());

            account = accountRepository.save(account);

            // Fetch Balance
            BalancesResponse balanceResponse =
                    bankApiService.getBalance(token, accountDto.getAccountId());

            if (balanceResponse != null
                    && balanceResponse.getData() != null
                    && !balanceResponse.getData().getBalance().isEmpty()) {

                BalanceDto dto = balanceResponse.getData().getBalance().get(0);

                Balance balance = new Balance();

                balance.setAccount(account);
                balance.setAmount(
                        new BigDecimal(dto.getAmount().getAmount())
                );

                balance.setBalanceType(dto.getType());

                balance.setLastUpdated(
                        OffsetDateTime.parse(dto.getDateTime())
                );
                balance.setCurrency(dto.getAmount().getCurrency());

                balance.setCreditDebitIndicator(dto.getCreditDebitIndicator());

                balanceRepository.save(balance);
            }

            // Fetch Transactions
            TransactionsResponse transactionsResponse =
                    bankApiService.getTransactions(token, accountDto.getAccountId());

            if (transactionsResponse != null
                    && transactionsResponse.getData() != null
                    && transactionsResponse.getData().getTransaction() != null) {

                for (TransactionDto dto : transactionsResponse.getData().getTransaction()) {

                    Transaction transaction = new Transaction();

                    transaction.setAccount(account);
                    transaction.setTransactionId(dto.getTransactionId());
                    transaction.setCurrency(dto.getAmount().getCurrency());
                    transaction.setStatus(dto.getStatus());
                    transaction.setAmount(
                            new BigDecimal(dto.getAmount().getAmount())
                    );

                    transaction.setCurrency(dto.getAmount().getCurrency());
                    transaction.setCreditDebitIndicator(dto.getCreditDebitIndicator());
                    transaction.setStatus(dto.getStatus());
                    transaction.setDescription(
                            dto.getTransactionInformation()
                    );
                    transaction.setBookingDate(
                            OffsetDateTime.parse(dto.getBookingDateTime())
                    );
                    transaction.setValueDate(
                            OffsetDateTime.parse(dto.getValueDateTime())
                    );

                    if (dto.getMerchantDetails() != null) {
                        transaction.setMerchantName(
                                dto.getMerchantDetails().getMerchantName());
                    }

                    transactionRepository.save(transaction);
                }
            }
        }
    }
}