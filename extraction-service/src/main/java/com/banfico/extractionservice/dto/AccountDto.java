package com.banfico.extractionservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class AccountDto {

    private String AccountId;
    private String Nickname;
    private String Status;
    private String Currency;
    private String AccountCategory;
    private String AccountTypeCode;
    private String OpeningDate;
}