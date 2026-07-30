package com.banfico.aiinsightsservice.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class AiService {

    private final ChatClient chatClient;

    public AiService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    public String generateAnalysis(String prompt) {
        String content = chatClient.prompt()
                .user(prompt)
                .call()
                .content();
        return content == null ? "" : content;
    }
}
