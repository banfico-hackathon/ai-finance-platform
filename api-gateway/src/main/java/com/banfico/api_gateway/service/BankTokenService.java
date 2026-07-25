package com.banfico.api_gateway.service;

import com.banfico.api_gateway.config.BankApiProperties;
import com.banfico.api_gateway.dto.TokenResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Instant;

@Slf4j
@Service
public class BankTokenService {

    private final WebClient authWebClient;
    private final BankApiProperties props;

    private volatile String accessToken;
    private volatile String refreshToken;
    private volatile Instant expiresAt = Instant.EPOCH;

    public BankTokenService(WebClient.Builder builder, BankApiProperties props) {
        this.props = props;
        this.authWebClient = builder.baseUrl("https://auth." + props.domain()).build();
    }

    /** Called by POST /api/login with credentials supplied by the caller. */
    public Mono<Long> login(String username, String password) {
        var body = BodyInserters.fromFormData("grant_type", "password")
                .with("client_id", props.clientId())
                .with("client_secret", props.clientSecret())
                .with("username", username)
                .with("password", password);

        return callTokenEndpoint(body).map(TokenResponse::expiresIn);
    }

    /** Called by BankTokenGlobalFilter on every downstream banking request. */
    public Mono<String> getValidToken() {
        if (accessToken != null && Instant.now().isBefore(expiresAt.minusSeconds(30))) {
            return Mono.just(accessToken);
        }

        if (accessToken == null) {
            return Mono.error(new IllegalStateException("Not logged in — call /api/login first"));
        }

        var body = BodyInserters.fromFormData("grant_type", "refresh_token")
                .with("client_id", props.clientId())
                .with("client_secret", props.clientSecret())
                .with("refresh_token", refreshToken);

        return callTokenEndpoint(body)
                .map(TokenResponse::accessToken)
                .onErrorMap(ex -> new IllegalStateException("Token expired — call /api/login again", ex));
    }

    private Mono<TokenResponse> callTokenEndpoint(BodyInserters.FormInserter<String> body) {
        return authWebClient.post()
                .uri("/auth/realms/{tenant}/protocol/openid-connect/token", props.tenant())
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(body)
                .retrieve()
                .bodyToMono(TokenResponse.class)
                .doOnNext(resp -> {
                    this.accessToken = resp.accessToken();
                    this.refreshToken = resp.refreshToken();
                    this.expiresAt = Instant.now().plusSeconds(resp.expiresIn());
                    log.info("Bank token acquired, expires at {}", expiresAt);
                });
    }
}