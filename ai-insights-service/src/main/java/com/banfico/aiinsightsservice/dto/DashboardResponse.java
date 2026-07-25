package com.banfico.aiinsightsservice.dto;

import java.util.List;

public record DashboardResponse(
        String summary,
        int healthScore,
        String grade,
        SpendingAnalysis spendingAnalysis,
        IncomeAnalysis incomeAnalysis,
        SavingAnalysis savingAnalysis,
        List<String> insights,
        List<String> recommendations,
        List<String> risks
) {
    public record SpendingAnalysis(
            String largestCategory,
            String monthlyTrend,
            String averageMonthlySpend,
            String keyObservation
    ) {
    }

    public record IncomeAnalysis(
            String stability,
            String trend,
            String keyObservation
    ) {
    }

    public record SavingAnalysis(
            String savingRate,
            String emergencyFund,
            String keyObservation
    ) {
    }
}
