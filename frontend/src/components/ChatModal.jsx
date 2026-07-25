// ChatModal.jsx — Floating AI Assistant Chat Modal connected to mcpdo backend
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { sendChatMessage } from "../api/chatApi";
import "./ChatModal.css";

const INITIAL_MESSAGES = [
  {
    id: "welcome-1",
    sender: "bot",
    text: "Hello! I'm your **Banfico MCP AI Assistant**. I can help you manage your financial todos, track tasks, and query automated actions.",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
];

const SUGGESTIONS = [
  "List my active todos",
  "Add task: Review monthly statement",
  "Complete task: Pay electricity bill",
  "What can you do?",
];

export default function ChatModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [copiedId, setCopiedId] = useState(null);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setUnreadCount(0);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  const handleSend = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await sendChatMessage(query);
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: res.reply,
        status: res.status,
        timestamp: res.timestamp,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "bot",
          text: "Sorry, an unexpected error occurred while contacting the chat backend.",
          status: "error",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <div className="chat-modal-container">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <motion.button
          className="chat-trigger-btn"
          onClick={() => setIsOpen(true)}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          aria-label="Open AI Assistant"
        >
          <div className="chat-trigger-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <path d="M8 10h.01" />
              <path d="M12 10h.01" />
              <path d="M16 10h.01" />
            </svg>
          </div>
          <span className="chat-trigger-label">MCP Assistant</span>
          {unreadCount > 0 && <span className="chat-trigger-badge">{unreadCount}</span>}
        </motion.button>
      )}

      {/* Main Chat Modal Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`chat-modal-box ${isExpanded ? "expanded" : ""}`}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            <div className="chat-modal-header">
              <div className="chat-modal-brand">
                <div className="chat-avatar-bot">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="10" rx="2" />
                    <circle cx="12" cy="5" r="2" />
                    <path d="M12 7v4" />
                    <line x1="8" y1="16" x2="8" y2="16" />
                    <line x1="16" y1="16" x2="16" y2="16" />
                  </svg>
                </div>
                <div>
                  <div className="chat-modal-title">
                    Banfico MCP Assistant
                    <span className="chat-status-pill">
                      <span className="chat-status-dot" /> Live
                    </span>
                  </div>
                  <div className="chat-modal-subtitle">Django REST & Gemini 2.5 Flash</div>
                </div>
              </div>


              <div className="chat-modal-actions">
                <button
                  className="chat-action-icon"
                  onClick={() => setIsExpanded(!isExpanded)}
                  title={isExpanded ? "Compress window" : "Expand window"}
                  aria-label="Toggle Expand"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {isExpanded ? (
                      <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                    ) : (
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                    )}
                  </svg>
                </button>
                <button className="chat-action-icon" onClick={handleClear} title="Clear history" aria-label="Clear chat">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
                <button className="chat-action-icon close" onClick={() => setIsOpen(false)} title="Close assistant" aria-label="Close">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Suggested Actions Bar */}
            <div className="chat-suggestions-bar">
              {SUGGESTIONS.map((s, idx) => (
                <button
                  key={idx}
                  className="chat-suggestion-chip"
                  onClick={() => handleSend(s)}
                  disabled={isLoading}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Messages Body */}
            <div className="chat-messages-body">
              {messages.map((msg) => (
                <div key={msg.id} className={`chat-message-row ${msg.sender}`}>
                  {msg.sender === "bot" && (
                    <div className="chat-avatar-msg">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="10" rx="2" />
                        <circle cx="12" cy="5" r="2" />
                      </svg>
                    </div>
                  )}

                  <div className="chat-message-bubble-wrapper">
                    <div className={`chat-message-bubble ${msg.sender} ${msg.status === "error" ? "error" : ""}`}>
                      <div className="chat-message-text">
                        {msg.text.split('\n').map((line, i) => (
                          <p key={i}>{line}</p>
                        ))}
                      </div>
                      <div className="chat-message-meta">
                        <span className="chat-message-time">{msg.timestamp}</span>
                        {msg.sender === "bot" && (
                          <button
                            className="chat-copy-btn"
                            onClick={() => handleCopy(msg.id, msg.text)}
                            title="Copy reply"
                          >
                            {copiedId === msg.id ? "Copied!" : "Copy"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="chat-message-row bot loading">
                  <div className="chat-avatar-msg">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="10" rx="2" />
                    </svg>
                  </div>
                  <div className="chat-typing-indicator">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <div className="chat-modal-footer">
              <form
                className="chat-input-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  className="chat-text-input"
                  placeholder="Ask MCP Assistant or manage todos..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="chat-send-btn"
                  disabled={!input.trim() || isLoading}
                  aria-label="Send message"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </form>
              <div className="chat-footer-note">
                Connected to <code>Django REST Framework</code> & <code>Gemini 2.5 Flash</code>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
