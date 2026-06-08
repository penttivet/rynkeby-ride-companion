"use client";
import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/", label: "Today", icon: "🏁" },
  { href: "/sos", label: "SOS", icon: "🆘" },
  { href: "/chat", label: "Chat", icon: "🤖" },
  { href: "/translate", label: "Translate", icon: "🌍" },
  { href: "/support", label: "Support", icon: "🚗" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <html lang="fi">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#0d1117" />
        <title>Rynkeby Ride Companion</title>
      </head>
      <body>
        <main>{children}</main>
        <nav style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
          background: "#0d1117", borderTop: "1px solid rgba(255,255,255,0.1)",
          paddingBottom: "env(safe-area-inset-bottom)",
          display: "flex",
        }}>
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} style={{
                flex: 1, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                padding: "8px 4px", textDecoration: "none",
                color: active ? "#C8102E" : "#8b949e",
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: active ? 700 : 400,
                fontSize: "0.68rem", letterSpacing: "0.04em",
                textTransform: "uppercase", gap: "2px",
              }}>
                <span style={{ fontSize: item.href === "/sos" ? "1.4rem" : "1.15rem" }}>{item.icon}</span>
                <span>{item.label}</span>
                {active && <span style={{ height: 2, width: 20, background: "#C8102E", borderRadius: 2 }} />}
              </Link>
            );
          })}
        </nav>
      </body>
    </html>
  );
}
