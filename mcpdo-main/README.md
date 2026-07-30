# Automated Todo

A Spring Boot application that demonstrates how to integrate AI tools into a Todo Management System. The application allows users to create, manage, update, and delete todos while exposing AI-powered tools that can be invoked by Large Language Models (LLMs) through Spring AI.

---

# Features

* Create new todo items.
* View all todos.
* Search todos by ID.
* Update existing todos.
* Delete todos.
* AI-powered Todo tools using Spring AI.
* RESTful API design.
* Exception handling with custom exceptions.
* Clean and modular project structure.

---

# Tech Stack

* Java 21
* Spring Boot 3.x
* Spring AI
* Maven
* REST API
* IntelliJ IDEA / VS Code

---

# Project Structure

```text
src
├── controller
│   └── TodoController
├── service
│   ├── TodoService
│   └── TodoTools
├── model
│   └── Todo
├── exception
│   ├── NoSuchTodoException
│   └── GlobalExceptionHandler
└── AutomatedTodoApplication
```

---

# Getting Started

## Prerequisites

* Java 21 or later
* Maven 3.9+
* IntelliJ IDEA or VS Code

---

## Clone the Repository

```bash
git clone <repository-url>
cd automated-todo
```

---

## Build the Project

```bash
mvn clean install
```

---

## Run the Application

```bash
mvn spring-boot:run
```

The application starts at:

```text
http://localhost:8080
```

---

# REST API Endpoints

| Method | Endpoint      | Description             |
| ------ | ------------- | ----------------------- |
| GET    | `/todos`      | Retrieve all todos      |
| GET    | `/todos/{id}` | Retrieve a todo by ID   |
| POST   | `/todos`      | Create a new todo       |
| PUT    | `/todos/{id}` | Update an existing todo |
| DELETE | `/todos/{id}` | Delete a todo           |

---

# AI Tools

The project exposes Todo operations as AI tools using **Spring AI**.

Example capabilities:

* Create a todo
* List all todos
* Find a todo by ID
* Update a todo
* Delete a todo

These tools can be invoked directly by an AI model to automate Todo management.

---

# Sample Todo

```json
{
  "id": 1,
  "title": "Complete Spring AI project",
  "completed": false
}
```

---

# Future Improvements

* Vector database integration

---

# Author

**Aswin RJ**

Java Backend Developer | Spring Boot | Spring AI | REST APIs | Microservices

---

# License

This project is licensed under the MIT License.
