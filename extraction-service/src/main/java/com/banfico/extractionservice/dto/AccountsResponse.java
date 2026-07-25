package com.banfico.extractionservice.dto;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccountsResponse {

    @JsonProperty("Data")
    private DataWrapper data;

    @Data
    public static class DataWrapper {

        @JsonProperty("Account")
        private List<AccountDto> account;
    }
}