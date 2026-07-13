"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "I need to vent about work 😤",
  "Hype me up for an interview 🔥",
  "I'm seriously overthinking this...",
  "I have exciting news! ✨",
];

const SendIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);

function Avatar() {
  return (
    <div
      style={{
        width: "26px",
        height: "26px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #facc15 0%, #f59e0b 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "11px",
        flexShrink: 0,
      }}
    >
      ✨
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "10px", padding: "3px 20px" }}>
      <Avatar />
      <div
        style={{
          padding: "11px 14px",
          borderRadius: "18px 18px 18px 4px",
          backgroundColor: "#141414",
          border: "1px solid #1f1f1f",
          display: "flex",
          gap: "5px",
          alignItems: "center",
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="typing-dot"
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: "#facc15",
              display: "inline-block",
              animationDelay: `${i * 0.18}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function ChatBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <div
      className="animate-fade-up"
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        alignItems: "flex-end",
        gap: "10px",
        padding: "3px 20px",
      }}
    >
      {!isUser && <Avatar />}
      <div
        style={{
          maxWidth: "62%",
          padding: "10px 15px",
          borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          fontSize: "14px",
          lineHeight: "1.65",
          wordBreak: "break-word",
          whiteSpace: "pre-wrap",
          backgroundColor: isUser ? "rgba(250,204,21,0.07)" : "#141414",
          border: isUser ? "1px solid rgba(250,204,21,0.18)" : "1px solid #1f1f1f",
          color: isUser ? "#f0f0f0" : "#dcdcdc",
        }}
      >
        {msg.content}
      </div>
    </div>
  );
}

function SuggestionChip({ label, onClick }: { label: string; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "7px 13px",
        borderRadius: "20px",
        border: `1px solid ${hovered ? "rgba(250,204,21,0.35)" : "#1e1e1e"}`,
        backgroundColor: hovered ? "rgba(250,204,21,0.06)" : "#0f0f0f",
        color: hovered ? "#facc15" : "#666",
        fontSize: "12.5px",
        cursor: "pointer",
        transition: "all 0.13s ease",
        fontFamily: "inherit",
      }}
    >
      {label}
    </button>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const [userId] = useState<string>(() => {
    if (typeof window === "undefined") return "default_user";
    const stored = localStorage.getItem("gossip_user_id");
    if (stored) return stored;
    const id = crypto.randomUUID();
    localStorage.setItem("gossip_user_id", id);
    return id;
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const adjustTextarea = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 128) + "px";
  }, []);

  useEffect(() => {
    adjustTextarea();
  }, [input, adjustTextarea]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text };
    const prevMessages = messages;
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = prevMessages.map(({ role, content }) => ({ role, content }));
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history, user_id: userId }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setMessages((m) => [
        ...m,
        { id: crypto.randomUUID(), role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Ugh, connection hiccup 😅 — try again in a sec, I'm still here 💛",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, userId]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isEmpty = messages.length === 0 && !loading;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "#080808",
      }}
    >
      {/* Messages area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {isEmpty ? (
          /* ── Welcome / empty state ── */
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px 24px",
              gap: "14px",
            }}
          >
            <div
              style={{
                width: "62px",
                height: "62px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #facc15 0%, #f59e0b 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "26px",
                boxShadow: "0 0 50px rgba(250,204,21,0.14)",
              }}
            >
              ✨
            </div>
            <h1
              style={{
                fontSize: "26px",
                fontWeight: 700,
                color: "#f0f0f0",
                letterSpacing: "-0.03em",
                textAlign: "center",
              }}
            >
              hey, i&apos;m gossip<span style={{ color: "#facc15" }}>.ai</span>
            </h1>
            <p
              style={{
                fontSize: "14px",
                color: "#555",
                textAlign: "center",
                maxWidth: "340px",
                lineHeight: 1.65,
              }}
            >
              your AI best friend — here to listen, hype you up, and keep it real.
              <br />
              what&apos;s on your mind?
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                justifyContent: "center",
                maxWidth: "480px",
                marginTop: "8px",
              }}
            >
              {SUGGESTIONS.map((s) => (
                <SuggestionChip
                  key={s}
                  label={s}
                  onClick={() => {
                    setInput(s);
                    setTimeout(() => textareaRef.current?.focus(), 0);
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          /* ── Messages ── */
          <div
            style={{
              paddingTop: "20px",
              paddingBottom: "8px",
              display: "flex",
              flexDirection: "column",
              gap: "2px",
            }}
          >
            {messages.map((msg) => (
              <ChatBubble key={msg.id} msg={msg} />
            ))}
            {loading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input bar */}
      <div
        style={{
          borderTop: "1px solid #161616",
          padding: "14px 20px 18px",
          backgroundColor: "#080808",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "10px",
            backgroundColor: "#0f0f0f",
            border: `1px solid ${inputFocused ? "rgba(250,204,21,0.3)" : "#1e1e1e"}`,
            borderRadius: "13px",
            padding: "10px 12px",
            transition: "border-color 0.15s ease",
          }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            rows={1}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            placeholder="spill the tea... ☕"
            style={{
              flex: 1,
              fontSize: "14px",
              lineHeight: 1.55,
              color: "#f0f0f0",
              resize: "none",
              maxHeight: "128px",
              overflowY: "auto",
              caretColor: "#facc15",
              fontFamily: "inherit",
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              border: "none",
              flexShrink: 0,
              cursor: !input.trim() || loading ? "not-allowed" : "pointer",
              backgroundColor: !input.trim() || loading ? "#1a1a1a" : "#facc15",
              color: !input.trim() || loading ? "#444" : "#000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background-color 0.15s ease, color 0.15s ease",
            }}
          >
            <SendIcon />
          </button>
        </div>
        <p
          style={{
            textAlign: "center",
            fontSize: "10.5px",
            color: "#2a2a2a",
            marginTop: "7px",
            letterSpacing: "0.02em",
          }}
        >
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
