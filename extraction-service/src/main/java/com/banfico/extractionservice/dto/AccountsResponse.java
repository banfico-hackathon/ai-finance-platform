package com.banfico.extractionservice.dto;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class AccountsResponse {

    @JsonProperty("Data")
    private DataWrapper data;

    @Data
    public static class DataWrapper {

        @JsonProperty("Account")
        private List<AccountDto> account;
    }
}