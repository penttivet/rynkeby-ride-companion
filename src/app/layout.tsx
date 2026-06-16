"use client";
import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

const navItems = [
  { href: "/", label: "Today", icon: "🏁" },
  { href: "/sos", label: "SOS", icon: "🆘" },
  { href: "/chat", label: "Chat", icon: "🤖" },
  { href: "/team", label: "Team", icon: "🚴" },
  { href: "/translate", label: "Translate", icon: "🌍" },
  { href: "/map", label: "Map", icon: "🗺️" },
  { href: "/support", label: "Support", icon: "🚗" },
];

function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bottom-nav"
      style={{ background: "#0d1117", borderTop: "1px solid rgba(255,255,255,0.1)" }}
    >
      <div style={{ display: "flex", overflowX: "auto", scrollbarWidth: "none" }}>
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                flex: "0 0 auto",
                minWidth: 64,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "8px 4px",
                gap: 2,
                color: active ? "var(--rynkeby-red, #C8102E)" : "#8b949e",
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: active ? 700 : 400,
                fontSize: "0.65rem",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              <span style={{ fontSize: item.href === "/sos" ? "1.4rem" : "1.2rem" }}>
                {item.icon}
              </span>
              <span>{item.label}</span>
              {active && (
                <span
                  style={{
                    display: "block",
                    height: "2px",
                    width: "20px",
                    background: "var(--rynkeby-red, #C8102E)",
                    borderRadius: "2px",
                  }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fi">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#0d1117" />
        <title>Rynkeby Ride Companion</title>
      </head>
      <body>
        <main>{children}</main>
        <Suspense fallback={null}>
          <BottomNav />
        </Suspense>
      </body>
    </html>
  );
}
