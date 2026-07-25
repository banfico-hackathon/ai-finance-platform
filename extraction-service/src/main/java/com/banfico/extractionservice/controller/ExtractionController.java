package com.banfico.extractionservice.controller;


import com.banfico.extractionservice.service.ExtractionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/extraction")
@RequiredArgsConstructor
public class ExtractionController {

    private final ExtractionService extractionService;

    @PostMapping("/sync")
    public ResponseEntity<String> sync(
            @RequestHeader("X-Bank-Token") String authorization) {

        String token = authorization.replace("Bearer ", "");

        extractionService.syncBankData(token);

        return ResponseEntity.ok("Synchronization completed successfully.");
    }
}