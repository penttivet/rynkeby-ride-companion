"use client";

import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Today", icon: "🏁" },
  { href: "/sos", label: "SOS", icon: "🆘" },
  { href: "/chat", label: "Chat", icon: "🤖" },
  { href: "/translate", label: "Translate", icon: "🌍" },
  { href: "/support", label: "Support", icon: "🚗" },
];

function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bottom-nav"
      style={{ background: "#0d1117", borderTop: "1px solid rgba(255,255,255,0.1)" }}
    >
      <div className="flex max-w-480px mx-auto">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5"
              style={{
                color: active ? "var(--rynkeby-red)" : "var(--text-muted)",
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: active ? 700 : 400,
                fontSize: "0.7rem",
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
                    width: "24px",
                    background: "var(--rynkeby-red)",
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
        <BottomNav />
      </body>
    </html>
  );
}
