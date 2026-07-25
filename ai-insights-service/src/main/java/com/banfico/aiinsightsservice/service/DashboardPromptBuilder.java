package com.banfico.aiinsightsservice.service;

import com.banfico.aiinsightsservice.dto.DashboardRequest;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Component;

@Component
public class DashboardPromptBuilder {

    public String buildPrompt(DashboardRequest request) {
        String accountsJson = toJsonText(request == null ? null : request.accounts());
        String balancesJson = toJsonText(request == null ? null : request.balances());
        String transactionsJson = toJsonText(request == null ? null : request.transactions());

        return """
                You are a financial insight analyst for an open banking dashboard.

                Analyze the supplied banking data across all six core dimensions:
                1. Spending summaries and average monthly spend.
                2. Monthly spending analysis and category breakdown.
                3. Income versus expense trends and income stability.
                4. Category-wise expenditure insights.
                5. Unusual spending detection and anomaly or risk alerts.
                6. Overall financial health observations.

                Handle missing, null, empty, or inconsistent fields cleanly.
                Do not invent precise values when the supplied data is insufficient.

                Accounts JSON:
                %s

                Balances JSON:
                %s

                Transactions JSON:
                %s

                Return STRICT JSON only. Do not include backticks, markdown, comments, introductory text, or trailing prose.
                The response must exactly match this JSON schema and field naming:
                {
                  "summary": "string",
                  "healthScore": 0,
                  "grade": "string",
                  "spendingAnalysis": {
                    "largestCategory": "string",
                    "monthlyTrend": "string",
                    "averageMonthlySpend": "string",
                    "keyObservation": "string"
                  },
                  "incomeAnalysis": {
                    "stability": "string",
                    "trend": "string",
                    "keyObservation": "string"
                  },
                  "savingAnalysis": {
                    "savingRate": "string",
                    "emergencyFund": "string",
                    "keyObservation": "string"
                  },
                  "insights": ["string"],
                  "recommendations": ["string"],
                  "risks": ["string"]
                }

                healthScore must be an integer from 0 to 100.
                grade must be one of "A", "B", "C", "D", or "E".
                """.formatted(accountsJson, balancesJson, transactionsJson);
    }

    private String toJsonText(JsonNode jsonNode) {
        if (jsonNode == null || jsonNode.isNull() || jsonNode.isMissingNode()) {
            return "{}";
        }
        return jsonNode.toString();
    }
}
