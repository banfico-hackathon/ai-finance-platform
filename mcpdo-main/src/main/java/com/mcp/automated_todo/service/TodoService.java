package com.mcp.automated_todo.service;


import com.mcp.automated_todo.exception.NoSuchTodoException;
import com.mcp.automated_todo.model.Todo;
import com.mcp.automated_todo.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TodoService {

    private final TodoRepository repository;


    public List<Todo> getAll(String filter) {
        String f = (filter == null) ? "all" : filter.toLowerCase();
        return switch (f) {
            case "completed" -> repository.findByCompleted(true);
            case "pending" -> repository.findByCompleted(false);
            default -> repository.findAll();
        };
    }

    public Todo getById(long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NoSuchTodoException(id));
    }

    public Todo create(String title) {
        return repository.save(new Todo(title));
    }

    public Todo updateTitle(long id, String newTitle) {
        Todo todo = getById(id);
        todo.setTitle(newTitle);
        return repository.save(todo);
    }

    public Todo markComplete(long id) {
        Todo todo = getById(id);
        todo.setCompleted(true);
        return repository.save(todo);
    }

    public void delete(long id) {
        if (!repository.existsById(id)) {
            throw new NoSuchTodoException(id);
        }
        repository.deleteById(id);
    }
}