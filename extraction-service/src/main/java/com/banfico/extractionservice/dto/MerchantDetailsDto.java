package com.banfico.extractionservice.dto;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class MerchantDetailsDto {

    private String MerchantName;
    private String MerchantCategoryCode;
}
