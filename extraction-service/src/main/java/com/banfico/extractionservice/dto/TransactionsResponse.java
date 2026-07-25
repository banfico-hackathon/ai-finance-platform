package com.banfico.extractionservice.dto;


import lombok.Data;

import java.util.List;

@Data
public class TransactionsResponse {

    private DataWrapper Data;

    @Data
    public static class DataWrapper {
        private List<TransactionDto> Transaction;
    }
}
