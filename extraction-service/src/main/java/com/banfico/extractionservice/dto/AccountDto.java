package com.banfico.extractionservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class AccountDto {

    @JsonProperty("AccountId")
    private String accountId;

    @JsonProperty("Nickname")
    private String nickname;

    @JsonProperty("Status")
    private String status;

    @JsonProperty("Currency")
    private String currency;

    @JsonProperty("AccountCategory")
    private String accountCategory;

    @JsonProperty("AccountTypeCode")
    private String accountTypeCode;

    @JsonProperty("OpeningDate")
    private String openingDate;
}