"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("rynkeby_user");
    if (!user) {
      router.push("/join");
    } else {
      router.push("/team");
    }
  }, [router]);

  return (
    <div style={{ minHeight: "100dvh", background: "#0d1117", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#8b949e" }}>Ladataan...</p>
    </div>
  );
}
