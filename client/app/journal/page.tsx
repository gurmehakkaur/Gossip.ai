"use client";

import { useState, useEffect } from "react";

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: string;
  createdAt: string;
  updatedAt: string;
}

const MOODS = [
  { emoji: "✨", label: "Glowing" },
  { emoji: "😤", label: "Venting" },
  { emoji: "💭", label: "Thinking" },
  { emoji: "😌", label: "Calm" },
  { emoji: "🔥", label: "Fired up" },
  { emoji: "💔", label: "Struggling" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const STORAGE_KEY = "gossip_journal";

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selected, setSelected] = useState<JournalEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [draft, setDraft] = useState({ title: "", content: "", mood: "✨" });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setEntries(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  const persist = (updated: JournalEntry[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setEntries(updated);
  };

  const startNew = () => {
    setDraft({ title: "", content: "", mood: "✨" });
    setSelected(null);
    setIsNew(true);
    setIsEditing(true);
  };

  const selectEntry = (entry: JournalEntry) => {
    setSelected(entry);
    setDraft({ title: entry.title, content: entry.content, mood: entry.mood });
    setIsEditing(false);
    setIsNew(false);
  };

  const saveEntry = () => {
    if (!draft.content.trim()) return;
    const now = new Date().toISOString();

    if (isNew) {
      const entry: JournalEntry = {
        id: crypto.randomUUID(),
        title: draft.title.trim() || "Untitled entry",
        content: draft.content,
        mood: draft.mood,
        createdAt: now,
        updatedAt: now,
      };
      persist([entry, ...entries]);
      setSelected(entry);
    } else if (selected) {
      const updated = entries.map((e) =>
        e.id === selected.id
          ? { ...e, title: draft.title.trim() || "Untitled entry", content: draft.content, mood: draft.mood, updatedAt: now }
          : e
      );
      persist(updated);
      setSelected({ ...selected, title: draft.title.trim() || "Untitled entry", content: draft.content, mood: draft.mood, updatedAt: now });
    }
    setIsEditing(false);
    setIsNew(false);
  };

  const deleteEntry = (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    persist(updated);
    if (selected?.id === id) {
      setSelected(null);
      setIsEditing(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setIsNew(false);
    if (isNew) setSelected(null);
  };

  const hasContent = !!selected || isEditing;

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#080808" }}>

      {/* ── Left panel: entry list ── */}
      <div
        style={{
          width: "260px",
          flexShrink: 0,
          borderRight: "1px solid #161616",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "18px 14px 14px",
            borderBottom: "1px solid #161616",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: "15px", fontWeight: 600, color: "#f0f0f0" }}>Journal</div>
            <div style={{ fontSize: "11px", color: "#444", marginTop: "2px" }}>
              {entries.length} {entries.length === 1 ? "entry" : "entries"}
            </div>
          </div>
          <button
            onClick={startNew}
            title="New entry"
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "7px",
              border: "1px solid #222",
              backgroundColor: "transparent",
              color: "#facc15",
              cursor: "pointer",
              fontSize: "18px",
              lineHeight: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.13s ease",
            }}
          >
            +
          </button>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "6px" }}>
          {entries.length === 0 ? (
            <div
              style={{
                padding: "40px 16px",
                textAlign: "center",
                color: "#3a3a3a",
              }}
            >
              <div style={{ fontSize: "30px", marginBottom: "10px" }}>📖</div>
              <div style={{ fontSize: "12px" }}>No entries yet.</div>
              <div style={{ fontSize: "11px", marginTop: "4px", color: "#2a2a2a" }}>
                Start writing your story.
              </div>
            </div>
          ) : (
            entries.map((entry) => {
              const active = selected?.id === entry.id;
              return (
                <div
                  key={entry.id}
                  onClick={() => selectEntry(entry)}
                  style={{
                    padding: "11px 10px",
                    borderRadius: "8px",
                    marginBottom: "2px",
                    cursor: "pointer",
                    backgroundColor: active ? "#141414" : "transparent",
                    border: active ? "1px solid #1e1e1e" : "1px solid transparent",
                    transition: "all 0.12s ease",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                      marginBottom: "4px",
                    }}
                  >
                    <span style={{ fontSize: "13px" }}>{entry.mood}</span>
                    <span
                      style={{
                        fontSize: "12.5px",
                        fontWeight: 500,
                        color: active ? "#f0f0f0" : "#ccc",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        flex: 1,
                      }}
                    >
                      {entry.title}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "11.5px",
                      color: "#3a3a3a",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {entry.content.slice(0, 55)}…
                  </div>
                  <div style={{ fontSize: "10.5px", color: "#2a2a2a", marginTop: "4px" }}>
                    {formatDate(entry.createdAt)}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Right panel: editor / viewer ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {!hasContent ? (
          /* Empty state */
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              color: "#333",
            }}
          >
            <div style={{ fontSize: "44px" }}>✍️</div>
            <div style={{ fontSize: "14px", color: "#444" }}>Select an entry or start a new one</div>
            <button
              onClick={startNew}
              style={{
                marginTop: "6px",
                padding: "9px 20px",
                borderRadius: "8px",
                border: "1px solid rgba(250,204,21,0.3)",
                backgroundColor: "transparent",
                color: "#facc15",
                fontSize: "13px",
                cursor: "pointer",
                transition: "all 0.13s ease",
                fontFamily: "inherit",
              }}
            >
              + New Entry
            </button>
          </div>
        ) : (
          <>
            {/* Toolbar */}
            <div
              style={{
                padding: "14px 22px",
                borderBottom: "1px solid #161616",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                {isEditing ? (
                  <input
                    autoFocus
                    type="text"
                    value={draft.title}
                    onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                    placeholder="Entry title..."
                    style={{
                      fontSize: "17px",
                      fontWeight: 600,
                      color: "#f0f0f0",
                      width: "100%",
                      fontFamily: "inherit",
                      backgroundColor: "transparent",
                      border: "none",
                      outline: "none",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      fontSize: "17px",
                      fontWeight: 600,
                      color: "#f0f0f0",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {selected?.mood} {selected?.title}
                  </div>
                )}
                {selected && (
                  <div style={{ fontSize: "11px", color: "#3a3a3a", marginTop: "3px" }}>
                    {formatDate(selected.createdAt)} · {formatTime(selected.createdAt)}
                    {selected.updatedAt !== selected.createdAt && " · edited"}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                {isEditing ? (
                  <>
                    {/* Mood picker */}
                    <div style={{ display: "flex", gap: "3px", marginRight: "4px" }}>
                      {MOODS.map((m) => (
                        <button
                          key={m.emoji}
                          onClick={() => setDraft((d) => ({ ...d, mood: m.emoji }))}
                          title={m.label}
                          style={{
                            width: "27px",
                            height: "27px",
                            borderRadius: "6px",
                            border: draft.mood === m.emoji ? "1px solid rgba(250,204,21,0.4)" : "1px solid transparent",
                            backgroundColor: draft.mood === m.emoji ? "rgba(250,204,21,0.08)" : "transparent",
                            cursor: "pointer",
                            fontSize: "14px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.1s ease",
                          }}
                        >
                          {m.emoji}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={cancelEdit}
                      style={{
                        padding: "5px 11px",
                        borderRadius: "6px",
                        border: "1px solid #222",
                        backgroundColor: "transparent",
                        color: "#666",
                        fontSize: "12.5px",
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveEntry}
                      disabled={!draft.content.trim()}
                      style={{
                        padding: "5px 14px",
                        borderRadius: "6px",
                        border: "none",
                        backgroundColor: draft.content.trim() ? "#facc15" : "#1a1a1a",
                        color: draft.content.trim() ? "#000" : "#444",
                        fontSize: "12.5px",
                        fontWeight: 600,
                        cursor: draft.content.trim() ? "pointer" : "not-allowed",
                        fontFamily: "inherit",
                        transition: "all 0.13s ease",
                      }}
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        if (selected) {
                          setDraft({ title: selected.title, content: selected.content, mood: selected.mood });
                          setIsEditing(true);
                        }
                      }}
                      style={{
                        padding: "5px 11px",
                        borderRadius: "6px",
                        border: "1px solid #1e1e1e",
                        backgroundColor: "transparent",
                        color: "#888",
                        fontSize: "12.5px",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        transition: "all 0.13s ease",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => selected && deleteEntry(selected.id)}
                      style={{
                        padding: "5px 11px",
                        borderRadius: "6px",
                        border: "1px solid #1e1e1e",
                        backgroundColor: "transparent",
                        color: "#555",
                        fontSize: "12.5px",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        transition: "all 0.13s ease",
                      }}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Content area */}
            <div style={{ flex: 1, overflow: "auto", padding: "24px 28px" }}>
              {isEditing ? (
                <textarea
                  value={draft.content}
                  onChange={(e) => setDraft((d) => ({ ...d, content: e.target.value }))}
                  placeholder="Write your thoughts... no judgment here 💛"
                  style={{
                    width: "100%",
                    height: "100%",
                    minHeight: "400px",
                    fontSize: "14.5px",
                    lineHeight: 1.8,
                    color: "#d8d8d8",
                    resize: "none",
                    fontFamily: "inherit",
                    caretColor: "#facc15",
                    backgroundColor: "transparent",
                    border: "none",
                    outline: "none",
                  }}
                />
              ) : (
                <div
                  style={{
                    fontSize: "14.5px",
                    lineHeight: 1.8,
                    color: "#c8c8c8",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    maxWidth: "680px",
                  }}
                >
                  {selected?.content}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
