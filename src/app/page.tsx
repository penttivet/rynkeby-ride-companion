"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
const router = useRouter();
useEffect(() => {
router.replace("/today");
}, [router]);
return <div style={{ color: "white", padding: "2rem" }}>Ladataan...</div>;
}
