package com.banfico.extractionservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@AllArgsConstructor
@NoArgsConstructor
public class BalanceDto {

    private String AccountId;
    private String CreditDebitIndicator;
    private String Type;
    private String DateTime;

    private AmountDto Amount;
}