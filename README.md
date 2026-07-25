# Banfico AI Financial Platform

## Executive Summary

Banfico is an AI-powered financial management platform built to bridge the gap between complex banking ledgers and actionable financial decisions. Built for modern open-banking ecosystems, Banfico pairs real-time OBIE AISP (Account Information Service Provider) data with Google Gemini 2.5 Flash to automatically audit cashflow, categorize transactions, and generate personalized financial recommendations.

Traditional financial applications present raw data in static tables, requiring manual analysis by the user. Banfico transforms transaction streams into structured insights, providing automated subscription detection, high-yield cash sweep recommendations, and dynamic timeframe analytics.

---

## Key Features

### 1. Google Gemini 2.5 Flash AI Recommendation Engine
•⁠  ⁠*Real-Time Spending Analysis*: The platform evaluates income versus outflow ratios, discretionary spending percentages, and net cash surpluses.
•⁠  ⁠*Automated Actionable Recommendations*: Generates structured, financial recommendations powered by Google Gemini 2.5 Flash:
  * *High-Yield Vault Auto-Sweeps*: Calculates monthly net surplus and suggests automated sweeps to high-yield savings accounts (4.30% APY).
  * *Subscription Audits*: Identifies recurring charges and estimates potential monthly savings from consolidating unused streaming services.
  * *Discretionary Category Caps*: Flags high-variable spending categories (such as dining) and calculates realistic budget limits.
•⁠  ⁠*Interactive AI Assistant*: A floating chat interface connected to Django REST Framework and Google Gemini for real-time conversational financial analysis.

### 2. OBIE AISP Open Banking Integration & Multi-Account Switching
•⁠  ⁠*Multi-Account Support*: Seamless switching between multiple linked accounts (Everyday Checking, Savings Vault, Bills Account).
•⁠  ⁠*Live Balance Trend Visualizations*: Real-time SVG sparklines and ApexCharts depicting balance progression and historical trends.
•⁠  ⁠*Transaction Categorization*: Automated categorization engine for merchant data, pending transactions, and settlement statuses.

### 3. Dynamic Timeframe Analytics Engine
•⁠  ⁠*Flexible Timeframe Filtering*: Switch between four distinct reporting windows:
  * This Week (7 days)
  * This Month (30 days)
  * Last 90 Days
  * Year to Date (YTD / 365 days)
•⁠  ⁠*Synchronized Metric Updates*: Toggling the timeframe dynamically recalculates total outflow, total inflow, category distributions, payment counts, and re-triggers Gemini AI recommendations tailored to the selected window.

### 4. Authentication & Compliance Workflow
•⁠  ⁠*Keycloak OpenID Connect (OIDC)*: Enterprise single sign-on authentication framework.
•⁠  ⁠*Mandatory Terms & Conditions Modal*: Compliance workflow enforcing agreement to terms prior to authentication, accompanied by an interactive modal detailing account security, Open Banking data privacy, and FDIC insurance disclosures.

---

## System Architecture


                          +---------------------------+
                          |     React 19 Frontend     |
                          |   (Vite / Framer Motion)  |
                          +-------------+-------------+
                                        |
             +--------------------------+--------------------------+
             |                                                     |
             v                                                     v
+---------------------------+                         +---------------------------+
|    Django REST Service    |                         |   mcpdo Spring Boot App   |
|   (Python / Django REST)  |                         |  (Spring AI / Todo micro) |
+------------+--------------+                         +---------------------------+
             |
             v
+---------------------------+
|     Google Gemini API     |
|    (gemini-2.5-flash)     |
+---------------------------+


---

## Project Structure


ai-finance-platform/
├── frontend/                     # React 19 + Vite Frontend Application
│   ├── src/
│   │   ├── api/                  # API Services (chatApi, recommendationApi, obieApi)
│   │   ├── components/           # UI Components (ChatModal, Navbar, DashboardNav)
│   │   └── pages/                # Home, Auth, Dashboard, Transactions, Spending
├── django-chat-service/          # Django REST Framework + Google Gemini Microservice
│   ├── chat_app/                 # Views & REST Endpoints (/api/chat/, /api/recommendations/)
│   ├── config/                   # Django Settings & CORS Configuration
│   ├── .env                      # API Keys (GEMINI_API_KEY, GEMINI_MODEL)
│   └── manage.py
├── mcpdo-main/                   # Spring Boot Automated Todo Microservice
├── ai-insights-service/          # Financial Insights Microservice
├── api-gateway/                  # Spring Cloud API Gateway
├── discovery-service/            # Netflix Eureka Discovery Service
├── docker-compose.yml            # Multi-container Deployment Setup
└── README.md


---

## Technology Stack

•⁠  ⁠*Frontend*: React 19, Vite, Framer Motion, Vanilla CSS (Glassmorphism), ApexCharts
•⁠  ⁠*Backend Services*: Python 3.14, Django REST Framework, Spring Boot 3.x, Java 21
•⁠  ⁠*Artificial Intelligence*: Google Gemini 2.5 Flash (⁠ gemini-2.5-flash ⁠), ⁠ google-genai ⁠ SDK
•⁠  ⁠*Open Banking Protocols*: OBIE AISP v3.1 Standards
•⁠  ⁠*Authentication*: Keycloak OpenID Connect (OIDC)

---

## Installation & Setup

### Prerequisites
•⁠  ⁠Node.js (v18 or higher)
•⁠  ⁠Python (v3.10 or higher)

### 1. Set Up Django REST Backend

⁠ bash
# Navigate to Django service directory
cd django-chat-service

# Configure environment variables in .env
# Set GEMINI_API_KEY=your_gemini_api_key
# Set GEMINI_MODEL=gemini-2.5-flash

# Install dependencies
pip install -r requirements.txt

# Execute migrations
python manage.py migrate

# Start backend server on port 8001
python manage.py runserver 8001
 ⁠

### 2. Set Up Frontend Application

⁠ bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install Node modules
npm install

# Start Vite development server
npm run dev
 ⁠

The application will be accessible at ⁠ http://localhost:5176/ ⁠.

---

## API Endpoints

### 1. AI Chat Assistant Endpoint
•⁠  ⁠*Path*: ⁠ POST /api/chat/ ⁠
•⁠  ⁠*Content-Type*: ⁠ application/json ⁠
•⁠  ⁠*Request Payload*:
  ⁠ json
  {
    "message": "Analyze my recent spending categories"
  }
   ⁠
•⁠  ⁠*Response Payload*:
  ⁠ json
  {
    "reply": "Based on your recent transactions, dining accounts for 22% of outflow...",
    "model": "gemini-2.5-flash",
    "status": "success"
  }
   ⁠

### 2. AI Spending Recommendations Endpoint
•⁠  ⁠*Path*: ⁠ POST /api/recommendations/ ⁠
•⁠  ⁠*Content-Type*: ⁠ application/json ⁠
•⁠  ⁠*Request Payload*:
  ⁠ json
  {
    "timeframe": "This Month (Last 30 Days)",
    "totalOut": 2450.00,
    "totalIn": 4500.00,
    "categories": [
      { "name": "Housing", "total": 1840 },
      { "name": "Dining", "total": 612 },
      { "name": "Subscriptions", "total": 188 }
    ]
  }
   ⁠
•⁠  ⁠*Response Payload*:
  ⁠ json
  {
    "status": "success",
    "model": "gemini-2.5-flash",
    "recommendations": [
      {
        "id": "rec-1",
        "title": "High-Yield Vault Auto-Sweep",
        "category": "Vault Sweep",
        "impact": "+$1,000.00/mo",
        "type": "vault",
        "summary": "Your net monthly surplus is $2,050. Auto-sweeping $1,000 into your 4.30% APY vault optimizes interest yield.",
        "actionText": "Set Up Auto-Sweep"
      }
    ]
  }
   ⁠

---

## Regulatory & Disclosures

Banfico is a financial technology platform. Banking services and FDIC deposit insurance (up to $250,000) are provided by partner banking institutions. Open Banking connections adhere to OBIE AISP standards.

---

## License

This project is released under the MIT License.
