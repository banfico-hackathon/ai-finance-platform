package com.mcp.automated_todo.exception;

public class NoSuchTodoException extends RuntimeException {
    public NoSuchTodoException(long id) {
        super("No todo found with id " + id);
    }
}