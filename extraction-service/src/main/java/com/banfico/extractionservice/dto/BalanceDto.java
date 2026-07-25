package com.banfico.extractionservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class BalanceDto {

    private String AccountId;
    private String CreditDebitIndicator;
    private String Type;
    private String DateTime;

    private AmountDto Amount;
}