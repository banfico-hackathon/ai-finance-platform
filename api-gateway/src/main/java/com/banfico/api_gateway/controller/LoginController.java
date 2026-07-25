package com.banfico.api_gateway.controller;

import com.banfico.api_gateway.dto.LoginRequest;
import com.banfico.api_gateway.dto.LoginResponse;
import com.banfico.api_gateway.service.BankTokenService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
public class LoginController {

    private final BankTokenService bankTokenService;

    public LoginController(BankTokenService bankTokenService) {
        this.bankTokenService = bankTokenService;
    }

    @PostMapping("/api/login")
    public Mono<LoginResponse> login(@RequestBody LoginRequest request) {
        return bankTokenService.login(request.username(), request.password())
                .map(expiresIn -> new LoginResponse("authenticated", expiresIn));
    }
}