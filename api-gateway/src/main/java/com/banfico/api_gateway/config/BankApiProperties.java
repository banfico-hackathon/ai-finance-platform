package com.banfico.api_gateway.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "bank.api")
public record BankApiProperties(
        String domain,
        String tenant,
        String clientId,
        String clientSecret
) {}