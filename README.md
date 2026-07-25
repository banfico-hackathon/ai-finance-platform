AI Financial Platform

> An intelligent, open-banking financial ecosystem powered by Google Gemini 2.5 Flash, Ollama (`llama3.2`), and distributed microservices.

this platform bridges the gap between complex banking ledgers and actionable financial decisions. Built for modern open-banking standards, Banfico pairs real-time **OBIE AISP v3.1** data with hybrid cloud/local LLM AI microservices to audit cashflow, detect spending anomalies, automate savings sweeps, and manage automated task workflows.

---

## 🛠️ Architecture & System Design

Banfico operates as a distributed microservices ecosystem routed via an API Gateway and coordinated by a service discovery registry.

### 1. High-Level Microservices Routing Architecture

```mermaid
flowchart TD
    classDef client fill:#2d3748,stroke:#4a5568,color:#fff,stroke-width:2px;
    classDef gateway fill:#0f766e,stroke:#14b8a6,color:#fff,stroke-width:2px;
    classDef registry fill:#c2410c,stroke:#f97316,color:#fff,stroke-width:2px;
    classDef service fill:#4338ca,stroke:#6366f1,color:#fff,stroke-width:2px;

    Client["📱 React 19 Frontend\n(Vite / Glassmorphism UI)"]:::client
    Gateway["🚪 Spring Cloud Gateway\n(Port 8080)"]:::gateway
    Eureka["🔍 Eureka Discovery Service\n(Port 8761 / Service Registry)"]:::registry

    subgraph Microservices ["Backend Microservices Layer"]
        DjangoService["🐍 Django REST Service\n(Port 8001 / Chat & Recs)"]:::service
        McpdoService["☕ mcpdo Spring Boot Service\n(Port 8081 / Spring AI Todo)"]:::service
        InsightsService["💡 AI Insights Service\n(Port 8002 / Financial AI)"]:::service
    end

    Client --> Gateway
    Gateway <--> Eureka

    Gateway --> DjangoService
    Gateway --> McpdoService
    Gateway --> InsightsService

    DjangoService -.- Eureka
    McpdoService -.- Eureka
    InsightsService -.- Eureka
```

### 2. Hybrid AI & External Integration Pipeline

```mermaid
flowchart TD
    classDef client fill:#2d3748,stroke:#4a5568,color:#fff,stroke-width:2px;
    classDef service fill:#4338ca,stroke:#6366f1,color:#fff,stroke-width:2px;
    classDef cloudAI fill:#b45309,stroke:#f59e0b,color:#fff,stroke-width:2px;
    classDef localAI fill:#a16207,stroke:#eab308,color:#fff,stroke-width:2px;
    classDef external fill:#991b1b,stroke:#ef4444,color:#fff,stroke-width:2px;

    Client["📱 React 19 Frontend"]:::client
    Django["🐍 Django REST Service"]:::service
    Mcpdo["☕ mcpdo Spring Boot"]:::service
    Insights["💡 AI Insights Service"]:::service

    Gemini["☁️ Google Gemini API\n(gemini-2.5-flash)"]:::cloudAI
    Ollama["🏠 Local Ollama Server\n(llama3.2)"]:::localAI
    OBIE["🏦 OBIE AISP Sandbox API\n(v3.1 Open Banking)"]:::external

    Client -->|Direct Sync| OBIE
    Django -->|Cloud LLM Inference| Gemini
    Insights -->|Cloud LLM Inference| Gemini
    Mcpdo -->|Local LLM Operations| Ollama
    Insights -->|Local Anomaly Fallback| Ollama
```

## 🧰 Tech Stack

| Layer | Technologies / Tools |
|---|---|
| Frontend | React 19, Vite, Framer Motion, ApexCharts, Glassmorphism CSS |
| Microservices Backend | Java 21 (Spring Boot 3.x, Spring AI, Spring Cloud Gateway), Python 3.14 (Django REST Framework) |
| AI & LLMs | Google Gemini 2.5 Flash (google-genai), Ollama (llama3.2) |
| Service Mesh & Infra | Netflix Eureka Discovery Service, Docker & Docker Compose |
| Open Banking Protocols | OBIE AISP v3.1 Standards |
| Authentication & Access | Keycloak OpenID Connect (OIDC) |

## ✨ Key Features

- **Hybrid AI Engine**: Combines Google Gemini 2.5 Flash for deep financial summary tasks with a local Ollama (llama3.2) instance for local agentic task automation and private fallback analytics.
- **Smart Vault Auto-Sweeps**: Calculates real-time net surplus across checking accounts and prompts automated transfers into 4.30% APY high-yield savings vaults.
- **Financial Anomaly & Subscription Audits**: Analyzes recurring transaction streams to flag vendor price increases and unused subscription services.
- **Dynamic Timeframe Analytics**: Instant filtering across 7-Day, 30-Day, 90-Day, and YTD windows with dynamic metric recalculations.
- **Open Banking Native**: Direct compatibility with Open Banking Implementation Entity (OBIE) AISP specifications.

## 📁 Repository Structure

```
ai-finance-platform/
├── frontend/                     # React 19 + Vite UI
│   ├── src/
│   │   ├── api/                  # API Services (chatApi, recommendationApi, insightsApi, obieApi)
│   │   ├── components/           # UI Components (ChatModal, Navbar, InsightsCard)
│   │   └── pages/                # Dashboard, Spending, Transactions, Insights
├── django-chat-service/          # Django REST Framework + Gemini 2.5 Chat & Recs Microservice
├── ai-insights-service/          # Dedicated Financial Intelligence & Anomaly Detection Service
├── mcpdo-main/                   # Spring Boot + Ollama AI Automated Task Microservice
├── api-gateway/                  # Spring Cloud API Gateway (Port 8080)
├── discovery-service/            # Netflix Eureka Service Registry (Port 8761)
├── docker-compose.yml            # Container Orchestration
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18+
- **Python**: v3.10+
- **Java SDK**: OpenJDK 21
- **Ollama**: Installed locally with llama3.2 pulled (`ollama pull llama3.2`)

### 1. Run Microservices

**Django REST Service (Port 8001)**
```bash
cd django-chat-service
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8001
```

**AI Insights Service (Port 8002)**
```bash
cd ai-insights-service
pip install -r requirements.txt # or ./mvnw spring-boot:run if configured in Java
python manage.py runserver 8002
```

**mcpdo Spring Boot Service (Port 8081)**
```bash
cd mcpdo-main
./mvnw spring-boot:run
```

### 2. Run Local LLM Server

```bash
ollama serve
ollama run llama3.2
```

### 3. Start Frontend Development Server

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5175](http://localhost:5175) in your browser.

## 📜 Regulatory & Disclosures

Banfico is a financial technology demonstration platform. Banking services and deposit disclosures adhere to OBIE AISP open-banking standard specifications.

## 📄 License

This project is open source and available under the MIT License.
