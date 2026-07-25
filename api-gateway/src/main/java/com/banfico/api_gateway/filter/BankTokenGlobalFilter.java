package com.banfico.api_gateway.filter;

import com.banfico.api_gateway.service.BankTokenService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Slf4j
@Component
public class BankTokenGlobalFilter implements GlobalFilter, Ordered {

    private final BankTokenService bankTokenService;

    public BankTokenGlobalFilter(BankTokenService bankTokenService) {
        this.bankTokenService = bankTokenService;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getURI().getPath();

        if (!path.startsWith("/api/banking")) {
            return chain.filter(exchange);
        }

        return bankTokenService.getValidToken()
                .doOnNext(token -> log.info("Bank token attached to {}: {}", path, token))
                .flatMap(bankToken -> {
                    ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                            .header("X-Bank-Token", bankToken)
                            .build();
                    return chain.filter(exchange.mutate().request(mutatedRequest).build());
                });
    }

    @Override
    public int getOrder() {
        return 0;
    }
}