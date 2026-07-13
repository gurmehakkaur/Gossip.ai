"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ChatIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const JournalIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const navItems = [
  { href: "/", label: "Chat", icon: <ChatIcon /> },
  { href: "/journal", label: "Journal", icon: <JournalIcon /> },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: "220px",
        flexShrink: 0,
        height: "100vh",
        backgroundColor: "#0a0a0a",
        borderRight: "1px solid #1a1a1a",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Brand */}
      <div
        style={{
          padding: "22px 20px 18px",
          borderBottom: "1px solid #161616",
        }}
      >
        <div style={{ fontSize: "17px", fontWeight: 700, letterSpacing: "-0.025em", color: "#f0f0f0" }}>
          gossip<span style={{ color: "#facc15" }}>.ai</span>
        </div>
        <div style={{ fontSize: "11px", color: "#444", marginTop: "3px", letterSpacing: "0.01em" }}>
          your AI best friend
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ padding: "10px 8px", flex: 1 }}>
        {navItems.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "9px",
                padding: "9px 11px",
                borderRadius: "8px",
                marginBottom: "2px",
                textDecoration: "none",
                fontSize: "13.5px",
                fontWeight: active ? 500 : 400,
                color: active ? "#facc15" : "#666",
                backgroundColor: active ? "rgba(250,204,21,0.07)" : "transparent",
                border: active ? "1px solid rgba(250,204,21,0.12)" : "1px solid transparent",
                transition: "all 0.13s ease",
              }}
            >
              <span style={{ color: active ? "#facc15" : "#444", display: "flex" }}>
                {icon}
              </span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: "14px 16px",
          borderTop: "1px solid #161616",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
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
            fontWeight: 700,
            color: "#000",
            flexShrink: 0,
          }}
        >
          Y
        </div>
        <div>
          <div style={{ fontSize: "12px", color: "#d0d0d0", fontWeight: 500 }}>You</div>
          <div style={{ fontSize: "11px", color: "#444" }}>Active now</div>
        </div>
      </div>
    </aside>
  );
}
