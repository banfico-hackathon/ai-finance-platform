package com.banfico.extractionservice.dto;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
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