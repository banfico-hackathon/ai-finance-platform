package com.banfico.extractionservice.dto;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class TransactionDto {

    private String TransactionId;
    private String AccountId;
    private String TransactionReference;
    private String CreditDebitIndicator;
    private String Status;
    private String BookingDateTime;
    private String ValueDateTime;
    private String TransactionInformation;

    private AmountDto Amount;

    private MerchantDetailsDto MerchantDetails;
}