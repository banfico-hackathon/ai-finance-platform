package com.mcp.automated_todo.service;


import com.mcp.automated_todo.exception.NoSuchTodoException;
import com.mcp.automated_todo.model.Todo;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class TodoTools {

    private final TodoService todoService;

    public TodoTools(TodoService todoService) {
        this.todoService = todoService;
    }

    @Tool(description = "Add a new todo item with the given title")
    public String addTodo(@ToolParam(description = "The title/text of the todo") String title) {
        Todo todo = todoService.create(title);
        return "Added: " + format(todo);
    }

    @Tool(description = "List all todo items, optionally filtered by completion status (all, completed, pending)")
    public String listTodos(@ToolParam(description = "Filter: all, completed, or pending", required = false) String filter) {
        List<Todo> todos = todoService.getAll(filter);
        if (todos.isEmpty()) return "No todos found.";
        return todos.stream().map(this::format).collect(Collectors.joining("\n"));
    }

    @Tool(description = "Mark a todo item as completed, given its id")
    public String completeTodo(@ToolParam(description = "The id of the todo to complete") long id) {
        try {
            return "Completed: " + format(todoService.markComplete(id));
        } catch (NoSuchTodoException e) {
            return e.getMessage();
        }
    }

    @Tool(description = "Delete a todo item, given its id")
    public String deleteTodo(@ToolParam(description = "The id of the todo to delete") long id) {
        try {
            Todo todo = todoService.getById(id);
            todoService.delete(id);
            return "Deleted: " + format(todo);
        } catch (NoSuchTodoException e) {
            return e.getMessage();
        }
    }

    @Tool(description = "Update the title of an existing todo item")
    public String updateTodo(@ToolParam(description = "The id of the todo") long id,
                              @ToolParam(description = "The new title") String newTitle) {
        try {
            return "Updated: " + format(todoService.updateTitle(id, newTitle));
        } catch (NoSuchTodoException e) {
            return e.getMessage();
        }
    }

    private String format(Todo todo) {
        return "#" + todo.getId() + " [" + (todo.isCompleted() ? "x" : " ") + "] " + todo.getTitle();
    }
}