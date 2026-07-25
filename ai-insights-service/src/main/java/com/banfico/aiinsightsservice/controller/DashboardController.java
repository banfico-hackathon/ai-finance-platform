package com.banfico.aiinsightsservice.controller;

import com.banfico.aiinsightsservice.dto.DashboardRequest;
import com.banfico.aiinsightsservice.dto.DashboardResponse;
import com.banfico.aiinsightsservice.service.DashboardService;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @PostMapping("/dashboard")
    public ResponseEntity<DashboardResponse> processDashboard(@RequestBody DashboardRequest request) {
        if (request == null || lacksData(request)) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(dashboardService.processDashboard(request));
    }

    private boolean lacksData(DashboardRequest request) {
        return isEmpty(request.accounts()) && isEmpty(request.balances()) && isEmpty(request.transactions());
    }

    private boolean isEmpty(JsonNode jsonNode) {
        return jsonNode == null || jsonNode.isNull() || jsonNode.isMissingNode() || jsonNode.isEmpty();
    }
}
