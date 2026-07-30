package com.mcp.automated_todo.config;


import com.mcp.automated_todo.service.TodoTools;
import org.springframework.ai.support.ToolCallbacks;
import org.springframework.ai.tool.ToolCallback;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class McpConfig {

    @Bean
    public ToolCallback[] todoToolCallbacks(TodoTools todoTools) {
        return ToolCallbacks.from(todoTools);
    }
}