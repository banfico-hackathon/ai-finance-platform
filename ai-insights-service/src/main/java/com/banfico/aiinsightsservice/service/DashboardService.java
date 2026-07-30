package com.banfico.aiinsightsservice.service;

import com.banfico.aiinsightsservice.dto.DashboardRequest;
import com.banfico.aiinsightsservice.dto.DashboardResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final DashboardPromptBuilder promptBuilder;
    private final AiService aiService;
    private final ObjectMapper objectMapper;

    public DashboardService(DashboardPromptBuilder promptBuilder, AiService aiService, ObjectMapper objectMapper) {
        this.promptBuilder = promptBuilder;
        this.aiService = aiService;
        this.objectMapper = objectMapper;
    }

    public DashboardResponse processDashboard(DashboardRequest request) {
        try {
            String prompt = promptBuilder.buildPrompt(request);
            String rawOutput = aiService.generateAnalysis(prompt);
            String jsonOutput = cleanAiJson(rawOutput);
            return parseDashboardResponse(jsonOutput);
        } catch (Exception ex) {
            return fallbackResponse();
        }
    }

    private String cleanAiJson(String rawOutput) {
        if (rawOutput == null || rawOutput.isBlank()) {
            return "{}";
        }

        String cleaned = rawOutput.trim();
        if (cleaned.startsWith("```")) {
            cleaned = cleaned.replaceFirst("^```(?:json|JSON)?\\s*", "");
            cleaned = cleaned.replaceFirst("\\s*```$", "");
        }

        int firstObjectIndex = cleaned.indexOf('{');
        int lastObjectIndex = cleaned.lastIndexOf('}');
        if (firstObjectIndex >= 0 && lastObjectIndex > firstObjectIndex) {
            return cleaned.substring(firstObjectIndex, lastObjectIndex + 1).trim();
        }

        return cleaned;
    }

    private DashboardResponse parseDashboardResponse(String jsonOutput) throws JsonProcessingException {
        try {
            return normalizeResponse(objectMapper.readValue(jsonOutput, DashboardResponse.class));
        } catch (JsonProcessingException ex) {
            return responseFromJsonNode(objectMapper.readTree(jsonOutput));
        }
    }

    private DashboardResponse normalizeResponse(DashboardResponse response) {
        if (response == null) {
            return fallbackResponse();
        }

        return new DashboardResponse(
                defaultText(response.summary(), "Financial dashboard analysis completed with limited available detail."),
                clampHealthScore(response.healthScore()),
                normalizeGrade(response.grade()),
                normalizeSpendingAnalysis(response.spendingAnalysis()),
                normalizeIncomeAnalysis(response.incomeAnalysis()),
                normalizeSavingAnalysis(response.savingAnalysis()),
                defaultList(response.insights(), "No detailed insights were returned by the AI model."),
                defaultList(response.recommendations(), "Review the source account, balance, and transaction data before making financial decisions."),
                defaultList(response.risks(), "No specific risks were returned by the AI model.")
        );
    }

    private DashboardResponse responseFromJsonNode(JsonNode rootNode) {
        if (rootNode == null || !rootNode.isObject()) {
            return fallbackResponse();
        }

        return new DashboardResponse(
                textValue(rootNode, "summary", "Financial dashboard analysis completed with limited available detail."),
                clampHealthScore(rootNode.path("healthScore").asInt(0)),
                normalizeGrade(textValue(rootNode, "grade", "E")),
                spendingAnalysisFromJsonNode(rootNode.path("spendingAnalysis")),
                incomeAnalysisFromJsonNode(rootNode.path("incomeAnalysis")),
                savingAnalysisFromJsonNode(rootNode.path("savingAnalysis")),
                listValue(rootNode.path("insights"), "No detailed insights were returned by the AI model."),
                listValue(rootNode.path("recommendations"), "Review the source account, balance, and transaction data before making financial decisions."),
                listValue(rootNode.path("risks"), "No specific risks were returned by the AI model.")
        );
    }

    private DashboardResponse.SpendingAnalysis spendingAnalysisFromJsonNode(JsonNode node) {
        return new DashboardResponse.SpendingAnalysis(
                textValue(node, "largestCategory", "Not enough data"),
                textValue(node, "monthlyTrend", "Not enough data"),
                textValue(node, "averageMonthlySpend", "Not enough data"),
                textValue(node, "keyObservation", "Not enough data")
        );
    }

    private DashboardResponse.IncomeAnalysis incomeAnalysisFromJsonNode(JsonNode node) {
        return new DashboardResponse.IncomeAnalysis(
                textValue(node, "stability", "Not enough data"),
                textValue(node, "trend", "Not enough data"),
                textValue(node, "keyObservation", "Not enough data")
        );
    }

    private DashboardResponse.SavingAnalysis savingAnalysisFromJsonNode(JsonNode node) {
        return new DashboardResponse.SavingAnalysis(
                textValue(node, "savingRate", "Not enough data"),
                textValue(node, "emergencyFund", "Not enough data"),
                textValue(node, "keyObservation", "Not enough data")
        );
    }

    private DashboardResponse.SpendingAnalysis normalizeSpendingAnalysis(DashboardResponse.SpendingAnalysis spendingAnalysis) {
        if (spendingAnalysis == null) {
            return spendingAnalysisFromJsonNode(null);
        }

        return new DashboardResponse.SpendingAnalysis(
                defaultText(spendingAnalysis.largestCategory(), "Not enough data"),
                defaultText(spendingAnalysis.monthlyTrend(), "Not enough data"),
                defaultText(spendingAnalysis.averageMonthlySpend(), "Not enough data"),
                defaultText(spendingAnalysis.keyObservation(), "Not enough data")
        );
    }

    private DashboardResponse.IncomeAnalysis normalizeIncomeAnalysis(DashboardResponse.IncomeAnalysis incomeAnalysis) {
        if (incomeAnalysis == null) {
            return incomeAnalysisFromJsonNode(null);
        }

        return new DashboardResponse.IncomeAnalysis(
                defaultText(incomeAnalysis.stability(), "Not enough data"),
                defaultText(incomeAnalysis.trend(), "Not enough data"),
                defaultText(incomeAnalysis.keyObservation(), "Not enough data")
        );
    }

    private DashboardResponse.SavingAnalysis normalizeSavingAnalysis(DashboardResponse.SavingAnalysis savingAnalysis) {
        if (savingAnalysis == null) {
            return savingAnalysisFromJsonNode(null);
        }

        return new DashboardResponse.SavingAnalysis(
                defaultText(savingAnalysis.savingRate(), "Not enough data"),
                defaultText(savingAnalysis.emergencyFund(), "Not enough data"),
                defaultText(savingAnalysis.keyObservation(), "Not enough data")
        );
    }

    private String textValue(JsonNode node, String fieldName, String defaultValue) {
        if (node == null || !node.isObject()) {
            return defaultValue;
        }

        JsonNode valueNode = node.path(fieldName);
        if (valueNode.isMissingNode() || valueNode.isNull()) {
            return defaultValue;
        }

        return defaultText(valueNode.asText(), defaultValue);
    }

    private List<String> listValue(JsonNode node, String defaultValue) {
        if (node == null || !node.isArray()) {
            return List.of(defaultValue);
        }

        List<String> values = new ArrayList<>();
        for (JsonNode itemNode : node) {
            if (itemNode != null && !itemNode.isNull()) {
                String value = itemNode.isTextual() ? itemNode.asText() : itemNode.toString();
                if (!value.isBlank()) {
                    values.add(value);
                }
            }
        }

        return values.isEmpty() ? List.of(defaultValue) : List.copyOf(values);
    }

    private List<String> defaultList(List<String> values, String defaultValue) {
        if (values == null || values.isEmpty()) {
            return List.of(defaultValue);
        }

        List<String> normalizedValues = values.stream()
                .filter(value -> value != null && !value.isBlank())
                .toList();

        return normalizedValues.isEmpty() ? List.of(defaultValue) : normalizedValues;
    }

    private String defaultText(String value, String defaultValue) {
        return value == null || value.isBlank() ? defaultValue : value;
    }

    private int clampHealthScore(int healthScore) {
        return Math.max(0, Math.min(100, healthScore));
    }

    private String normalizeGrade(String grade) {
        String normalizedGrade = defaultText(grade, "E").trim().toUpperCase();
        return switch (normalizedGrade) {
            case "A", "B", "C", "D", "E" -> normalizedGrade;
            default -> "E";
        };
    }

    private DashboardResponse fallbackResponse() {
        return new DashboardResponse(
                "Unable to generate a complete dashboard analysis from the supplied data at this time.",
                0,
                "E",
                new DashboardResponse.SpendingAnalysis(
                        "Not enough data",
                        "Not enough data",
                        "Not enough data",
                        "Spending analysis could not be completed because the AI response was unavailable or invalid."
                ),
                new DashboardResponse.IncomeAnalysis(
                        "Not enough data",
                        "Not enough data",
                        "Income analysis could not be completed because the AI response was unavailable or invalid."
                ),
                new DashboardResponse.SavingAnalysis(
                        "Not enough data",
                        "Not enough data",
                        "Saving analysis could not be completed because the AI response was unavailable or invalid."
                ),
                List.of("Dashboard analysis is temporarily unavailable."),
                List.of("Please retry the analysis after confirming that account, balance, and transaction data are available."),
                List.of("AI-generated insight parsing failed or returned an incomplete response.")
        );
    }
}
