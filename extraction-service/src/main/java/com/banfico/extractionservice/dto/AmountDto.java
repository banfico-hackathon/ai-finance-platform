package com.banfico.extractionservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class AmountDto {

    private String Amount;
    private String Currency;
}