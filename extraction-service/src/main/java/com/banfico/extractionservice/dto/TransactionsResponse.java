package com.banfico.extractionservice.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransactionsResponse {

    private DataWrapper Data;

    @Data
    public static class DataWrapper {
        private List<TransactionDto> Transaction;
    }
}
