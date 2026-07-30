package com.mcp.automated_todo.controller;

import com.mcp.automated_todo.service.TodoTools;
import jakarta.servlet.http.HttpSession;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5175", "http://localhost:3000", "http://localhost:8888", "http://127.0.0.1:5173", "http://127.0.0.1:5175"}, allowCredentials = "true")
public class ChatController {

    private final ChatClient chatClient;

    public ChatController(OllamaChatModel ollamaChatModel, TodoTools todoTools, ChatMemory chatMemory) {
        this.chatClient = ChatClient.builder(ollamaChatModel)
                .defaultTools(todoTools)
                .defaultSystem("""
                    You are a helpful todo-list assistant. Use the available tools
                    to add, list, complete, update, or delete todos based on what
                    the user asks. Always confirm what action you took.
                    """)
                .defaultAdvisors(MessageChatMemoryAdvisor.builder(chatMemory).build())
                .build();
    }

    public record ChatRequest(String message) {}
    public record ChatResponse(String reply) {}

    @PostMapping
    public ChatResponse chat(@RequestBody ChatRequest request, HttpSession session) {
        String conversationId = session.getId();

        String reply = chatClient.prompt()
                .user(request.message())
                .advisors(a -> a.param(ChatMemory.CONVERSATION_ID, conversationId))
                .call()
                .content();

        return new ChatResponse(reply);
    }
}
