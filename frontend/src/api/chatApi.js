// chatApi.js — API client service connecting to Django REST Framework Gemini AI backend
import axios from "axios";

const DJANGO_CHAT_URL = import.meta.env.VITE_CHAT_API_URL || "http://localhost:8001/api/chat/";
const SPRING_FALLBACK_URL = "http://localhost:8080/api/chat";


/**
 * Send message to Django REST Gemini Chat backend
 * @param {string} message - User query or prompt
 * @returns {Promise<{reply: string, status: "success" | "error", timestamp: string, model?: string}>}
 */
export async function sendChatMessage(message) {
  const payload = { message: message.trim() };

  // 1. Primary Request: Django REST Framework Gemini API Backend
  try {
    const response = await axios.post(DJANGO_CHAT_URL, payload, {
      headers: { "Content-Type": "application/json" },
      timeout: 20000,
    });

    if (response.data && response.data.reply) {
      return {
        reply: response.data.reply,
        model: response.data.model || "gemini-2.5-flash",
        status: "success",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    }
  } catch (djangoErr) {
    console.warn("Django REST Chat endpoint failed, attempting fallback to Spring Boot microservice:", djangoErr.message);
  }

  // 2. Secondary Fallback: Spring Boot Automated Todo Backend (port 8080)
  try {
    const springResponse = await axios.post(SPRING_FALLBACK_URL, payload, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
      timeout: 15000,
    });

    if (springResponse.data && springResponse.data.reply) {
      return {
        reply: springResponse.data.reply,
        model: "Spring AI Automated Todo",
        status: "success",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    }
  } catch (springErr) {
    console.error("Spring Boot fallback request failed:", springErr.message);
  }

  // 3. User-friendly Status Feedback
  return {
    reply: `⚠️ Connection to Django REST Gemini Assistant (http://localhost:8001/api/chat/) is starting or unavailable.\n\nTo ensure live responses:\n- Make sure the Django REST service is running (\`python manage.py runserver 8001\`).\n- Verify your \`GEMINI_API_KEY\` in \`django-chat-service/.env\`.`,
    status: "error",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

}
