package com.banfico.extractionservice.service;

import com.banfico.extractionservice.dto.AccountsResponse;
import com.banfico.extractionservice.dto.BalancesResponse;
import com.banfico.extractionservice.dto.TransactionsResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class BankApiService {

    private final RestTemplate restTemplate;

    @Value("${bank.api.base-url}")
    private String baseUrl;

    public AccountsResponse getAccounts(String token) {

        HttpEntity<Void> entity = new HttpEntity<>(createHeaders(token));

        ResponseEntity<AccountsResponse> response = restTemplate.exchange(
                baseUrl + "/api/obie-aisp/v4.0/accounts?type=domestic",
                HttpMethod.GET,
                entity,
                AccountsResponse.class
        );

        return response.getBody();
    }

    public BalancesResponse getBalance(String token, String accountId) {

        HttpEntity<Void> entity = new HttpEntity<>(createHeaders(token));

        ResponseEntity<BalancesResponse> response = restTemplate.exchange(
                baseUrl + "/api/obie-aisp/v4.0/accounts/" + accountId + "/balances",
                HttpMethod.GET,
                entity,
                BalancesResponse.class
        );

        return response.getBody();
    }

    public TransactionsResponse getTransactions(String token, String accountId) {

        HttpEntity<Void> entity = new HttpEntity<>(createHeaders(token));

        ResponseEntity<TransactionsResponse> response = restTemplate.exchange(
                baseUrl + "/api/obie-aisp/v4.0/accounts/" + accountId + "/transactions",
                HttpMethod.GET,
                entity,
                TransactionsResponse.class
        );

        return response.getBody();
    }

    private HttpHeaders createHeaders(String token) {

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setAccept(java.util.List.of(MediaType.APPLICATION_JSON));

        return headers;
    }
}